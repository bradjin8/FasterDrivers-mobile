from django.core.mail import EmailMessage
from rest_framework.authtoken.models import Token
from fancy_cherry_36842.settings import SENDGRID_SENDER


def auth_token(user):
    token, created = Token.objects.get_or_create(user=user)
    return token

def send_password_reset_email(user):
    email = user.email
    token, created = Token.objects.get_or_create(user=user)
    link = "https://fasterdrivers.com/reset-password?token={}".format(token)
    email_body = """\
            <html>
            <head></head>
            <body>
            <p>
            Hi,<br>
            Please visit the following link to reset your password <br><br>
            <a href="%s">%s</a><br>
            Regards,<br>
            Team Faster Drivers
            </p>
            </body>
            </html>
            """ % (link, link)
    email_msg = EmailMessage("Password Reset - Faster Drivers", email_body, from_email=SENDGRID_SENDER, to=[email])
    email_msg.content_subtype = "html"
    email_msg.send()

def send_invitation_email(email):
    link = "https://fasterdrivers.com/"
    email_body = """\
            <html>
            <head></head>
            <body>
            <p>
            Hi,<br>
            You've been invited to join Faster Drivers. Please click the following link to join now! <br><br>
            <a href="%s">%s</a><br>
            Regards,<br>
            Team Faster Drivers
            </p>
            </body>
            </html>
            """ % (link, link)
    email_msg = EmailMessage("Invitation - Faster Drivers", email_body, from_email=SENDGRID_SENDER, to=[email])
    email_msg.content_subtype = "html"
    email_msg.send()
