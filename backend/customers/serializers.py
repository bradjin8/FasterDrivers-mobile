from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from django.contrib.gis.geos import Point

from .models import Customer, CustomerAddress

from fancy_cherry_36842.settings import GOOGLE_API_KEY

import requests


class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = '__all__'
        extra_kwargs = {
            'customer': {
                'required': False
            }
        }

    def create(self, validated_data):
        address_obj = super().create(validated_data)
        address = address_obj.street + ', ' + address_obj.city + ', ' + address_obj.state + ', ' + address_obj.zip_code
        url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={GOOGLE_API_KEY}"
        response = requests.post(url)
        response = response.json()
        try:
            result = response.get('results')[0]
        except Exception as e:
            raise serializers.ValidationError("Unable to find address")
        location = result.get('geometry', {}).get('location')
        lat = location.get('lat')
        lng = location.get('lng')
        location = Point(lng, lat)
        address_obj.location = location
        address_obj.save()
        return address_obj

    def update(self, instance, validated_data):
        address_obj = super().update(instance, validated_data)
        address_fields = ['street', 'city', 'state', 'zip_code']
        if any(x in address_fields for x in validated_data):
            address = address_obj.street + ', ' + address_obj.city + ', ' + address_obj.state + ', ' + address_obj.zip_code
            url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={GOOGLE_API_KEY}"
            response = requests.post(url)
            response = response.json()
            try:
                result = response.get('results')[0]
            except Exception as e:
                raise serializers.ValidationError("Unable to find address")
            location = result.get('geometry', {}).get('location')
            lat = location.get('lat')
            lng = location.get('lng')
            location = Point(lng, lat)
            address_obj.location = location
            address_obj.save()
        return address_obj


class CustomerSerializer(serializers.ModelSerializer):
    addresses = CustomerAddressSerializer(required=False, many=True)

    class Meta:
        model = Customer
        fields = '__all__'

    def update(self, instance, validated_data):
        addresses_data = validated_data.pop('addresses', None)
        customer = super().update(instance, validated_data)
        if addresses_data:
            # addresses_to_create = []
            for address_data in addresses_data:
                address_data["customer"] = customer.id
                serializer = CustomerAddressSerializer(data=address_data)
                if serializer.is_valid():
                    serializer.save()
                else:
                    raise serializers.ValidationError(serializer.errors)
                # addresses_to_create.append(CustomerAddress(
                #     customer=customer,
                #     **address_data
                # ))
            # CustomerAddress.objects.bulk_create(addresses_to_create)
        return customer
