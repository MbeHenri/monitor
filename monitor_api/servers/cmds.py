import json
from pssh.clients import SSHClient
from subprocess import run, TimeoutExpired


def accessible_server(hostname: str) -> bool:
    try:
        res = run(["ping", "-c", "1", hostname])
        return res.returncode == 0
    except TimeoutExpired:
        return False


def services(client: SSHClient):
    services = []
    # commande pour obtenir la liste des services
    host_output = client.run_command(
        """ systemctl list-units --type=service --all --plain --no-pager --no-legend | awk '{ print "\"$1\"#\"$2\"#\"$3\"#\"$4\"" }' """,
    )

    for line in host_output.stdout:
        output = line.split("#")
        services.append(
            {
                "name": output[0].split(".")[0],
                "is_loaded": output[1] == "loaded",
                "is_active": output[2] == "active",
                "state": output[3],
            },
        )

    return services


def uptime(client: SSHClient):
    uptime = {}
    # commandes pour obtenir les pourcentages d'utilisation de la swap
    host_output = client.run_command(
        """ uptime -p | awk '{ print "\"$2\"#\"$4\"#\"$6\"" }' """,
    )
    for line in host_output.stdout:
        output = line.split("#")
        uptime = {
            "days": int(output[0]),
            "hours": int(output[1]),
            "minutes": int(output[2]),
        }
    return uptime


def swap(client: SSHClient):
    swap = {}
    # commandes pour obtenir les pourcentages d'utilisation de la swap
    host_output = client.run_command(
        """ swapon |  awk 'NR==2 { print $3 }' """,
    )
    output = "".join(list(host_output.stdout))
    swap["size"] = output

    host_output = client.run_command(
        """ swapon -s | awk 'NR==2 {print "\"$4\"#\"$3\""}' """,
    )
    output = "".join(list(host_output.stdout))
    output = output.split("#")
    swap["used"] = int(output[0]) / int(output[1])

    return swap


def memory(client: SSHClient):
    memory = {}
    # commandes pour obtenir les pourcentages d'utilisation de la mémoire
    host_output = client.run_command(
        """ free -h --si | awk 'NR==2 {print $2}' """,
    )
    output = "".join(list(host_output.stdout))
    memory["size"] = output

    host_output = client.run_command(
        """ free | awk 'NR==2 {print "\"$3\"#\"$2\""}' """,
    )
    output = "".join(list(host_output.stdout))
    output = output.split("#")
    memory["used"] = int(output[0]) / int(output[1])
    return memory


def disk(client: SSHClient):
    disks = []
    # commande pour obtenir les pourcentages d'utilisation des disques du serveur
    host_output = client.run_command(
        """ df -h | grep -v 'snap' | grep -v 'tmpfs' | tail -n +2 | awk '{print "\"$2\"#\"$6\"#\"$5\"" }' """,
    )
    for line in host_output.stdout:
        output = line.split("#")
        disks.append(
            {
                "size": output[0],
                "mounted": output[1],
                "used": float(output[2].strip("%")),
            }
        )
    return disks


def cpu(client: SSHClient):
    cpus = []
    # commande pour obtenir les pourcentages d'utilisation des CPUs du serveur
    host_output = client.run_command(
        "mpstat -P ALL 1 1 -o JSON",
    )
    output = "".join(list(host_output.stdout))
    output = json.loads(output)

    for cpu in output["sysstat"]["hosts"][0]["statistics"][0]["cpu-load"]:
        cpu_id = cpu["cpu"]
        if cpu_id != "all":
            cpus.append({"num": cpu_id, "used": cpu["usr"]})
    return cpus
