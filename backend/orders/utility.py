from django.db.models import F, Sum, DecimalField, ExpressionWrapper

from restaurants.models import AddOn, Dish


def calculate_total_cost(dishes=None):
    total_cost = 0

    # Iterate over the queryset of Dishes
    for dish in dishes:
        # Calculate the cost of the Dish
        dish_cost = dish.dish.price * dish.quantity

        # Retrieve the related Dish Addons for the current Dish
        addons = dish.dish_addons.all()

        # Calculate the total cost of the related Dish Addons
        addons_cost = addons.annotate(
            addon_cost=ExpressionWrapper(F('item__fee') * F('quantity'), output_field=DecimalField())
        ).aggregate(
            total_addons_cost=Sum('addon_cost')
        )['total_addons_cost'] or 0

        # Add the cost of the Dish and its Dish Addons to the total cost
        total_cost += dish_cost + addons_cost

    return total_cost
