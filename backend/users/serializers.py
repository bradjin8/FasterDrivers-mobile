from django.contrib.auth import get_user_model, authenticate

from rest_framework import serializers

from .models import User
from customers.models import Customer
from customers.serializers import CustomerSerializer
from restaurants.models import Restaurant
from restaurants.serializers import RestaurantSerializer
from drivers.models import Driver
from drivers.serializers import DriverSerializer


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Custom serializer for creating a User
    """
    is_admin = serializers.SerializerMethodField()
    customer = CustomerSerializer(required=False)
    driver = DriverSerializer(required=False)
    restaurant = RestaurantSerializer(required=False)


    class Meta:
        model = get_user_model()
        fields = (
                    'id', 'name', 'first_name', 'last_name', 'email', 'password', 
                    'is_admin', 'type', 'customer', 'driver', 'restaurant'
                )
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5},
                        'email': {'required': True},
                        'name': {'required': False},
                        'type': {'required': True}
                        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data.get('email')
        validated_data['username'] = email
        user = User.objects.create(**validated_data)

        if user.type == "Customer":
            Customer.objects.create(
                user=user
            )
        elif user.type == "Driver":
            Driver.objects.create(
                user=user
            )
            user.is_active = False
            user.save()
        elif user.type == "Restaurant":
            Restaurant.objects.create(
                user=user
            )

        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        email = validated_data.get('email', None)
        if email:
            validated_data['username'] = email
        if 'customer' in validated_data:
            nested_serializer = self.fields['customer']
            nested_instance = instance.customer
            nested_data = validated_data.pop('customer')
            nested_serializer.update(nested_instance, nested_data)
        if 'driver' in validated_data:
            nested_serializer = self.fields['driver']
            nested_instance = instance.driver
            nested_data = validated_data.pop('driver')
            nested_serializer.update(nested_instance, nested_data)
        if 'restaurant' in validated_data:
            nested_serializer = self.fields['restaurant']
            nested_instance = instance.restaurant
            nested_data = validated_data.pop('restaurant')
            nested_serializer.update(nested_instance, nested_data)
        user = super().update(instance, validated_data)
        return user

    def get_is_admin(self, obj):
        return obj.is_superuser


class ChangePasswordSerializer(serializers.Serializer):
    """
    Custom serializer used to set the password for a User
    """
    password_1 = serializers.CharField(
        min_length=4,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password_2 = serializers.CharField(
        min_length=4,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        pass1 = attrs.get('password_1')
        pass2 = attrs.get('password_2')
        if pass1 != pass2:
            raise serializers.ValidationError({'detail': 'Passwords do not match'})
        return super().validate(attrs)


class CustomAuthTokenSerializer(serializers.Serializer):
    """
    Serializer for returning an authenticated User and Token
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            email=email,
            password=password
        )
        if not user:
            raise serializers.ValidationError({'detail': 'Unable to authenticate with provided credentials'})
        attrs['user'] = user
        return attrs
