from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/driver_location/<str:driver_id>/', consumers.DriverLocationConsumer.as_asgi()),
]