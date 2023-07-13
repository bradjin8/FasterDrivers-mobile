from rest_framework import serializers, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from django.db.models import Q
from django.contrib.gis.measure import Distance  
from django.utils import timezone

from home.permissions import IsAuthenticatedOrActivatedDriver
from users.serializers import UserProfileSerializer
from users.models import User
from users.authentication import ExpiringTokenAuthentication
from .serializers import DishSerializer, AddOnSerializer, ItemSerializer, \
                         RestaurantSerializer, ListRestaurantSerializer
from .models import Dish, AddOn, Item, Restaurant
from .utils import sort_by_type, sort_by_category

from orders.models import Order


class DishViewSet(ModelViewSet):
    serializer_class = DishSerializer
    permission_classes = (IsAuthenticatedOrActivatedDriver,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Dish.objects.all()

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user.restaurant)


class AddOnViewSet(ModelViewSet):
    serializer_class = AddOnSerializer
    permission_classes = (IsAuthenticatedOrActivatedDriver,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = AddOn.objects.all()


class ItemViewSet(ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = (IsAuthenticatedOrActivatedDriver,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Item.objects.all()


class RestaurantViewSet(ModelViewSet):
    serializer_class = RestaurantSerializer
    permission_classes = (IsAuthenticatedOrActivatedDriver,)
    authentication_classes = [ExpiringTokenAuthentication]
    queryset = Restaurant.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_serializer_class(self):
        if self.action == 'list':
            return ListRestaurantSerializer
        return RestaurantSerializer

    def get_queryset(self):
        if hasattr(self.request.user, 'restaurant'):
            return Restaurant.objects.filter(
                Q(user=self.request.user) | 
                Q(subscription__status="active", connect_account__payouts_enabled=True)
            )
        return Restaurant.objects.filter(subscription__status="active", connect_account__payouts_enabled=True)


    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True).data
        resp = sort_by_type(serializer)
        return Response(resp)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance).data
        resp = sort_by_category(serializer)
        return Response(resp)

    @action(detail=False, methods=['GET'])
    def nearby_drivers(self, request):
        restaurant_location = request.user.restaurant.location
        nearby_users = User.objects.filter(
            activated_profile=True,
            driver__subscription__status="active",
            driver__connect_account__payouts_enabled=True,
            driver__location__distance_lt=(
                restaurant_location, Distance(km=20)
            )
        )
        serializer = UserProfileSerializer(nearby_users, many=True).data
        return Response(serializer)

    @action(detail=False, methods=['POST'])
    def request_driver(self, request):
        order = Order.objects.get(id=request.data.get('order'))
        driver_user = User.objects.get(id=request.data.get('driver'))
        order.driver = driver_user
        order.driver_assigned_at = timezone.now()
        order.status = "Driver Assigned"
        order.save()
        return Response("Driver requested successfully")

    @action(detail=False, methods=['POST'])
    def reject_assignment(self, request):
        order = Order.objects.get(id=request.data.get('order'))
        order.driver = None
        order.driver_assigned_at = None
        order.status = "Accepted"
        order.save()
        return Response("Driver declined order successfully")
