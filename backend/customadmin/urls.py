from django.urls import path, include
from rest_framework.routers import DefaultRouter

from customadmin.views import AdminUserViewSet, AdminFeedbackViewSet, AdminHotKeywordViewSet, AdminFlaggedItemViewSet


router = DefaultRouter()
router.register("users", AdminUserViewSet, basename="admin_users")
router.register("feedback", AdminFeedbackViewSet, basename="admin_feedback")
router.register("hot_keywords", AdminHotKeywordViewSet, basename="admin_hot_keywords")
router.register("flagged_items", AdminFlaggedItemViewSet, basename="admin_flagged_items")

urlpatterns = [
    path("", include(router.urls)),
]
