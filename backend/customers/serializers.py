from rest_framework import serializers

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
