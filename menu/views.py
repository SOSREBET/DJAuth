from django.shortcuts import render
from django.views import View

# Create your views here.


class Hub(View):

    def get(self, request):
        return render(request, 'menu/hub.html')

    def post(self, request):
        pass