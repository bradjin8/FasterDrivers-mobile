from django.db import models
from django.contrib.auth import get_user_model

from home.models import UUIDModel
from reviews.models import Review, DriverReview


User = get_user_model()


class Feedback(UUIDModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    responded = models.BooleanField(default=False)


class HotKeyword(UUIDModel):
    name = models.CharField(max_length=200, unique=True)


class FlaggedItem(UUIDModel):
    review = models.ForeignKey(Review, on_delete=models.CASCADE, null=True, blank=True, related_name='flagged_items')
    driver_review = models.ForeignKey(DriverReview, on_delete=models.CASCADE, null=True, blank=True, related_name='flagged_items')
    keyword = models.ForeignKey(HotKeyword, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
