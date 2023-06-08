from django.db.models import Avg
from django.contrib.gis.geos import Point

from rest_framework import serializers

from .models import Restaurant, Dish, AddOn, Item

from fancy_cherry_36842.settings import GOOGLE_API_KEY
from djstripe.models import Account, Subscription

import requests


class SubscriptionSerialzier(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'


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
    connect_account = AccountSerializer(required=False)
    subscription = SubscriptionSerialzier(required=False)

    class Meta:
        model = Restaurant
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['rating'] = instance.reviews.aggregate(Avg('rating'))['rating__avg']
        rep['rating_count'] = instance.reviews.count()
        return rep

    def update(self, instance, validated_data):
        restaurant = super().update(instance, validated_data)
        address_fields = ['street', 'city', 'state', 'zip_code']
        if any(x in address_fields for x in validated_data):
            address = restaurant.street + ', ' + restaurant.city + ', ' + restaurant.state + ', ' + restaurant.zip_code
            url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={GOOGLE_API_KEY}"
            response = requests.post(url)
            response = response.json()
            result = response.get('results')[0]
            location = result.get('geometry', {}).get('location')
            lat = location.get('lat')
            lng = location.get('lng')
            location = Point(lng, lat)
            restaurant.location = location
            restaurant.save()
        return restaurant


class ListRestaurantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Restaurant
        fields = '__all__'

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['rating'] = instance.reviews.aggregate(Avg('rating'))['rating__avg']
        rep['rating_count'] = instance.reviews.count()
        return rep
