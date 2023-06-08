from django.contrib.gis.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MaxValueValidator, MinValueValidator

from home.models import UUIDModel
from restaurants.models import Restaurant
from orders.models import Order
from drivers.models import Driver

User = get_user_model()


class Review(UUIDModel):
    """
    A data representation of a review
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='reviews',
        null=True
    )
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    order = models.OneToOneField(
        Order,
        on_delete=models.SET_NULL,
        null=True
    )
    rating = models.DecimalField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ],
        max_digits=2,
        decimal_places=1
    )
    context = models.TextField(
        blank=True
    )


class DriverReview(UUIDModel):
    """
    A data representation of a review
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='driver_reviews',
        null=True
    )
    driver = models.ForeignKey(
        Driver,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    order = models.OneToOneField(
        Order,
        on_delete=models.SET_NULL,
        null=True
    )
    rating = models.DecimalField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ],
        max_digits=2,
        decimal_places=1
    )
    context = models.TextField(
        blank=True
    )
