from django.shortcuts import render
from django.views import View

# Create your views here.


class PolicyView(View):

    def get(self, request):
        return render(request, 'policy/policy.html')

    def post(self, request):
        pass
