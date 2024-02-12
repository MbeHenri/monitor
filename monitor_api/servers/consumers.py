import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer, WebsocketConsumer

from servers.models import Server
from servers.utils import accessible_server


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        self.send(text_data=json.dumps({"message": message}))

    

class AccessibleServerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # self.user_id = self.scope['url_route']['kwargs']['user_id']
        await self.accept()

    async def receive_json(self, text_data=None, byte_data=None):
        server_id = text_data["server_id"]
        res = await self.getAccessible(server_id)
        self.send(text_data=json.dumps(res))

    async def send_message(self, event):
        # from_user = event['from_user']
        # to_user = event['to_user']
        # message = event['message']

        print(event)

        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def getAccessible(self, server_id):
        server = Server.objects.get(id=server_id)
        return {"id": server_id, "value": accessible_server(server.hostname)}


class SessionServerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # self.user_id = self.scope['url_route']['kwargs']['user_id']

        # get a server
        self.server_id = self.scope["url_route"]["kwargs"]["server_id"]
        self.server = self.getServer(self.server_id)

        # connection with a ssh connection towards a server
        self.login = self.scope["url_route"]["kwargs"]["login"]
        self.password = self.scope["url_route"]["kwargs"]["password"]
        self.session = f"session {self.server.hostname}"

        await self.accept()

    async def disconnect(self, close_code):
        # disconnect to a ssh session on server
        self.session = None

        await self.disconnect(close_code)

    async def receive_json(self, text_data=None, byte_data=None):
        type_command = text_data["server_id"]

        res = "ok"
        try:
            pass
            if type_command == "cpu":
                pass
            elif type_command == "memory":
                pass
            elif type_command == "uptime":
                pass
            elif type_command == "services":
                pass
            else:
                res = None
        except:
            res = None

        if res:
            self.send(text_data=json.dumps(res))
        else:
            self.send(text_data=json.dumps({"error": "a error is occured"}))

    @database_sync_to_async
    def getServer(self, server_id):
        return Server.objects.get(id=server_id)
