from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.core.mail import EmailMessage

from home.permissions import IsAuthenticatedOrActivatedDriver
from customadmin.models import HotKeyword, FlaggedItem
from reviews.models import Review, DriverReview
from reviews.serializers import ReviewSerializer, DriverReviewSerializer
from users.authentication import ExpiringTokenAuthentication
from fancy_cherry_36842.settings import SENDGRID_SENDER


class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = (IsAuthenticatedOrActivatedDriver,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Review.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'restaurant']

    def perform_create(self, serializer):
        review = serializer.save(user=self.request.user)
        self.check_for_hot_keywords_and_flag(review)

    def check_for_hot_keywords_and_flag(self, review):
        hot_keywords = HotKeyword.objects.all()
        for keyword in hot_keywords:
            if keyword.name in review.context:
                FlaggedItem.objects.create(review=review, keyword=keyword)
                subject = "Review flagged"
                message = f"A review has been flagged for containing the keyword: {keyword.name}"
                email_msg = EmailMessage(subject, message, from_email=SENDGRID_SENDER, to=[SENDGRID_SENDER])
                email_msg.send()
                break


class DriverReviewViewSet(ModelViewSet):
    serializer_class = DriverReviewSerializer
    permission_classes = (IsAuthenticatedOrActivatedDriver,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = DriverReview.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'driver']


    def perform_create(self, serializer):
        review = serializer.save(user=self.request.user)
        self.check_for_hot_keywords_and_flag(review)

    def check_for_hot_keywords_and_flag(self, review):
        hot_keywords = HotKeyword.objects.all()
        for keyword in hot_keywords:
            if keyword.name in review.context:
                FlaggedItem.objects.create(driver_review=review, keyword=keyword)
                subject = "Review flagged"
                message = f"A review has been flagged for containing the keyword: {keyword.name}"
                email_msg = EmailMessage(subject, message, from_email=SENDGRID_SENDER, to=[SENDGRID_SENDER])
                email_msg.send()
                break
