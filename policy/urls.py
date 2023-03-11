from django.urls import path
from policy.views import PolicyView


urlpatterns = [
    path('', PolicyView.as_view(), name='policy')
]
