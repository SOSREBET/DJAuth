from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class ModelBackend(object):

    def authenticate(self, request, username, password):
        """Authorization method overridden to allow login by username or email"""
        
        try:
            user = User.objects.get(
                Q(username=username) | Q(email=username)
            )

        except User.DoesNotExist:
            return None

        if user.check_password(password):
            return user

        else:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
