from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from users.authentication import ExpiringTokenAuthentication

from .serializers import OrderSerializer
from .models import Order


class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Order.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        if Order.objects.filter(user=request.user, status="Unpaid").exists():
            return Response(
                "Unpaid Order already exists, you must either update or delete that order",
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)