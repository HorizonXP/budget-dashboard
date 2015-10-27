from django.contrib.auth.models import User
from rest_framework import viewsets
from . import serializers
from rest_framework.decorators import list_route
from rest_framework.response import Response

class AccountViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.AccountSerializer

    @list_route()
    def current(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
