from rest_framework import serializers
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from users.authentication import ExpiringTokenAuthentication
from .serializers import DishSerializer, AddOnSerializer, ItemSerializer, \
                         RestaurantSerializer, ListRestaurantSerializer
from .models import Dish, AddOn, Item, Restaurant


class DishViewSet(ModelViewSet):
    serializer_class = DishSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Dish.objects.all()

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)


class AddOnViewSet(ModelViewSet):
    serializer_class = AddOnSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = AddOn.objects.all()


class ItemViewSet(ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Item.objects.all()


class RestaurantViewSet(ModelViewSet):
    serializer_class = RestaurantSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Restaurant.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return ListRestaurantSerializer
        return RestaurantSerializer