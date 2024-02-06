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
      return { error: response.status === 401 ? "auth" : "any" };
    }
  } catch (error) {
    console.log(error);
    return { error: "any" };
  }
}

export async function add_server(user, data) {
  var myHeaders = new Headers();
  const { token } = user;
  myHeaders.append("Authorization", `Bearer ${token}`);

  const { hostname, friendlyname } = data;
  var formdata = new FormData();
  formdata.append("hostname", hostname);
  formdata.append("friendlyname", friendlyname);

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
      return await response.json();
    } else {
      return { error: response.status === 401 ? "auth" : "any" };
    }
  } catch (error) {
    console.log(error);
    return { error: "any" };
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
      return { error: response.status === 401 ? "auth" : "any" };
    }
  } catch (error) {
    console.log(error);
    return { error: "any" };
  }
}

export async function accessible_server(user, idServer) {
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
    var response = await fetch(
      `${serverAPIUrl}api/v1/accessible/${idServer}/`,
      requestOptions
    );
    if (response.ok) {
      const { value } = await response.json();
      return value;
    } else {
      return {
        error:
          response.status === 401
            ? "auth"
            : response.status === 404
            ? "not_found"
            : "any",
      };
    }
  } catch (error) {
    console.log(error);
    return { error: "any" };
  }
}
