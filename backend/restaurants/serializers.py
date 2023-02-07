from django.db.models import Avg
from rest_framework import serializers

from .models import Restaurant, Dish, AddOn, Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        extra_kwargs = {
            'addon': {
                'required': False
            }
        }


class AddOnSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, required=False)

    class Meta:
        model = AddOn
        fields = '__all__'
        extra_kwargs = {
            'dish': {
                'required': False
            }
        }

    def create(self, validated_data):
        items_data = validated_data.pop('items', None)
        addon = super().create(validated_data)
        if items_data:
            for item_data in items_data:
                item_data['addon'] = addon.id
                serializer = ItemSerializer(data=item_data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    raise serializers.ValidationError(serializer.errors)
        return addon

    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', None)
        addon = super().update(instance, validated_data)
        if items_data:
            for item_data in items_data:
                item_data['addon'] = addon.id
                serializer = ItemSerializer(data=item_data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    raise serializers.ValidationError(serializer.errors)
        return addon


class DishSerializer(serializers.ModelSerializer):
    addons = AddOnSerializer(many=True, required=False)

    class Meta:
        model = Dish
        fields = '__all__'
        extra_kwargs = {
            'restaurant': {
                'required': False
            }
        }

    def create(self, validated_data):
        addons_data = validated_data.pop('addons', None)
        dish = super().create(validated_data)
        if addons_data:
            for addon_data in addons_data:
                addon_data['dish'] = dish.id
                serializer = AddOnSerializer(data=addon_data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    raise serializers.ValidationError(serializer.errors)
        return dish

    def update(self, instance, validated_data):
        addons_data = validated_data.pop('addons', None)
        dish = super().update(instance, validated_data)
        if addons_data:
            for addon_data in addons_data:
                addon_data['dish'] = dish.id
                serializer = AddOnSerializer(data=addon_data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    raise serializers.ValidationError(serializer.errors)
        return dish


class RestaurantSerializer(serializers.ModelSerializer):
    dishes = DishSerializer(required=False, many=True)

    class Meta:
        model = Restaurant
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['rating'] = instance.reviews.aggregate(Avg('rating'))['rating__avg']
        rep['rating_count'] = instance.reviews.count()
        return rep


class ListRestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['rating'] = instance.reviews.aggregate(Avg('rating'))['rating__avg']
        rep['rating_count'] = instance.reviews.count()
        return rep
