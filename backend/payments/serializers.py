from rest_framework import serializers
from .models import Payment

from djstripe.models import Product, Price, Plan, Subscription
from payments.models import SubscriptionSetup


class SubscriptionSetupSerializer(serializers.ModelSerializer):
    """
    A customer serializer to handle subscription setups
    """
    class Meta:
        model = SubscriptionSetup
        fields = '__all__'
        depth = 3


class SubscriptionSerializer(serializers.ModelSerializer):
    """
    A custom serializer to handle Stripe Plans
    """

    class Meta:
        model = Subscription
        fields = '__all__'
        depth = 3



class PlanSerializer(serializers.ModelSerializer):
    """
    A custom serializer to handle Stripe Plans
    """

    class Meta:
        model = Plan
        fields = '__all__'
        depth = 3


class PriceSerializer(serializers.ModelSerializer):
    """
    A serializer for the multiple prices per Stripe plan
    """
    class Meta:
        model = Price
        exclude = ('product',)


class ProductSerializer(serializers.ModelSerializer):
    """
    A serializer for the Stripe Plans
    """
    prices = PriceSerializer(many=True)

    class Meta:
        model = Product
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    """
    A custom serializer to handle Order Payments
    """

    class Meta:
        model = Payment
        fields = '__all__'
        depth = 3
