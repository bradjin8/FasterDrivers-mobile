from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    """
    A data representation of a Review left for a Service Provider
    """
    class Meta:
        model = Review
        fields = '__all__'
