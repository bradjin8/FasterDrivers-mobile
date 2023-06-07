from rest_framework import serializers

from .models import Review, DriverReview

from users.serializers import UserProfileSerializer


class ReviewSerializer(serializers.ModelSerializer):
    """
    A data representation of a Review left for a Service Provider
    """
    class Meta:
        model = Review
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.user:
            rep['user'] = UserProfileSerializer(instance.user).data
        return rep


class DriverReviewSerializer(serializers.ModelSerializer):
    """
    A data representation of a Review left for a Service Provider
    """
    class Meta:
        model = DriverReview
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        if instance.user:
            rep['user'] = UserProfileSerializer(instance.user).data
        return rep
