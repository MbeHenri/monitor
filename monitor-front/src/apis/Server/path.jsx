const serverAPIHOST = process.env.REACT_APP_MONITOR_SERVERS_API_HOST;
const serverAPIPORT = process.env.REACT_APP_MONITOR_SERVERS_API_PORT;

export const serverAPIUrl = `http://${serverAPIHOST}:${serverAPIPORT}/servers/api/v1`;
export const serverWebAPIUrl = `ws://${serverAPIHOST}:${serverAPIPORT}/ws`;
