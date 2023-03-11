from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator as token_generator
from django.template import loader
from django.utils import timezone as tz
from django.conf import settings


User = get_user_model()


def send_email_for_verify(domain: str, user_id: int):
    """Verify mail"""
    user = User.objects.get(id=user_id)

    if not user.email:  # If user haven't email 
        return False
    
    context = {
        'domain': domain,
        'user': user,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': token_generator.make_token(user)
    }

    message = loader.render_to_string('registration/verify_email.html', context=context)
    email = EmailMessage(_('Email confirmation'), message, to=[user.email])
    email.content_subtype = 'html'
    email.send()

    user.date_sent_mail = tz.now()
    user.save()


def send_mail(context, to_email):
    """Password reset mail"""
    context['user'] = User.objects.get(id=context['user'])
    message = loader.render_to_string('registration/password_reset_email.html', context=context)
    email = EmailMessage(_('Password reset'), message, to=[to_email])
    email.content_subtype = 'html'
    email.send()


def check_cd_mail(user) -> bool:
    """CD request to send a mail"""
    last_mail_date = user.date_sent_mail
    if (last_mail_date + tz.timedelta(seconds=settings.CD_RESEND_MAIL_SEC)) > tz.now():  # Check for spam-attempt
        return False
    return True
