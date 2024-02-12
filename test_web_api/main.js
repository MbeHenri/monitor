
var conn = new WebSocket('ws://127.0.0.1:8000/chat/10/');

conn.onopen = function (e) {
    alert("Connection established!");
};

conn.onmessage = function (e) {
    console.log(e.data);
    message = document.createElement("span");
    message.innerHTML = e.data;
    document.getElementById("content").append(message)
};

timer = window.setInterval(() => {
    conn.send(`{"server_id":${1}}`)
}, 10000);
