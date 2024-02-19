from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from servers.models import Server
from servers.cmds import accessible_server, cpu, disk, memory, services, uptime, swap

from pssh.clients import SSHClient

# status code of RFC 6455
status = {
    "CLOSE_NORMAL": 1000,
    "CLOSE_UNSUPPORTED": 3000,
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
            try:
                if cmd_type == "cpu":
                    await self.handle_cpu(res)

                elif cmd_type == "disk":
                    await self.handle_disk(res)

                elif cmd_type == "memory":
                    await self.handle_memory(res)

                elif cmd_type == "swap":
                    await self.handle_swap(res)

                elif cmd_type == "uptime":
                    await self.handle_uptime(res)

                elif cmd_type == "services":
                    await self.handle_services(res)

                await self.send_json(res)

            except Exception:
                await self.close(status["CLOSE_UNSUPPORTED"])

    async def handle_services(self, res):
        res["data"] = services(self.client)

    async def handle_uptime(self, res):
        res["data"] = uptime(self.client)

    async def handle_swap(self, res):
        res["data"] = swap(self.client)

    async def handle_memory(self, res):
        res["data"] = memory(self.client)

    async def handle_disk(self, res):
        res["data"] = disk(self.client)

    async def handle_cpu(self, res):
        res["data"] = cpu(self.client)

    @database_sync_to_async
    def get_hostname(self):
        return Server.objects.get(id=self.server_id).hostname

    def clear_client(self):
        if self.client is not None:
            self.client.disconnect()
            self.client = None
