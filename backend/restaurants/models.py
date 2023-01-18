from home.models import UUIDModel
from users.models import User
from django.contrib.gis.db import models
from django.core.validators import RegexValidator


class Restaurant(UUIDModel):
    """
    A data representation of the Restaurant Profile
    """
    # Validators
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,14}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 14 digits allowed."
        )
    # Fields
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='restaurant/images', blank=True, null=True)
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
    website = models.URLField(
        blank=True
    )
    ein_number = models.CharField(
        max_length=255,
        blank=True
    )
    type = models.CharField(
        max_length=255,
        blank=True
    )
    description = models.TextField(
        blank=True
    )


class Dish(UUIDModel):
    restaurant = models.ForeignKey(
        Restaurant,
        on_delete=models.CASCADE,
        related_name='dishes'
    )
    name = models.CharField(
        max_length=64
    )
    category = models.CharField(
        max_length=64
    )
    description = models.TextField()
    price = models.DecimalField(
        max_digits=6,
        decimal_places=2
    )
    sku_number = models.CharField(
        max_length=255,
        blank=True
    )
    image_1 = models.ImageField(
        upload_to="dishes/images",
        blank=True,
        null=True
    )
    image_2 = models.ImageField(
        upload_to="dishes/images",
        blank=True,
        null=True
    )
    image_3 = models.ImageField(
        upload_to="dishes/images",
        blank=True,
        null=True
    )


class AddOn(UUIDModel):
    dish = models.ForeignKey(
        Dish,
        on_delete=models.CASCADE,
        related_name='addons'
    )
    title = models.CharField(
        max_length=64
    )
    number_of_items = models.PositiveIntegerField()
    required = models.BooleanField()


class Item(UUIDModel):
    addon = models.ForeignKey(
        AddOn,
        on_delete=models.CASCADE,
        related_name='items'
    )
    name = models.CharField(
        max_length=64
    )
    fee = models.DecimalField(
        max_digits=6,
        decimal_places=2
    )
