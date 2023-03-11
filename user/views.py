from django.contrib.auth import authenticate, get_user_model, login
from django.contrib.auth.views import LoginView, PasswordResetView, PasswordResetConfirmView, PasswordChangeView
from django.core.exceptions import ValidationError
from django.http import HttpResponseRedirect as Redirect
from django.shortcuts import render
from django.http import JsonResponse
from django.urls import reverse
from django.utils.http import urlsafe_base64_decode
from django.views import View
from user.forms import UserCreationFormNew, AuthenticationFormNew, PasswordResetFormNew, SetPasswordFormNew, PasswordChangeFormNew
from django.contrib.auth import login as auth_login
from django.contrib.sites.shortcuts import get_current_site
from django.utils.translation import gettext as _
from user.tasks import send_email_for_verify_celery

from django.contrib.auth.tokens import default_token_generator as token_generator

User = get_user_model()
INTERNAL_RESET_SESSION_TOKEN = "_password_reset_token"

# For JS
error_codes = {
    'invalid_login': 400,
    'inactive': 403,
    'too_many_requests': 429,
    'email_not_verified': 401,
    'invalid_password': 401,
}


class Login(LoginView):
    """Custom LoginView has been overridden to work with Ajax"""
    form_class = AuthenticationFormNew
    success_url = '/'

    def form_valid(self, form):
        remember_me = form.cleaned_data['remember_me']  # get remember_me value

        if not remember_me:
            # Here if the remember me is False, that is why expiry is set to 1 second. 
            # So it will automatically close the session after the browser is closed.
            self.request.session.set_expiry(value=1)
            self.request.session.modified = True

        auth_login(self.request, form.get_user())
        return JsonResponse(data={'url': self.success_url, 'status': 201})

    def form_invalid(self, form):
        super().form_invalid(form)
        if form.errors.get('__all__'):
            code = form.errors['__all__'].data[0].code
            code_n = error_codes.get(code, 400)
            if code_n in (401, 429):  # For users with unconfirmed mail
                return JsonResponse(data={'errors': form.errors['__all__'].data[0].message, 'status': code_n, 'text': _("Try again in: ")})
            return JsonResponse(data={'errors': form.errors, 'status': code_n})  # Invalid login
        else:
            return JsonResponse(data={'errors': form.errors, 'status': 400}) # Invalid data
        

class Register(View):
    """Custom Register View to work with Ajax"""
    temp = 'registration/register.html'

    def get(self, request):
        context = {'form': UserCreationFormNew}
        return render(request, self.temp, context)

    def post(self, request):
        form = UserCreationFormNew(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            domain, user_id = get_current_site(request).domain, user.id
            send_email_for_verify_celery.delay(domain, user_id)  # Celery
            # from user.utils import send_email_for_verify  # Without celery
            # send_email_for_verify(domain, user_id)  # Without celery
            return JsonResponse(data={'url': reverse('confirm_email'), 'status': 201})
        
        # AJAX Erros handler
        from_field = request.POST.get('field')
        if from_field:  # From a specific form part (JS focusout)
            if from_field == 'passwords':
                e2 = form.errors.get('password2')
                if e2:
                    return JsonResponse(data={'error2': e2, 'status': 400})  # The password2 field is invalid
                return JsonResponse(data={'status': 201})  # The password2 field is valid
            else:
                error = form.errors.get(from_field)
                if error:  # If field is invalid
                    return JsonResponse(data={'error': error, 'status': 400})
                return JsonResponse(data={'status': 201})  # Field is valid
        # Full form (submit)
        return JsonResponse(data={'errors': form.errors, 'status': 400})


class PasswordResetViewNew(PasswordResetView):
    """Custom PasswordResetView has been overridden to work with Ajax"""
    form_class = PasswordResetFormNew

    def form_valid(self, form):
        super().form_valid(form)
        return JsonResponse(data={'url': self.success_url, 'status': 201})

    def form_invalid(self, form):
        super().form_invalid(form)
        if form.data.get('field') == 'email':  # Request from email field (JS focusout)
            error = form.errors.get('email')
            if error: 
                return JsonResponse(data={'error': error, 'status': 400})  # Email field is invalid
            return JsonResponse(data={'status': 201})  # Email field is valid
        # Full form (submit)
        return JsonResponse(data={'errors': form.errors, 'status': 400})


class PasswordResetConfirmViewNew(PasswordResetConfirmView):
    """Custom PasswordResetConfirmView has been overridden to work with Ajax"""
    form_class = SetPasswordFormNew

    def form_valid(self, form):
        user = form.save()
        if not user.email_verify:
            user.email_verify = True
            user.save()
        super(PasswordResetConfirmViewNew, self).form_valid(form)
        return JsonResponse(data={'url': self.success_url, 'status': 201})

    def form_invalid(self, form):
        super().form_invalid(form)
        from_field = form.data.get('field')
        if from_field:  # From a specific form part (JS focusout)
            if from_field == 'passwords':
                e2 = form.errors.get('new_password2')
                if e2: 
                    return JsonResponse(data={'error2': e2, 'status': 400}) # The password2 field is invalid
                return JsonResponse(data={'status': 201}) # The password2 field is valid
            else:
                error = form.errors.get('new_' + from_field)
                if error:
                    return JsonResponse(data={'error': error, 'status': 400})  # If field is invalid
                return JsonResponse(data={'status': 201})  # Field is valid
        # Full form (submit)
        return JsonResponse(data={'errors': form.errors, 'status': 400})


class PasswordChangeViewNew(PasswordChangeView):
    """Custom PasswordChangeView has been overridden to work with Ajax"""
    form_class = PasswordChangeFormNew

    def form_valid(self, form):
        super().form_valid(form)
        return JsonResponse(data={'url': self.success_url, 'status': 201})

    def form_invalid(self, form):
        super().form_invalid(form)
        from_field = form.data.get('field')
        if from_field:  # From a specific form part (JS focusout)
            if from_field == 'passwords':
                e2 = form.errors.get('new_password2')
                if e2:
                    return JsonResponse(data={'error2': e2, 'status': 400})  # The password2 field is invalid
                return JsonResponse(data={'status': 201}) # The password2 field is valid
            elif from_field == 'old_password':
                code = form.errors.get('old_password')
                if code:
                    code = code.data[0].code
                code_n = error_codes.get(code, 400)
                error = form.errors.get('old_password')
                if error:
                    return JsonResponse(data={'error': error, 'status': code_n})  # The old_password field is invalid
                return JsonResponse(data={'status': 201})  # The old_password field is valid
            else:
                error = form.errors.get('new_' + from_field)
                if error:  
                    return JsonResponse(data={'error': error, 'status': 400})  # If field is invalid
                return JsonResponse(data={'status': 201})  # Field is valid
        # Full form (submit)
        return JsonResponse(data={'errors': form.errors, 'status': 400})
    

class EmailVerify(View):
    """Email Verify View"""
    def get(self, request, uidb64, token):
        user = self.get_user(uidb64)
        if (user is not None) and (token_generator.check_token(user, token)):
            user.email_verify = True
            user.save()
            login(request, user)
            return Redirect('/')
        return Redirect(reverse('invalid_verify'))

    @staticmethod
    def get_user(uidb64):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist, ValidationError):
            user = None
        return user