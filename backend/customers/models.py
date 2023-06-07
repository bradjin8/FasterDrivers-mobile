from home.models import UUIDModel
from users.models import User
from django.contrib.gis.db import models
from django.core.validators import RegexValidator
from djstripe.models import Customer as StripeCustomer


class Customer(UUIDModel):
    """
    A data representation of the Customer Profile
    """
    # Validators
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,14}$',
        message="Phone number must be entered in the format: '+999999999'. Up to 14 digits allowed."
        )
    # Fields
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='customer/images', blank=True, null=True)
    phone = models.CharField(
        validators=[phone_regex],
        max_length=17,
        blank=True
    )
    stripe_account = models.ForeignKey(
        StripeCustomer,
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )
    cashback = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )


class CustomerAddress(UUIDModel):
    """
    A data representation of the multiple addresses a Customer can have
    """
    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name='addresses'
    )
    default = models.BooleanField(
        default=False
    )
    street = models.CharField(
        max_length=255
    )
    city = models.CharField(
        max_length=255
    )
    state = models.CharField(
        max_length=64
    )
    zip_code = models.CharField(
        max_length=7
    )
    location = models.PointField(
        blank=True,
        null=True
    )
