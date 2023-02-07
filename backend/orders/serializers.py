from rest_framework import serializers

from restaurants.serializers import ListRestaurantSerializer
from users.serializers import UserProfileSerializer

from .models import OrderDishAddon, Order, OrderDish


class OrderDishAddonSerializer(serializers.ModelSerializer):
    """
    A data representation of the set of items assigned to an order for a Dish
    """

    class Meta:
        model = OrderDishAddon
        fields = '__all__'
        extra_kwargs = {
            'order_dish': {
                'required': False
            }
        }


class OrderDishSerializer(serializers.ModelSerializer):
    """
    A data representation of the Dishes assigned to an order
    """
    dish_addons = OrderDishAddonSerializer(required=False, many=True)

    class Meta:
        model = OrderDish
        fields = '__all__'
        extra_kwargs = {
            'order': {
                'required': False
            }
        }


class OrderSerializer(serializers.ModelSerializer):
    """
    A data representation of the Order for a Restuarant
    """
    user = UserProfileSerializer(required=False)
    dishes = OrderDishSerializer(required=True, many=True)


    class Meta:
        model = Order
        fields = '__all__'


    def create(self, validated_data):
        dishes_data = validated_data.pop('dishes', None)
        order = super().create(validated_data)
        if dishes_data:
            for dish_data in dishes_data:
                if "dish_addons" in dish_data:
                    addons_data = dish_data.pop('dish_addons')
                else:
                    addons_data = None
                order_dish = OrderDish.objects.create(
                    **dish_data,
                    order=order
                )
                if addons_data:
                    for addon_data in addons_data:
                        OrderDishAddon.objects.create(
                            **addon_data,
                            order_dish=order_dish
                        )
        return order

    def update(self, instance, validated_data):
        dishes_data = validated_data.pop('dishes', None)
        order = super().update(instance, validated_data)
        if dishes_data:
            for dish_data in dishes_data:
                if "dish_addons" in dish_data:
                    addons_data = dish_data.pop('dish_addons')
                else:
                    addons_data = None
                order_dish = OrderDish.objects.create(
                    **dish_data,
                    order=order
                )
                if addons_data:
                    for addon_data in addons_data:
                        OrderDishAddon.objects.create(
                            **addon_data,
                            order_dish=order_dish
                        )
        return order

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['restaurant'] = ListRestaurantSerializer(instance.restaurant).data
        if instance.driver:
            rep['driver'] = UserProfileSerializer(instance.driver).data
        return rep
