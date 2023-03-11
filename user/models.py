from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from user.managers import UserManager


class User(AbstractUser):
    username = models.CharField(_('username'), 
                                help_text=_("Required. 150 characters or fewer. Letters, digits and -/_/. only."),
                                max_length=settings.MAX_LENGTH_USERNAME, 
                                unique=True, 
                                error_messages={'unique': _('A user with that username already exists.')})
    email = models.EmailField(_('email address'), unique=True, max_length=settings.MAX_LENGTH_EMAIL, error_messages={'unique': _("This mail is busy.")})
    email_verify = models.BooleanField(default=False, verbose_name=_("Confirmed mail"))
    password = models.CharField(_('password'), max_length=settings.MAX_LENGTH_PASSWORD)
    date_sent_mail = models.DateTimeField(_("Time when the last confirmation email was sent"), auto_now=True, auto_now_add=False)

    first_name = None
    last_name = None

    objects = UserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username


    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        unique_together = ('username', 'email')
