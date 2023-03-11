from django.urls import path
from menu.views import Hub

urlpatterns = [
    path('', Hub.as_view(), name='hub')
]
