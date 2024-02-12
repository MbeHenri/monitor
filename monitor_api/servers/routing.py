from django.urls import re_path
from servers.consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<room_name>\w+)/$", ChatConsumer.as_asgi()),
]

""" websocket_patterns = [
    path(r"accessible/<str:token>", AccessibleServerConsumer.as_asgi()),
    path(r"session/<str:token>/<str:login>/<str:password>", SessionServerConsumer.as_asgi()),
] """
