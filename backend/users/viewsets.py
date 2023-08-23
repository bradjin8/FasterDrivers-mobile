from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings

from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from fancy_cherry_36842.settings import SECRET_KEY, STRIPE_LIVE_MODE, STRIPE_TEST_SECRET_KEY, STRIPE_LIVE_SECRET_KEY

from .models import User
from .serializers import ChangePasswordSerializer, CustomAuthTokenSerializer, UserProfileSerializer

from home.permissions import IsPostOrIsAuthenticated, IsAdmin
from home.utility import auth_token, send_password_reset_email, send_invitation_email

from mixpanel import Mixpanel
import requests
from dateutil.relativedelta import relativedelta
from datetime import datetime
import base64
import stripe


if STRIPE_LIVE_MODE == True:
    stripe.api_key = STRIPE_LIVE_SECRET_KEY
else:
    stripe.api_key = STRIPE_TEST_SECRET_KEY

mp = Mixpanel(settings.MIXPANEL_TOKEN)


class UserViewSet(ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = (IsPostOrIsAuthenticated,)
    authentication_classes  = [TokenAuthentication]
    queryset = User.objects.all()

    # Create User and return Token + Profile
    def create(self, request, *args, **kwargs):
        serializer = UserProfileSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        token, created = Token.objects.get_or_create(user=serializer.instance)
        return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_201_CREATED, headers=headers) 

    # Update Profile
    def partial_update(self, request, *args, **kwargs):
        partial = True
        instance = request.user
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        user = serializer.save()
        mp.track(str(user.id), 'User Signup')
        mp.people_set(str(user.id), {
            '$email': user.email,
            '$type': user.type
        })

        if user.type == 'Customer':
            mp.track(str(user.id), 'Customer Signup')
        elif user.type == 'Driver':
            mp.track(str(user.id), 'Driver Signup')
        elif user.type == 'Restaurant':
            mp.track(str(user.id), 'Restaurant Signup')

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()  # Get the user instance
        user_id = str(user.id)  # Convert user ID to string if it's not

        # Get stripe_customer_id based on user type and ensure it's set.
        stripe_customer_id = None
        if hasattr(user, 'customer') and user.customer.stripe_account:
            stripe_customer_id = user.customer.stripe_account.id
        elif hasattr(user, 'driver') and user.driver.stripe_account:
            stripe_customer_id = user.driver.stripe_account.id
        elif hasattr(user, 'restaurant') and user.restaurant.stripe_account:
            stripe_customer_id = user.restaurant.stripe_account.id

        # Perform the delete operation
        response = super(UserViewSet, self).destroy(request, *args, **kwargs)
        
        # Delete user data from Mixpanel only if the delete operation is successful
        if response.status_code == 204:
            mp.people_delete(user_id)
            
            # Delete Stripe Customer
            if stripe_customer_id:
                try:
                    stripe_customer = stripe.Customer.retrieve(stripe_customer_id)
                    stripe_customer.delete()
                except stripe.error.StripeError as e:
                    return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
                    
            if hasattr(user, 'customer'):
                mp.track(str(user.id), 'Customer Deleted')
            elif hasattr(user, 'driver'):
                mp.track(str(user.id), 'Driver Deleted')
            elif hasattr(user, 'restaurant'):
                mp.track(str(user.id), 'Restaurant Deleted')

        return response

    @action(detail=False, methods=['get'], permission_classes=[IsAdmin])
    def analytics(self, request):
        headers = {
            'Authorization': 'Basic ' + base64.b64encode('{}:'.format(settings.MIXPANEL_SECRET).encode('utf-8')).decode('utf-8')
        }

        # Get the current date and the date 12 months ago
        now = datetime.now()
        last_year = now - relativedelta(months=12)

        jql_query = '''
        function main() {{
        return Events({{
            from_date: "{from_date}",
            to_date: "{to_date}",
            event_selectors: [
                {{event: "Subscription Created"}},
                {{event: "Restaurant Signup"}},
                {{event: "Order Created"}},
                {{event: "User Signup"}},
                {{event: "Active User"}}
            ]
        }})
        .groupBy(['name', 'time.month'], mixpanel.reducer.count());
        }}
        '''.format(from_date=last_year.strftime('%Y-%m-%d'), to_date=now.strftime('%Y-%m-%d'))


        # Send the request to the JQL API
        response = requests.post('https://mixpanel.com/api/2.0/jql', headers=headers, data={'script': jql_query})

        # Parse the response
        data = response.json()

        # Print the results
        return Response(data)

    @action(detail=False, methods=['get'], permission_classes=[IsPostOrIsAuthenticated])
    def invitation(self, request):
        email = request.query_params.get('email')
        send_invitation_email(email)
        return Response(status=status.HTTP_200_OK)

    # Reset Password Email
    @action(detail=False, methods=['post'])
    def reset(self, request):
        try:
            email = request.data.get('email')
            user = User.objects.get(email=email)
        except ObjectDoesNotExist:
            return Response({"detail": "Invalid Email - Does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        send_password_reset_email(user)
        return Response(status=status.HTTP_200_OK)

    # Set password
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def forgot_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['password_1'])
            user.save()
            return Response({'detail': "Password Updated Successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Set password
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            current_password = request.data.get('current_password')
            if not user.check_password(current_password):
                return Response({'detail': "Invalid Current Password"}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.validated_data['password_1'])
            user.save()
            return Response({'detail': "Password Updated Successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Login a User
    @action(detail=False, methods=['post'])
    def login(self, request, **kwargs):
        serializer = CustomAuthTokenSerializer(data=request.data, context = {'request':request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token = auth_token(user)
            serializer = UserProfileSerializer(user, context = {'request':request})
            return Response({'token': token.key, 'user': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Logout a Client
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        try:
            request.user.auth_token.delete()
        except (AttributeError, ObjectDoesNotExist):
            return Response({'detail': 'Authentication Token Missing or Invalid'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(status=status.HTTP_200_OK)

    # Admin a User
    @action(detail=False, methods=['post'])
    def admin(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        key = request.data.get('key')
        if key != SECRET_KEY:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_superuser(email, email, password)
        return Response(status=status.HTTP_200_OK)
