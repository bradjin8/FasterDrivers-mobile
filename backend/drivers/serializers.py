from rest_framework import serializers

from .models import Driver


class DriverSerializer(serializers.ModelSerializer):
    assigned_orders = serializers.SerializerMethodField()

    class Meta:
        model = Driver
        fields = '__all__'

    def get_assigned_orders(self, obj):
            return obj.assigned_orders
