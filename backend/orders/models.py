from django.contrib.auth import get_user_model
from django.contrib.gis.db import models

from decimal import Decimal

from home.models import UUIDModel
from restaurants.models import Dish, Item, Restaurant
from customers.models import CustomerAddress

from .constants import ORDER_STATUS


User = get_user_model()


class Order(UUIDModel):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    driver = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='driver_orders',
        blank=True,
        null=True
    )
    sub_total = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0
    )
    fees = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0
    )
    tip = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0
    )
    total = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        default=0
    )
    address = models.ForeignKey(
        CustomerAddress,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    special_instructions = models.TextField(
        blank=True
    )
    status = models.CharField(
        choices=ORDER_STATUS,
        max_length=32,
        default="Unpaid"
    )
    paid_at = models.DateTimeField( 
        blank=True,
        null=True
    )
    accepted_at = models.DateTimeField(
        blank=True,
        null=True
    )
    rejected_at = models.DateTimeField(
        blank=True,
        null=True 
    )
    in_progress_at = models.DateTimeField(
        blank=True,
        null=True
    )
    in_transit_at = models.DateTimeField(
        blank=True,
        null=True
    )
    delivered_at = models.DateTimeField(
        blank=True,
        null=True
    )

    def save(self, *args, **kwargs):
        self.fees = self.sub_total * Decimal(0.14)
        self.total = self.sub_total + self.fees + self.tip
        return super().save(*args, **kwargs)


class OrderDish(UUIDModel):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="dishes"
    )
    dish = models.ForeignKey(
        Dish,
        on_delete=models.CASCADE,
        related_name='dishes'
    )
    quantity = models.PositiveIntegerField(
        default=1
    )


class OrderDishAddon(UUIDModel):
    order_dish = models.ForeignKey(
        OrderDish,
        on_delete=models.CASCADE,
        related_name='dish_addons'
    )
    item = models.ForeignKey(
        Item,
        on_delete=models.CASCADE,
        related_name='dish_addons'
    )
    quantity = models.PositiveIntegerField(
        default=1
    )
