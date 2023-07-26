from django.core.cache import cache
from django.utils import timezone
from django.conf import settings


from mixpanel import Mixpanel


mp = Mixpanel(settings.MIXPANEL_TOKEN)


class ActiveUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Check if user is authenticated
        if request.user.is_authenticated:
            # Generate cache key
            date_str = timezone.now().strftime('%Y-%m-%d')
            cache_key = f'active-{date_str}-{request.user.id}'
            
            # Check if the flag for this user and this day is already set
            is_active_today = cache.get(cache_key)

            if not is_active_today:
                # If the flag is not set, set it and send an event to Mixpanel
                cache.set(cache_key, True, 24 * 60 * 60)  # Keep the flag for 24 hours
                mp.track(str(request.user.id), 'Active User')

        return response
