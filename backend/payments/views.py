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

from users.authentication import ExpiringTokenAuthentication

from .serializers import SubscriptionSetupSerializer
from .models import SubscriptionSetup
from django.conf import settings

import stripe
import djstripe
from djstripe import webhooks

from decimal import Decimal
from mixpanel import Mixpanel

from fancy_cherry_36842.settings import STRIPE_LIVE_MODE, STRIPE_LIVE_SECRET_KEY, STRIPE_TEST_SECRET_KEY, CONNECTED_SECRET


mp = Mixpanel(settings.MIXPANEL_TOKEN)


if STRIPE_LIVE_MODE == True:
    stripe.api_key = STRIPE_LIVE_SECRET_KEY
else:
    stripe.api_key = STRIPE_TEST_SECRET_KEY


class PaymentViewSet(ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
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

        try:
            order = Order.objects.get(id=order)
        except Order.DoesNotExist:
            return Response({'detail': 'Invalid Order ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        # get cashback used from request data and convert to cents
        cashback_used = Decimal(request.data.get('cashback_used', 0))
        if cashback_used > request.user.customer.cashback:
            return Response({"detail" :"Not enough cashback available."}, status=status.HTTP_400_BAD_REQUEST)
        
        restaurant_payout = (order.sub_total + order.taxes) * Decimal(0.985)
        driver_payout = (order.fees + order.tip) * Decimal(0.985)
        total_payout = order.total
        cashback_earned = total_payout * Decimal(0.015)

        # Deduct cashback used from total amount to be charged
        amount_to_charge = total_payout - cashback_used

        if order.status != 'Unpaid':
            return Response({'detail': 'Order needs to be in Unpaid status'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get the Stripe Customer Infomration
            customers_data = stripe.Customer.list().data
            customer = None
            for customer_data in customers_data:
                if customer_data.email == request.user.email:
                    customer = customer_data
                    break
            if customer is None:
                customer = stripe.Customer.create(email=request.user.email)

            djstripe_customer = djstripe.models.Customer.sync_from_stripe_data(customer)
            payment_method = stripe.PaymentMethod.retrieve(payment_method)
            if payment_method.customer is None:
                if payment_method.customer != djstripe_customer.id:
                    payment_method = stripe.PaymentMethod.attach(payment_method, customer=customer)
                    djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
                else:
                    return Response({"detail": "Payment method belongs to another cusomter"}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        request.user.customer.stripe_account = djstripe_customer
        request.user.customer.stripe_account.save()


        # Create a PaymentIntent instead of Charge
        try:
            customer_payment_intent = stripe.PaymentIntent.create(
                customer=request.user.customer.stripe_account.id,
                payment_method=payment_method,
                amount=int(amount_to_charge * 100),
                currency='usd',
                description=f'Charge for Order {order.id}',
                confirm=True,
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        charge_id = customer_payment_intent.charges.data[0].id
        # Sync with djstripe models
        dj_customer_payment_intent = djstripe.models.PaymentIntent.sync_from_stripe_data(customer_payment_intent)

        Payment.objects.create(
            order=order,
            user=request.user,
            amount=order.total,
            customer_payment_intent=dj_customer_payment_intent,
            # restaurant_transfer=dj_restaurant_transfer,
            # driver_transfer=dj_driver_transfer
        )
        order.status = 'Pending'
        order.paid_at = timezone.now()
        order.cashback_used = cashback_used
        order.driver_payout = driver_payout
        order.restaurant_payout = restaurant_payout
        order.customer_charge_amount = amount_to_charge
        order.customer_charge_id = charge_id
        order.save()

        request.user.customer.cashback += cashback_earned - cashback_used
        request.user.customer.save()
        
        return Response("Payment Successful", status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def add_funds(self, request):
        amount = request.data.get('amount', 0)  # Amount in dollars, for example 100.0

        # Convert amount to cents as Stripe API requires amount in cents
        amount_in_cents = int(Decimal(amount) * 100)

        try:
            # Create a token for the test card number
            token = stripe.Token.create(
                card={
                    'number': '4000000000000077',
                    'exp_month': 12,
                    'exp_year': 2025,
                    'cvc': '123'
                },
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create a charge using the created token
            charge = stripe.Charge.create(
                amount=amount_in_cents,
                currency='usd',
                source=token.id,
                description='Adding funds to account',
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'detail': 'Funds added successfully', 'charge': charge}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_cards(self, request):
        if request.user.type == "Driver":
            profile = request.user.driver
        elif request.user.type == "Restaurant":
            profile = request.user.restaurant
        elif request.user.type == "Customer":
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
        if request.user.type == "Driver":
            profile = request.user.driver
        elif request.user.type == "Restaurant":
            profile = request.user.restaurant
        elif request.user.type == "Customer":
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
        if request.user.type == "Driver":
            profile = request.user.driver
        elif request.user.type == "Restaurant":
            profile = request.user.restaurant
        elif request.user.type == "Customer":
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
        if request.user.type == "Driver":
            profile = request.user.driver
        elif request.user.type == "Restaurant":
            profile = request.user.restaurant
        elif request.user.type == "Customer":
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
            profile.save()
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
        stripe.Customer.modify(
            customer_id,
            invoice_settings={
                'default_payment_method': payment_method['id'],
            },
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
        if request.user.type == "Restaurant":
            profile = request.user.restaurant
        elif request.user.type == "Driver":
            profile = request.user.driver
        connect_account = profile.connect_account
        account = stripe.Account.retrieve(connect_account.id)
        djstripe_account = djstripe.models.Account.sync_from_stripe_data(account)
        profile.connect_account = djstripe_account
        profile.save()
        if profile.connect_account.payouts_enabled:
            return Response(status=status.HTTP_200_OK)
        return Response("Account payouts not enabled. Reattempt account creation to add additional details.", status=status.HTTP_400_BAD_REQUEST)

    # Business Account
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def account(self, request):
        if request.user.type == "Restaurant":
            profile = request.user.restaurant
        elif request.user.type == "Driver":
            profile = request.user.driver
        device = request.query_params.get('device', False)
        if profile.connect_account:
            account_id = profile.connect_account.id
            if device == "mobile":
                link = stripe.AccountLink.create(
                    account=account_id,
                    refresh_url="http://localhost:8080/reauth/",
                    return_url="http://localhost:8080/return/",
                    type="account_onboarding",
                )
                return Response({'link': link})

            else:
                link = stripe.AccountLink.create(
                    account=account_id,
                    refresh_url="https://fasterdrivers.com/restaurant/settings/stripe?reauth=true",
                    return_url="https://fasterdrivers.com/restaurant/settings/stripe?return=true",
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
        profile.connect_account = djstripe_account
        profile.save()
        if device == "mobile":
            link = stripe.AccountLink.create(
                account=account['id'],
                refresh_url="http://localhost:8080/reauth/",
                return_url="http://localhost:8080/return/",
                type="account_onboarding",
            )
            return Response({'link': link})

        else:
            link = stripe.AccountLink.create(
                account=account['id'],
                refresh_url="https://fasterdrivers.com/restaurant/settings/stripe?reauth=true",
                return_url="https://fasterdrivers.com/restaurant/settings/stripe?return=true",
                type="account_onboarding",
            )
            return Response({'link': link})

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

            try:
                user = User.objects.get(
                    restaurant__connect_account__id=account_id
                )
                profile = user.restaurant
            except User.DoesNotExist:
                user = User.objects.get(
                    driver__connect_account__id=account_id
                )
                profile = user.driver
            # Conditional can be removed if we are just updating the account info
            if payouts_enabled == True:
                account = stripe.Account.retrieve(account_id)
                djstripe_account = djstripe.models.Account.sync_from_stripe_data(account)
                profile.connect_account = djstripe_account
                profile.save()
            else:
                # Change if any flags are required
                account = stripe.Account.retrieve(account_id)
                djstripe_account = djstripe.models.Account.sync_from_stripe_data(account)
                profile.connect_account = djstripe_account
                profile.save()
        return Response(status=status.HTTP_200_OK)


class SubscriptionsViewSet(ModelViewSet):
    serializer_class = SubscriptionSetupSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = SubscriptionSetup.objects.all()


    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def plans(self, request):
        if request.user.type == "Restaurant":
            product_name = "Restaurant Subscription"
        elif request.user.type == "Driver":
            product_name = "Driver Subscription"
        else:
            product_name = "All"

        products = stripe.Product.list()

        if product_name == "All":
            plans = dict()
            for product in products:
                if product.name == "Driver Subscription":
                    product_driver = product
                    break
            stripe_plans_driver = stripe.Plan.list(product=product_driver['id'], active=True)
            plans['driver'] = stripe_plans_driver['data']

            for product in products:
                if product.name == "Restaurant Subscription":
                    product_restaurant = product
                    break
            stripe_plans_restaurant = stripe.Plan.list(product=product_restaurant['id'], active=True)
            plans['restaurant'] = stripe_plans_restaurant['data']

        else:
            for product in products:
                if product['name'] == product_name:
                    selected_product = product
                    break
            plans = stripe.Plan.list(product=selected_product['id'], active=True)

        return Response(plans)

    @action(detail=False, methods=['patch'], permission_classes=[IsAuthenticated])
    @transaction.atomic
    def change_subscription(self, request):
        if request.user.type == "Driver":
            profile = request.user.driver
        elif request.user.type == "Restaurant":
            profile = request.user.restaurant
        subscription = profile.subscription
        stripe_sub = stripe.Subscription.retrieve(subscription.id)
        plan_id = request.data.get('plan_id', None)
        sub = stripe.Subscription.modify(
            subscription.id,
            cancel_at_period_end=False,
            proration_behavior='create_prorations',
            items=[{
                'id': stripe_sub['items']['data'][0].id,
                'price': plan_id,
            }]
        )
        djstripe.models.Subscription.sync_from_stripe_data(sub)
        return Response("You've successfully changed your subscription", status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    @transaction.atomic
    def unsubscribe(self, request):
        if request.user.type == "Driver":
            profile = request.user.driver
        elif request.user.type == "Restaurant":
            profile = request.user.restaurant
        subscription = profile.subscription
        sub = stripe.Subscription.delete(subscription.id)
        djstripe.models.Subscription.sync_from_stripe_data(sub)
        mp.track(str(request.user.id), 'Subscription Cancelled')
        return Response("You've successfully unsubscribed", status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    @transaction.atomic
    def subscribe(self, request):
        if request.user.type == "Driver":
            profile = request.user.driver
        elif request.user.type == "Restaurant":
            profile = request.user.restaurant
        subscription = profile.subscription
        if subscription and subscription.status != "canceled":
            return Response({'detail': 'User is already subscribed'}, status=status.HTTP_400_BAD_REQUEST)

        email = request.user.email
        payment_method = request.data.get('payment_method', None)
        plan_id = request.data.get('plan_id', None)

        # customers_data = stripe.Customer.list().data
        customer = profile.stripe_account
        # for customer_data in customers_data:
        #     if customer_data.email == email:
        #         customer = customer_data
        #         break
        try:
            if payment_method is not None:
                    payment_method = stripe.PaymentMethod.retrieve(payment_method)
                    djstripe.models.PaymentMethod.sync_from_stripe_data(payment_method)
                    if customer is None:
                        customer = stripe.Customer.create(
                            email=email,
                            payment_method=payment_method,
                            invoice_settings={
                                'default_payment_method': payment_method,
                            },
                        )

            else:
                return Response({'detail': 'Missing Payment Method'}, status=status.HTTP_400_BAD_REQUEST)

            if request.data.get('trial', None) == "True" or request.data.get('trial', None) == "true":
                subscription = stripe.Subscription.create(
                    customer=customer.id,
                    items=[
                        {
                            'plan': plan_id,
                        },
                    ],
                    expand=['latest_invoice.payment_intent'],
                    trial_period_days=30
                    )
            else:
                subscription = stripe.Subscription.create(
                    customer=customer.id,
                    items=[
                        {
                            'plan': plan_id,
                        },
                    ],
                    expand=['latest_invoice.payment_intent'],
                )
            djstripe_subscription = djstripe.models.Subscription.sync_from_stripe_data(subscription)
        except stripe.error.CardError as e:
            return Response({'detail': 'Card Declined'})

        # associate customer and subscription with the user
        # profile.stripe_account = djstripe_customer
        profile.subscription = djstripe_subscription
        profile.save()

        mp.track(str(request.user.id), 'Subscription Created')

        # return information back to the front end
        data = {
            # 'customer': customer,
            'subscription': subscription
        }
        return Response(data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['patch'])
    def update_price(self, request):
        new_price_value = int(Decimal(request.data.get('price', 0)) * 100)
        old_price_id = request.data.get('price_id', None)

        if new_price_value is None:
            return Response({'error': 'No new price provided'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the Stripe Price object using the Stripe API
        old_price = stripe.Price.retrieve(old_price_id)

        # Fetch the associated Stripe Product object
        old_product = stripe.Product.retrieve(old_price.product)

        # Create a new Stripe Product with the same name and attributes as the old product
        new_product = stripe.Product.create(
            name=old_product.name,
            attributes=old_product.attributes,
        )

        # Create a new Stripe Price with the new price and attach it to the new product
        new_price = stripe.Price.create(
            unit_amount=new_price_value,
            currency=old_price.currency,
            recurring=old_price.recurring,
            product=new_product.id,
        )

        # Set the old product to inactive
        stripe.Product.modify(
            old_product.id,
            active=False
        )

        return Response({'status': 'Price updated'}, status=status.HTTP_200_OK)
