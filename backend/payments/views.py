from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from django.db import transaction

from payments.models import Payment
from payments.serializers import PaymentSerializer

from orders.models import Order
from orders.serializers import OrderSerializer

from users.models import User
from users.serializers import UserProfileSerializer

import stripe
import djstripe
from decimal import Decimal

from fancy_cherry_36842.settings import STRIPE_LIVE_MODE, STRIPE_LIVE_SECRET_KEY, STRIPE_TEST_SECRET_KEY, CONNECTED_SECRET


if STRIPE_LIVE_MODE == True:
    stripe.api_key = STRIPE_LIVE_SECRET_KEY
else:
    stripe.api_key = STRIPE_TEST_SECRET_KEY


class PaymentViewSet(ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Payment.objects.all()

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def test_payment_method(self, request):
        payment_method = stripe.PaymentMethod.create(
        type="card",
        card={
            "number": "4000000000000077",
            "exp_month": 2,
            "exp_year": 2025,
            "cvc": "314",
        },
        )
        return Response(payment_method)


    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def process(self, request):
        order = request.data.get('order')
        payment_method = request.data.get('payment_method')
        # billing_details = request.data.get('billing_details', None)
        try:
            order = Order.objects.get(id=order)
        except Order.DoesNotExist:
            return Response({'detail': 'Invalid Order ID'}, status=status.HTTP_400_BAD_REQUEST)
        amount = int(Decimal(order.total) * 100)
        if order.status != 'Unpaid':
            return Response({'detail': 'Order needs to be in Unpaid status'}, status=status.HTTP_400_BAD_REQUEST)
        customers_data = stripe.Customer.list().data
        customer = None
        for customer_data in customers_data:
            if customer_data.email == request.user.email:
                customer = customer_data
                break
        if customer is None:
            customer = stripe.Customer.create(email=request.user.email)
        djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
        payment_method = stripe.PaymentMethod.attach(payment_method, customer=customer)
        # payment_method = stripe.PaymentMethod.modify(
        #     payment_method['id'],
        #     billing_details={
        #         "address": {
        #             "city": billing_details["address"]["city"],
        #             "country": billing_details["address"]["country"],
        #             "line1": billing_details["address"]["line1"],
        #             "postal_code": billing_details["address"]["postal_code"],
        #         },
        #         "name": billing_details["name"],
        #     }
        # )
        djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
        request.user.customer.stripe_account = djstripe_customer
        request.user.customer.stripe_account.save()
        request.user.customer.save()

        try:
            payment_intent = stripe.PaymentIntent.create(
                customer=customer.id, 
                payment_method=payment_method,  
                currency='usd',
                amount=amount,
                confirm=True,
                application_fee_amount=int(order.fees * 100),
                transfer_data = {
                        "destination": order.restaurant.connect_account.id,
                }
            )

        except Exception as e:
            return Response({"detail" :"The Restaurant owner has not enabled billing. Please contact the owner to resolve this issue."}, status=status.HTTP_400_BAD_REQUEST)
        djstripe_payment_intent = djstripe.models.PaymentIntent.sync_from_stripe_data(payment_intent)
        Payment.objects.create(
            order=order,
            user=request.user,
            amount=order.total,
            payment_intent=djstripe_payment_intent
        )
        order.status = 'Pending'
        order.paid_at = timezone.now()
        order.save()

        return Response({'payment_intent': payment_intent, 'customer': customer})


    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_cards(self, request):
        profile = request.user.customer
        if profile.stripe_account:
            customer_id = profile.stripe_account.id
        else:
            customers_data = stripe.Customer.list().data
            customer = None
            for customer_data in customers_data:
                if customer_data.email == request.user.email:
                    customer = customer_data
                    break
            if customer is None:
                customer = stripe.Customer.create(email=request.user.email)
            djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
            profile.stripe_account = djstripe_customer
            profile.stripe_account.save()
            customer_id = djstripe_customer.id
        payment_methods = stripe.PaymentMethod.list(customer=customer_id, type='card')
        return Response(payment_methods)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def set_default(self, request):
        payment_method_id = request.data.get('payment_method', None)
        if payment_method_id is None:
            return Response({'detail': 'Missing Payment Method ID'}, status=status.HTTP_400_BAD_REQUEST)
        profile = request.user.customer
        if profile.stripe_account:
            customer_id = profile.stripe_account.id
        else:
            customer_id = None
        if not customer_id:
            customers_data = stripe.Customer.list().data
            customer = None
            for customer_data in customers_data:
                if customer_data.email == request.user.email:
                    customer = customer_data
                    break
            if customer is None:
                customer = stripe.Customer.create(email=request.user.email)
            djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
            profile.stripe_account = djstripe_customer
            profile.stripe_account.save()
            customer_id = djstripe_customer.id
        last_default_pms = stripe.PaymentMethod.list(customer=customer_id, type='card')
        for method in last_default_pms:
            if method.metadata:
                stripe.PaymentMethod.modify(
                    method.id,
                    metadata={"default": "False"}
                )
        payment_method = stripe.PaymentMethod.modify(
            payment_method_id,
            metadata={"default": "True"})
        djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
        payment_methods = stripe.PaymentMethod.list(customer=customer_id, type='card')
        return Response(payment_methods)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def revoke_payment_method(self, request):
        payment_method_id = request.data.get('payment_method', None)
        if payment_method_id is None:
            return Response({'detail': 'Missing Payment Method ID'}, status=status.HTTP_400_BAD_REQUEST)
        profile = request.user.customer
        if profile.stripe_account:
            customer_id = profile.stripe_account.id
        else:
            customer_id = None
        if not customer_id:
            customers_data = stripe.Customer.list().data
            customer = None
            for customer_data in customers_data:
                if customer_data.email == request.user.email:
                    customer = customer_data
                    break
            if customer is None:
                customer = stripe.Customer.create(email=request.user.email)
            djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
            profile.stripe_account = djstripe_customer
            profile.stripe_account.save()
            customer_id = djstripe_customer.id
        payment_method = stripe.PaymentMethod.detach(payment_method_id)
        djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
        payment_methods = stripe.PaymentMethod.list(customer=customer_id, type='card')
        return Response(payment_methods)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def add_payment_method(self, request):
        profile = request.user.customer
        billing_details = request.data.get('billing_details')
        if profile.stripe_account:
            customer_id = profile.stripe_account.id
        else:
            customer_id = None
        if not customer_id:
            customers_data = stripe.Customer.list().data
            customer = None
            for customer_data in customers_data:
                if customer_data.email == request.user.email:
                    customer = customer_data
                    break
            if customer is None:
                customer = stripe.Customer.create(email=request.user.email)
            djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
            profile.stripe_account = djstripe_customer
            profile.stripe_account.save()
            customer_id = djstripe_customer.id
        payment_method_id = request.data.get('payment_method', None)
        if payment_method_id is None:
            return Response({'detail': 'Missing Payment Method ID'}, status=status.HTTP_400_BAD_REQUEST)
        payment_method = stripe.PaymentMethod.attach(payment_method_id, customer=customer_id)
        payment_method = stripe.PaymentMethod.modify(
            payment_method['id'],
            billing_details={
                "address": {
                    "city": billing_details["address"]["city"],
                    "country": billing_details["address"]["country"],
                    "line1": billing_details["address"]["line1"],
                    "postal_code": billing_details["address"]["postal_code"],
                    "state": billing_details["address"]["state"]
                },
                "name": billing_details["name"],
            }
        )
        djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
        payment_methods = stripe.PaymentMethod.list(customer=customer_id, type='card')
        return Response(payment_methods)

    @transaction.atomic
    @action(detail=False, methods=['post'])
    def tip(self, request):
        user =  request.user
        trip_id = request.data.get('trip_id')
        tip = Decimal(request.data.get('tip', 0))

        try:
            order = Order.objects.get(id=trip_id)
        except Order.DoesNotExist:
            return Response({'detail': 'Invalid Order ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.tip = tip
        order.save()

        amount = int(tip * 100)
        if user.customer.stripe_account:
            customer_id = user.customer.stripe_account.id
        else:
            return Response('Missing user payment info', status=status.HTTP_400_BAD_REQUEST)

        payment_method_id = Payment.objects.filter(order=order).first().payment_method.id

        try:
            payment_intent = stripe.PaymentIntent.create(
                customer=customer_id, 
                payment_method=payment_method_id,  
                currency='usd',
                amount=amount,
                confirm=True,
                transfer_data = {
                        "destination": order.restaurant.connect_account.id,
                }
            )

        except Exception as e:
            return Response('Card Declined {}'.format(e), status=status.HTTP_400_BAD_REQUEST)
        djstripe_payment_intent = djstripe.models.PaymentIntent.sync_from_stripe_data(payment_intent)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Check Business Account
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def check(self, request):
        user = request.user.restaurant
        connect_account = user.connect_account
        account = stripe.Account.retrieve(connect_account.id)
        djstripe_account = djstripe.models.Account.sync_from_stripe_data(account)
        user.connect_account = djstripe_account
        user.save()
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Business Account
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def account(self, request):
        user = request.user.restaurant
        if user.connect_account:
            account_id = user.connect_account.id
            link = stripe.AccountLink.create(
                account=account_id,
                refresh_url="http://localhost:8080/reauth/",
                return_url="http://localhost:8080/success/",
                type="account_onboarding",
            )
            return Response({'link': link})
        business_name = 'Fast Drivers'
        account = stripe.Account.create(
            country="US",
            type="express",
            capabilities={
                "transfers": {"requested": True},
            },
            business_type="individual",
            business_profile={"name": business_name},
        )
        djstripe_account = djstripe.models.Account.sync_from_stripe_data(account)
        user.connect_account = djstripe_account
        user.save()
        link = stripe.AccountLink.create(
            account=account['id'],
            refresh_url="http://localhost:8080/reauth/",
            return_url="http://localhost:8080/success/",
            type="account_onboarding",
        )
        return Response({'link': link}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'])
    def connected(self, request):
        event = None
        payload = request.body
        sig_header = request.META['HTTP_STRIPE_SIGNATURE']

        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, CONNECTED_SECRET
            )
        except ValueError as e:
            # Invalid payload
            raise e
        except stripe.error.SignatureVerificationError as e:
            # Invalid signature
            raise e

        # Handle the event
        if event.type == 'account.updated':
            data = event.data.get("object", {})
            payouts_enabled = data.get('payouts_enabled')
            account_id = data.get('id')

            user = User.objects.get(
                restaurant__connect_account__id=account_id
            )
            # Conditional can be removed if we are just updating the account info
            if payouts_enabled == True:
                account = stripe.Account.retrieve(account_id)
                djstripe_account = djstripe.models.Account.sync_from_stripe_data(account)
                user.connect_account = djstripe_account
                user.save()
            else:
                # Change if any flags are required
                account = stripe.Account.retrieve(account_id)
                djstripe_account = djstripe.models.Account.sync_from_stripe_data(account)
                user.connect_account = djstripe_account
                user.save()
        return Response(status=status.HTTP_200_OK)