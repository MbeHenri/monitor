
const conn = new WebSocket('ws://127.0.0.1:8000/ws/servers/session/1000/8/mbe/  /');

conn.onopen = function (e) {
    console.log("connection ok");
};

conn.onmessage = function (e) {
    console.log(conn);
    message = document.createElement("div");
    message.innerHTML = e.data;
    document.getElementById("content").appendChild(message)

};

conn.onclose = function (e) {
    console.log(e);
};

document.getElementById("send_btn").addEventListener("click", (e) => {
    conn.send(JSON.stringify({ cmd_type: "uptime" }))
})

