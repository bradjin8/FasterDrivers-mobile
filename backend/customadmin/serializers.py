from rest_framework import serializers
from django.contrib.auth import get_user_model

from drivers.serializers import DriverSerializer
from restaurants.serializers import RestaurantSerializer
from customers.serializers import CustomerSerializer
from reviews.serializers import ReviewSerializer, DriverReviewSerializer
from .models import Feedback, FlaggedItem, HotKeyword


User = get_user_model()


class AdminUserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    customer = CustomerSerializer(required=False)
    driver = DriverSerializer(required=False)
    restaurant = RestaurantSerializer(required=False)


    class Meta:
        model = get_user_model()
        fields = (
                    'id', 'name', 'first_name', 'last_name', 'email', 'password', 
                    'is_admin', 'type', 'customer', 'driver', 'restaurant', 'is_active', 'flagged',
                    'flagged_until'
                )
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5},
                        'email': {'required': True},
                        'name': {'required': False},
                        'type': {'required': True}
                        }

    def get_is_admin(self, obj):
        return obj.is_superuser


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'
        extra_kwargs = {
            'user': {
                'required': False
            }
        }

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['user'] = AdminUserSerializer(instance.user).data
        return rep


class HotKeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HotKeyword
        fields = '__all__'


class FlaggedItemSerializer(serializers.ModelSerializer):
    review = ReviewSerializer(required=False)
    driver_review = DriverReviewSerializer(required=False)
    keyword = HotKeywordSerializer(required=False)

    class Meta:
        model = FlaggedItem
        fields = '__all__'
