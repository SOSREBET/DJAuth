from django.urls import path, include
from django.views.generic import TemplateView
from user.views import Login, PasswordResetViewNew, PasswordResetConfirmViewNew, PasswordChangeViewNew, EmailVerify, Register

urlpatterns = [
    path('login/', Login.as_view(), name='login'),
    path('password_reset/', PasswordResetViewNew.as_view(), name='password_reset'),
    path("reset/<uidb64>/<token>/", PasswordResetConfirmViewNew.as_view(), name="password_reset_confirm"),
    path("password_change/", PasswordChangeViewNew.as_view(), name="password_change"),
    path('', include('django.contrib.auth.urls')),
    path('invalid_verify/', TemplateView.as_view(template_name='registration/invalid_verify.html'), name='invalid_verify'),
    path('verify_email/<uidb64>/<token>/', EmailVerify.as_view(), name='verify_email'),
    path('confirm_email/', TemplateView.as_view(template_name='registration/confirm_email.html'), name='confirm_email'),
    path('signup/', Register.as_view(), name='signup'),
]
