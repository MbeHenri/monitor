from django.forms import ModelForm
from servers.models import Server


class ServerValidateForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(ServerValidateForm, self).__init__(*args, **kwargs)

        for field in self.fields:
            self.fields[field].required = False

    class Meta:
        model = Server
        fields = ["hostname", "friendlyname"]
