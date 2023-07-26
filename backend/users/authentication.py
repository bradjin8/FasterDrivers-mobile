from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication
from rest_framework import exceptions


EXPIRE_HOURS = getattr(settings, 'REST_FRAMEWORK_TOKEN_EXPIRE_HOURS', 24)


class ExpiringTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        try:
            token = self.get_model().objects.get(key=key)
        except ObjectDoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid token')

        if not token.user.is_active:
                raise exceptions.AuthenticationFailed('User is currently inactive')

        if token.user.flagged:
            if token.user.flagged_until and timezone.now() > token.user.flagged_until:
                token.user.flagged = False
                token.user.flagged_until = None
                token.user.save()
            else:
                 raise exceptions.AuthenticationFailed('User has been flagged. Contact your administrator')

        return token.user, token
