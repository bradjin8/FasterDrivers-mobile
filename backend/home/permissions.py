from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied

from djstripe.models import Subscription

from restaurants.models import Restaurant

from drivers.models import Driver


class IsPostOrIsAuthenticated(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'POST':
            return True

        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        
        if request.method == 'PATCH' or request.method == 'PUT' or request.method == "DELETE":
            if obj == request.user:
                return True
        
        if request.method == 'GET':
            return True

        return False


class IsAdmin(permissions.BasePermission):

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser and request.user.is_authenticated


class IsGetOrAdmin(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method == 'GET':
            return request.user and request.user.is_authenticated

        return request.user and request.user.is_authenticated and request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True

        if request.method == 'GET':
            return request.user and request.user.is_authenticated

        return False


class HasActiveSubscription(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user

        # Ensure the user is authenticated
        if user and user.is_authenticated:
            if user.type == "Restaurant":
                try:
                    # Check for active subscription in Restaurant
                    if Restaurant.objects.filter(user=user, subscription__status=Subscription.STATUS_ACTIVE).exists():
                        return True
                except Restaurant.DoesNotExist:
                    pass
            elif user.type == "Driver":
                try:
                    # Check for active subscription in Driver
                    if Driver.objects.filter(user=user, subscription__status=Subscription.STATUS_ACTIVE).exists():
                        return True
                except Driver.DoesNotExist:
                    pass

            # If user is authenticated, but doesn't have an active subscription
            raise PermissionDenied("You must have an active subscription to access this feature.")
        else:
            # If user is not authenticated
            raise PermissionDenied("You must be authenticated to access this feature.")
