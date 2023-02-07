from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from .models import Customer, CustomerAddress


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
        user = CurrentUserDefault()
        if 'default' in validated_data and validated_data['default']:
            CustomerAddress.objects.filter(customer=user.customer).update(default=False)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'default' in validated_data and validated_data['default']:
            CustomerAddress.objects.filter(customer=instance.customer).update(default=False)
        return super().update(instance, validated_data)


class CustomerSerializer(serializers.ModelSerializer):
    addresses = CustomerAddressSerializer(required=False, many=True)

    class Meta:
        model = Customer
        fields = '__all__'

    def update(self, instance, validated_data):
        addresses_data = validated_data.pop('addresses', None)
        customer = super().update(instance, validated_data)
        if addresses_data:
            addresses_to_create = []
            for address_data in addresses_data:
                addresses_to_create.append(CustomerAddress(
                    customer=customer,
                    **address_data
                ))
            CustomerAddress.objects.bulk_create(addresses_to_create)
        return customer
