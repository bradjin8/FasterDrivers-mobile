import django_filters

from .models import Order

class OrderFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(method='filter_status')

    class Meta:
        model = Order
        fields = ['user', 'driver', 'status', 'restaurant']

    def filter_status(self, queryset, name, value):
        statuses = value.split(',')
        return queryset.filter(status__in=statuses)
