export async function list_servers(user) {
  var myHeaders = new Headers();
  const { token } = user;
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const serverAPIUrl = process.env.REACT_APP_MONITOR_SERVERS_API_BASE_URL;
    var response = await fetch(`${serverAPIUrl}api/v1/server/`, requestOptions);
    var content = await response.json();
    if (response.ok) {
      const { results } = content;
      return results;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function add_server(user, data) {
  var myHeaders = new Headers();
  const { token } = user;
  myHeaders.append("Authorization", `Bearer ${token}`);

  const { hostname, name } = data;
  var formdata = new FormData();
  formdata.append("hostname", hostname);
  formdata.append("friendlyname", name);

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow",
  };

  try {
    const serverAPIUrl = process.env.REACT_APP_MONITOR_SERVERS_API_BASE_URL;
    var response = await fetch(`${serverAPIUrl}api/v1/server/`, requestOptions);
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function delete_server(user, idServer) {
  var myHeaders = new Headers();
  const { token } = user;
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const serverAPIUrl = process.env.REACT_APP_MONITOR_SERVERS_API_BASE_URL;
    var response = await fetch(
      `${serverAPIUrl}api/v1/server/${idServer}/`,
      requestOptions
    );
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
