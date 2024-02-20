from django.urls import path
from servers.consumers import AccessibleServerConsumer, SessionServerConsumer, AccessibleServerv2Consumer

websocket_urlpatterns = [
    path("ws/servers/accessible/<str:token>/", AccessibleServerConsumer.as_asgi()),
    path("ws/servers/v2/accessible/<str:token>/<str:server_id>/", AccessibleServerv2Consumer.as_asgi()),
    path("ws/servers/session/<str:token>/<str:server_id>/<str:login>/<str:password>/", SessionServerConsumer.as_asgi()),
]