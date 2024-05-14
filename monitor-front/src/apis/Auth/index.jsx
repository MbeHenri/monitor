import { serverUrl } from "../path";

export async function connection(data) {
  var formdata = new FormData();
  formdata.append("username", data.username);
  formdata.append("password", data.password);
  /* 
  var headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "*");
 */
  var requestOptions = {
    method: "POST",
    body: formdata,
    redirect: "follow",
  };

  try {
    var response = await fetch(`${serverUrl}/api/token/`, requestOptions);
    var content = await response.json();
    if (response.ok) {
      return content;
    } else {
      return { ...content, httpcode: response.statusText, error: true };
    }
  } catch (error) {
    console.log(error);
    return { error: true };
  }
}
