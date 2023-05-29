from rest_framework import serializers

from django.db.models import Avg

from .models import Driver


class DriverSerializer(serializers.ModelSerializer):
    assigned_orders = serializers.SerializerMethodField()
    in_transit_orders = serializers.SerializerMethodField()

    class Meta:
        model = Driver
        fields = '__all__'

    def get_assigned_orders(self, obj):
        return obj.assigned_orders

    def get_in_transit_orders(self, obj):
         return obj.in_transit_orders

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['rating'] = instance.reviews.aggregate(Avg('rating'))['rating__avg']
        rep['rating_count'] = instance.reviews.count()
        return rep
