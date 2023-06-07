from django.db import models
from django.contrib.auth import get_user_model
from djstripe.models import PaymentMethod, Transfer, PaymentIntent

from home.models import UUIDModel
from orders.models import Order

from djstripe.models import Subscription


User = get_user_model()


class SubscriptionSetup(UUIDModel):
    """
    A model to represent the moment a subscription has been created
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True
    )
    date = models.DateTimeField(
        auto_now_add=True
    )
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.SET_NULL,
        null=True
    )


class Payment(UUIDModel):
    """
    A model to represent the Order Payments
    """
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        null=True,
        related_name='payments'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        related_name='payments'
    )
    amount = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )
    customer_payment_intent = models.OneToOneField(
        PaymentIntent,
        on_delete=models.CASCADE,
        null=True
    )
    restaurant_transfer = models.OneToOneField(
        Transfer,
        on_delete=models.CASCADE,
        null=True,
        related_name='restaurant_transfers'
    )
    driver_transfer = models.OneToOneField(
        Transfer,
        on_delete=models.CASCADE,
        null=True,
        related_name='driver_transfers'
    )
    payment_method = models.OneToOneField(
        PaymentMethod,
        on_delete=models.SET_NULL,
        null=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    refunded = models.BooleanField(
        default=False
    )
