from rest_framework.viewsets import ModelViewSet

from home.permissions import IsAuthenticatedOrActivatedDriver
from users.authentication import ExpiringTokenAuthentication
from .serializers import CustomerAddressSerializer
from .models import CustomerAddress


class CustomerAddressViewSet(ModelViewSet):
    serializer_class = CustomerAddressSerializer
    permission_classes = (IsAuthenticatedOrActivatedDriver,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = CustomerAddress.objects.all()

    def get_queryset(self):
        if self.request.user.type == "Customer":
            return super().get_queryset().filter(customer=self.request.user.customer)
        return super().get_queryset()
