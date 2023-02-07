from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from reviews.models import Review
from reviews.serializers import ReviewSerializer

from users.authentication import ExpiringTokenAuthentication


class ReviewViewSet(ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = (IsAuthenticated,)
    authentication_classes  = [ExpiringTokenAuthentication]
    queryset = Review.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['user', 'restaurant']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
