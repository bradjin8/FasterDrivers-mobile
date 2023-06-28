from rest_framework import filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django_filters.rest_framework import DjangoFilterBackend

from django.core.mail import EmailMessage
from django.utils import timezone

from fancy_cherry_36842.settings import SENDGRID_SENDER
from home.permissions import IsAdmin
from users.models import User

from .models import Feedback, FlaggedItem, HotKeyword
from .serializers import AdminUserSerializer, FeedbackSerializer, FlaggedItemSerializer, HotKeywordSerializer


class AdminUserViewSet(ModelViewSet):
    serializer_class = AdminUserSerializer
    permission_classes = (IsAdmin,)
    queryset = User.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['is_active', 'flagged', 'type']
    search_fields = ['name', 'first_name', 'last_name', 'email']
    ordering_fields = ['name', 'email', 'flagged_until']

    @action(detail=False, methods=['post'])
    def suspend(self, request):
        user = User.objects.get(pk=request.data['user'])
        if user.flagged:
            user.flagged = False
            user.flagged_until = None
            user.save()
            return Response({'status': 'User reactivated'}, status=status.HTTP_200_OK)
        else:
            user.flagged = True
            user.flagged_until = timezone.now()
            user.save()
            return Response({'status': 'User suspended'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def approve(self, request):
        user = User.objects.get(pk=request.data['user'])
        user.is_active = True
        user.save()

        email_body = """
            Hi {},\n
            Your driver account on our platform has been approved and activated.\n
            You can now log in and start accepting rides.\n
            Regards,\n
            Team Faster Drivers +
            """.format(user.first_name)

        email_msg = EmailMessage("Account Activation - Faster Drivers", email_body, from_email=SENDGRID_SENDER, to=[user.email])
        email_msg.send()

        return Response({'status': 'User approved'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def deny(self, request):
        user = User.objects.get(pk=request.data['user'])

        email_body = """
            Hi {},\n
            Your driver account on our platform is not yet approved.\n
            Please complete your profile and ensure all details are accurate for approval.\n
            Regards,\n
            Team Faster Drivers
            """.format(user.first_name)

        email_msg = EmailMessage("Account Activation - Faster Drivers", email_body, from_email=SENDGRID_SENDER, to=[user.email])
        email_msg.send()

        return Response({'status': 'User denied'}, status=status.HTTP_200_OK)


class AdminFeedbackViewSet(ModelViewSet):
    serializer_class = FeedbackSerializer
    permission_classes = (IsAuthenticated,)
    queryset = Feedback.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__name', 'subject', 'message']
    ordering_fields = ['user__name', 'subject', 'responded']
    filterset_fields = ['responded']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], permission_classes=[IsAdmin])
    def respond(self, request):
        feedback = Feedback.objects.get(pk=request.data['feedback'])
        if not feedback.responded:
            # Use feedback's subject and message for the email
            subject = feedback.subject
            message = feedback.message

            # construct email and send
            email_msg = EmailMessage(subject, message, from_email=SENDGRID_SENDER, to=[feedback.user.email])
            email_msg.content_subtype = "html"
            email_msg.send()

            # mark feedback as responded
            feedback.responded = True
            feedback.save()

            return Response({'status': 'Response sent'}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'Feedback has already been responded to'}, status=status.HTTP_400_BAD_REQUEST)


class AdminFlaggedItemViewSet(ModelViewSet):
    serializer_class = FlaggedItemSerializer
    permission_classes = (IsAdmin,)
    queryset = FlaggedItem.objects.all().order_by('-created_at')
    filter_backends = [filters.SearchFilter]
    search_fields = ['keyword__name']

    @action(detail=False, methods=['delete'])
    def remove_review(self, request):
        flagged_item = FlaggedItem.objects.get(pk=request.data['flagged_item'])
        if flagged_item.review:
            flagged_item.review.delete()
        if flagged_item.driver_review:
            flagged_item.driver_review.delete()
        flagged_item.delete()
        return Response({'status': 'Review and flagged item deleted'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])
    def remove_flag(self, request):
        flagged_item = FlaggedItem.objects.get(pk=request.data['flagged_item'])
        flagged_item.delete()
        return Response({'status': 'Flagged item deleted'}, status=status.HTTP_200_OK)


class AdminHotKeywordViewSet(ModelViewSet):
    serializer_class = HotKeywordSerializer
    permission_classes = (IsAdmin,)
    queryset = HotKeyword.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
