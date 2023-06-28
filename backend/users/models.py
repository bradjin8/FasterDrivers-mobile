from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _

import uuid

from .constants import USER_TYPES


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_("Name of User"), blank=True, null=True, max_length=255)
    type = models.CharField(
        choices=USER_TYPES,
        max_length=16,
        blank=True
    )
    email = models.EmailField(_("Email of User"), max_length=255, unique=True)
    flagged = models.BooleanField(default=False)
    flagged_until = models.DateTimeField(blank=True, null=True)

    def get_absolute_url(self):
        return reverse("users:detail", kwargs={"username": self.username})
