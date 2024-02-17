
var conn = new WebSocket('ws://127.0.0.1:8000/ws/servers/session/100/1/mbe/00');

conn.onopen = function (e) {
};

conn.onmessage = function (e) {
    console.log(e.data);
    message = document.createElement("div");
    message.innerHTML = e.data;
    document.getElementById("content").appendChild(message)
    // conn.send(`{"server_id":${1}}`)
};

conn.onclose = function (e) {
    console.log(e);
};

/* timer = window.setInterval(() => {
    conn.send(`{"server_id":${1}}`)
}, 1000); */

document.getElementById("send_btn").addEventListener("click", (e) => {
    const body = { cmd_type: "disk" }
    conn.send(JSON.stringify(body));
})

