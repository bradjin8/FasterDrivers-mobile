from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend

from home.permissions import IsAuthenticatedOrActivatedDriver
from users.authentication import ExpiringTokenAuthentication

from payments.models import Payment

from .filters import OrderFilter
from .serializers import OrderSerializer
from .models import Order

import stripe
import djstripe

from django.utils import timezone

from fancy_cherry_36842.settings import STRIPE_LIVE_MODE, STRIPE_LIVE_SECRET_KEY, STRIPE_TEST_SECRET_KEY, CONNECTED_SECRET

from mixpanel import Mixpanel


mp = Mixpanel(settings.MIXPANEL_TOKEN)


if STRIPE_LIVE_MODE == True:
    stripe.api_key = STRIPE_LIVE_SECRET_KEY
else:
    stripe.api_key = STRIPE_TEST_SECRET_KEY


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticatedOrActivatedDriver,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Order.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_class = OrderFilter

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        mp.track(str(self.request.user.id), 'Order Created')

    def create(self, request, *args, **kwargs):
        if Order.objects.filter(user=request.user, status="Unpaid").exists():
            return Response(
                "Unpaid Order already exists, you must either update or delete that order",
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)

    def accept(self, request):
        ongoing_statuses = ["Accepted", "In Progress", "Driver Assigned", "In Transit"]
        order = Order.objects.get(id=request.query_params.get('order'))

        # Check if driver already has an ongoing order
        if Order.objects.filter(driver=request.user, status__in=ongoing_statuses).exists():
            return Response("You already have an ongoing order.", status=400)

        order.status = "Accepted"
        order.accepted_at = timezone.now()
        order.save()
        serializer = OrderSerializer(order).data
        return Response(serializer)

    @action(detail=False, methods=['get'])
    def reject(self, request):
        order = Order.objects.get(id=request.query_params.get('order'))
        order.status = "Rejected"
        order.rejected_at = timezone.now()
        order.save()

        payments = Payment.objects.filter(order=order)
        for payment in payments:
            payment_intent = payment.payment_intent.id
            stripe.Refund.create(
                payment_intent=payment_intent,
            )
            payment.refunded = True
            payment.save()

        serializer = OrderSerializer(order).data
        return Response(serializer)

    @action(detail=False, methods=['get'])
    def in_progress(self, request):
        order = Order.objects.get(id=request.query_params.get('order'))
        order.status = "In Progress"
        order.in_progress_at = timezone.now()
        order.save()
        serializer = OrderSerializer(order).data
        return Response(serializer)

    @action(detail=False, methods=['get'])
    def in_transit(self, request):
        order = Order.objects.get(id=request.query_params.get('order'))
        order.status = "In Transit"
        order.in_transit_at = timezone.now()
        order.save()
        serializer = OrderSerializer(order).data
        return Response(serializer)

    @action(detail=False, methods=['get'])
    def deliver(self, request):
        order = Order.objects.get(id=request.query_params.get('order'))
        order.status = "Delivered"
        order.delivered_at = timezone.now()
        order.save()
        serializer = OrderSerializer(order).data

        # Transfer appropriate amounts to restaurant and driver
        try:
            restaurant_transfer = stripe.Transfer.create(
                amount=int(order.restaurant_payout * 100),
                currency='usd',
                destination=order.restaurant.connect_account.id,
                # source_transaction=order.customer_charge_id
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            driver_transfer = stripe.Transfer.create(
                amount=int(order.driver_payout * 100),
                currency='usd',
                destination=order.driver.driver.connect_account.id,
                # source_transaction=order.customer_charge_id
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.get(
            order=order
        )

        dj_restaurant_transfer = djstripe.models.Transfer.sync_from_stripe_data(restaurant_transfer)
        dj_driver_transfer = djstripe.models.Transfer.sync_from_stripe_data(driver_transfer)

        payment.restaurant_transfer = dj_restaurant_transfer
        payment.driver_transfer = dj_driver_transfer
        payment.save()

        order.driver.driver.earnings += order.driver_payout
        order.driver.driver.save()

        return Response(serializer)
