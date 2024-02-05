# from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status

# from rest_framework.views import APIView

from servers.serializers import ServerSerializer
from servers.models import Server
from servers.forms import ServerValidateForm


class ServerViewset(ModelViewSet):
    serializer_class = ServerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.servers.all()

    def create(self, request, *args, **kwargs):
        form = ServerValidateForm(self.request.POST)

        if form.is_valid():
            hostname = form.cleaned_data["hostname"]
            friendlyname = form.cleaned_data["friendlyname"]
            server = Server.objects.create(
                user=self.request.user, hostname=hostname, friendlyname=friendlyname
            )
            server = self.serializer_class(server).data
            return Response(server, status=status.HTTP_201_CREATED)
        return Response({"detail": form.errors, "code": "form_invalid"}, status=400)

    def partial_update(self, request, *args, **kwargs):
        form = ServerValidateForm(self.request.POST)
        if form.is_valid():
            hostname = form.cleaned_data["hostname"]
            friendlyname = form.cleaned_data["friendlyname"]
            if hostname:
                return Response(
                    {
                        "detail": "hostname field must not be modify",
                        "code": "update_invalid",
                    },
                    status=status.HTTP_423_LOCKED,
                )
            server = self.get_object()
            server.friendlyname = friendlyname
            server.save()

            return Response(server, status=201)
        return Response(
            {"detail": form.errors, "code": "form_invalid"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def update(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
