# Docker Container

## build

```sh
docker build -t monitor-frontend .
```

## run

```sh
docker run --env-file ./example.env monitor-frontend [--network <network_name>]
```

## Environment Variables

* `REACT_APP_MONITOR_SERVERS_API_HOST` - monitor backend host 📌
* `REACT_APP_MONITOR_SERVERS_API_PORT` - monitor backend port 📌
