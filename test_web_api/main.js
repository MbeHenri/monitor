
const conn = new WebSocket('ws://127.0.0.1:8000/ws/servers/accessible/jhjh/');

conn.onopen = function (e) {
};

conn.onmessage = function (e) {
    console.log(conn);
    message = document.createElement("div");
    message.innerHTML = e.data;
    document.getElementById("content").appendChild(message)
    conn.send(`{"server_id":${1}}`)
    
};

conn.onclose = function (e) {
    console.log(e);
};

timer = window.setInterval(() => {
    
}, 1000);

document.getElementById("send_btn").addEventListener("click", (e) => {
    conn.send(`{"server_id":${1}}`)
})

