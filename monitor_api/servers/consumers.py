from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from servers.models import Server
from servers.cmds import (
    accessible_server,
    cpu,
    disk,
    memory,
    services,
    uptime,
    swap,
)

from pssh.clients import SSHClient

# status code of RFC 6455
status = {
    "CLOSE_NORMAL": 1000,
    "CLOSE_UNSUPPORTED": 3000,
    "CLOSE_ERROR": 4000,
}


class AccessibleServerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # self.user_id = self.scope['url_route']['kwargs']['user_id']
        await self.accept()

    async def receive_json(self, text_data=None, byte_data=None):
        server_id = text_data["server_id"]
        res = await self.getAccessible(server_id)
        await self.send_json(res)

    @database_sync_to_async
    def getAccessible(self, server_id):
        server = Server.objects.get(id=server_id)
        return {"id": server_id, "value": accessible_server(server.hostname)}


class AccessibleServerv2Consumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.server_id = self.scope["url_route"]["kwargs"]["server_id"]
        await self.accept()

    async def receive_json(self, text_data=None, byte_data=None):
        res = await self.getAccessible(self.server_id)
        await self.send_json(res)

    @database_sync_to_async
    def getAccessible(self, server_id):
        server = Server.objects.get(id=server_id)
        return {"id": server_id, "value": accessible_server(server.hostname)}


class SessionServerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # self.user_id = self.scope['url_route']['kwargs']['user_id']

        self.server_id = self.scope["url_route"]["kwargs"]["server_id"]
        self.client = None

        try:
            hostname = await self.get_hostname()
            login = self.scope["url_route"]["kwargs"]["login"]
            password = self.scope["url_route"]["kwargs"]["password"]
            self.client = SSHClient(hostname, user=login, password=password)
            await self.accept()
        except Exception:
            print()
            await self.close(status["CLOSE_UNSUPPORTED"])

    async def disconnect(self, close_code):
        # disconnect to a ssh session on server
        self.clear_client()

        await self.disconnect(close_code)

    async def receive_json(self, text_data=None, byte_data=None):
        cmd_type = text_data["cmd_type"]

        if cmd_type == "exit":
            await self.close(status["CLOSE_NORMAL"])

        else:
            res = {
                "cmd_type": cmd_type,
                "data": None,
            }
            out = {}
            if cmd_type == "cpu":
                out = await self.handle_cpu()

            elif cmd_type == "disk":
                out = await self.handle_disk()

            elif cmd_type == "memory":
                out = await self.handle_memory()

            elif cmd_type == "swap":
                out = await self.handle_swap()

            elif cmd_type == "uptime":
                out = await self.handle_uptime()

            elif cmd_type == "services":
                out = await self.handle_services()

            if "error" in out.keys():
                res["error"] = {
                    "type": "unknown",
                    "detail": "Un problème est survenu lors de l'exécution de la commande",
                    "describe": out["error"],
                }
            else:
                res["data"] = out["data"]

            await self.send_json(res)

    async def handle_services(self):
        return services(self.client)

    async def handle_uptime(self):
        return uptime(self.client)

    async def handle_swap(self):
        return swap(self.client)

    async def handle_memory(self):
        return memory(self.client)

    async def handle_disk(self):
        return disk(self.client)

    async def handle_cpu(self):
        return cpu(self.client)

    @database_sync_to_async
    def get_hostname(self):
        return Server.objects.get(id=self.server_id).hostname

    def clear_client(self):
        if self.client is not None:
            self.client.disconnect()
            self.client = None
