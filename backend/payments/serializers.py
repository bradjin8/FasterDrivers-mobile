from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    """
    A custom serializer to handle Order Payments
    """

    class Meta:
        model = Payment
        fields = '__all__'
        depth = 3
