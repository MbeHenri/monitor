from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Server(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="servers")
    hostname = models.CharField(max_length=25)
    friendlyname = models.CharField(max_length=50)

    def __str__(self):
        return self.hostname

    @property
    def insession(self):
        return self.get_insession()

    def get_insession(self):
        if self.user.is_authenticated:
            list_connection = Connection.objects.filter(server=self)
            return len(list_connection) > 0
        return None


class Connection(models.Model):
    server = models.ForeignKey(Server, on_delete=models.CASCADE)
    login = models.CharField(max_length=25)
    password = models.CharField(max_length=25)

    def __str__(self):
        return self.server
