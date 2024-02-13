import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from servers.models import Server
from servers.utils import accessible_server

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
        await self.send(text_data=json.dumps(res))

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
        res["data"] = {
            "services": [],
        }
        # commande pour obtenir la liste des services
        host_output = self.client.run_command(
            """ systemctl list-units --type=service --all --plain --no-pager --no-legend | awk '{ print "\"$1\"#\"$2\"#\"$3\"#\"$4\"" }' """,
        )

        for line in host_output.stdout:
            output = line.split("#")
            res["data"]["services"].append(
                {
                    "name": output[0].split(".")[0],
                    "is_loaded": output[1] == "loaded",
                    "is_active": output[2] == "active",
                    "state": output[3],
                },
            )

    async def handle_uptime(self, res):
        res["data"] = {
            "uptime": {},
        }
        # commandes pour obtenir les pourcentages d'utilisation de la swap
        host_output = self.client.run_command(
            """ uptime -p | awk '{ print "\"$2\"#\"$4\"#\"$6\"" }' """,
        )
        for line in host_output.stdout:
            output = line.split("#")
            res["data"]["uptime"] = {
                "days": int(output[0]),
                "hours": int(output[1]),
                "minutes": int(output[2]),
            }

    async def handle_swap(self, res):
        res["data"] = {
            "swap": {},
        }

        # commandes pour obtenir les pourcentages d'utilisation de la swap
        host_output = self.client.run_command(
            """ swapon |  awk 'NR==2 { print $3 }' """,
        )
        output = "".join(list(host_output.stdout))
        res["data"]["swap"]["size"] = output

        host_output = self.client.run_command(
            """ swapon -s | awk 'NR==2 {print "\"$4\"#\"$3\""}' """,
        )
        output = "".join(list(host_output.stdout))
        output = output.split("#")
        res["data"]["swap"]["used"] = int(output[0]) / int(output[1])

    async def handle_memory(self, res):
        res["data"] = {
            "memory": {},
        }

        # commandes pour obtenir les pourcentages d'utilisation de la mémoire
        host_output = self.client.run_command(
            """ free -h --si | awk 'NR==2 {print $2}' """,
        )
        output = "".join(list(host_output.stdout))
        res["data"]["memory"]["size"] = output
        
        host_output = self.client.run_command(
            """ free | awk 'NR==2 {print "\"$3\"#\"$2\""}' """,
        )
        output = "".join(list(host_output.stdout))
        output = output.split("#")
        res["data"]["memory"]["used"] = int(output[0]) / int(output[1])

    async def handle_disk(self, res):
        res["data"] = {
            "disks": [],
        }
        # commande pour obtenir les pourcentages d'utilisation des disques du serveur
        host_output = self.client.run_command(
            """ df -h | grep -v 'snap' | grep -v 'tmpfs' | tail -n +2 | awk '{print "\"$2\"#\"$6\"#\"$5\"" }' """,
        )
        for line in host_output.stdout:
            output = line.split("#")
            res["data"]["disks"].append(
                {
                    "size": output[0],
                    "mounted": output[1],
                    "used": float(output[2].strip("%")),
                }
            )

    async def handle_cpu(self, res):
        res["data"] = {
            "cpus": [],
        }
        # commande pour obtenir les pourcentages d'utilisation des CPUs du serveur
        host_output = self.client.run_command(
            "mpstat -P ALL 1 1 -o JSON",
        )
        output = "".join(list(host_output.stdout))
        output = json.loads(output)

        for cpu in output["sysstat"]["hosts"][0]["statistics"][0]["cpu-load"]:
            cpu_id = cpu["cpu"]
            if cpu_id != "all":
                res["data"]["cpus"].append({"num": cpu_id, "using": cpu["usr"]})

    @database_sync_to_async
    def get_hostname(self):
        return Server.objects.get(id=self.server_id).hostname

    def clear_client(self):
        if self.client is not None:
            self.client.disconnect()
            self.client = None
