from subprocess import run, TimeoutExpired


def accessible_server(hostname: str) -> bool:
    try:
        res = run(["ping", "-c", "1", hostname])
        return res.returncode == 0
    except TimeoutExpired:
        return False
