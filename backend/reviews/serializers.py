from rest_framework import serializers

from .models import Review, DriverReview


class ReviewSerializer(serializers.ModelSerializer):
    """
    A data representation of a Review left for a Service Provider
    """
    class Meta:
        model = Review
        fields = '__all__'


class DriverReviewSerializer(serializers.ModelSerializer):
    """
    A data representation of a Review left for a Service Provider
    """
    class Meta:
        model = DriverReview
        fields = '__all__'
