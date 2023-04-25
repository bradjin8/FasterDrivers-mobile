from django.db import models
from django.contrib.auth import get_user_model
from djstripe.models import PaymentIntent, PaymentMethod

from home.models import UUIDModel
from orders.models import Order

User = get_user_model()


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
    payment_intent = models.OneToOneField(
        PaymentIntent,
        on_delete=models.CASCADE,
        null=True
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
