from django.urls import path, include
from rest_framework.routers import DefaultRouter

from home.api.v1.viewsets import (
    SignupViewSet,
    LoginViewSet,
)
from customers.views import CustomerAddressViewSet
from users.viewsets import UserViewSet
from restaurants.views import DishViewSet, AddOnViewSet, ItemViewSet, RestaurantViewSet, CategoryViewSet
from orders.views import OrderViewSet
from payments.views import PaymentViewSet, SubscriptionsViewSet
from reviews.views import ReviewViewSet, DriverReviewViewSet


router = DefaultRouter()
router.register("signup", SignupViewSet, basename="signup")
router.register("login", LoginViewSet, basename="login")
router.register("users", UserViewSet, basename="users")
router.register("orders", OrderViewSet, basename="orders")
router.register("customers/address", CustomerAddressViewSet, basename="customer_addresses")
router.register("restaurants", RestaurantViewSet, basename="restuarants")
router.register("dishes", DishViewSet, basename="dishes")
router.register("categories", CategoryViewSet, basename="categories")
router.register("addons", AddOnViewSet, basename="addons")
router.register("items", ItemViewSet, basename="items")
router.register("payments", PaymentViewSet, basename="payments")
router.register("subscriptions", SubscriptionsViewSet, basename="subscriptions")
router.register("reviews", ReviewViewSet, basename="reviews")
router.register("driver-reviews", DriverReviewViewSet, basename="driver_reviews")

urlpatterns = [
    path("", include(router.urls)),
    path("admin/", include("customadmin.urls"))
]
