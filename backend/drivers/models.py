from home.models import UUIDModel
from users.models import User
from django.contrib.gis.db import models
from django.core.validators import RegexValidator


class Driver(UUIDModel):
    """
    A data representation of the Driver Profile
    """
    # Validators
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,14}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 14 digits allowed."
        )
    # Fields
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='driver/images', blank=True, null=True)
    phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True
    )
    street = models.CharField(
        max_length=255,
        blank=True
    )
    city = models.CharField(
        max_length=255,
        blank=True
    )
    state = models.CharField(
        max_length=64,
        blank=True
    )
    zip_code = models.CharField(
        max_length=7, 
        blank=True
    )
    location = models.PointField(
        blank=True,
        null=True
    )
    car_make = models.CharField(
        max_length=255,
        blank=True
    )
    car_model = models.CharField(
        max_length=255,
        blank=True
    )
    car_vin = models.CharField(
        max_length=255,
        blank=True
    )
    car_license_number = models.CharField(
        max_length=255,
        blank=True
    )
