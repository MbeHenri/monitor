from django.contrib import admin
from servers.models import Server
# Register your models here.

class ServerAdmin(admin.ModelAdmin):
    # list of fields display on admin site 
    list_display = ("hostname",)
    
admin.site.register(Server, ServerAdmin)
    
