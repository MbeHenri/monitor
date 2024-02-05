from rest_framework.serializers import ModelSerializer

from servers.models import Server


# serializer for servers
class ServerSerializer(ModelSerializer):
    class Meta:
        model = Server
        fields = ["id", "hostname", "friendlyname"]
