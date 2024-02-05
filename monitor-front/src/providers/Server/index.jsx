import { useState, createContext, useCallback } from "react";
import { add_server, list_servers } from "../../apis/Server";
import { useAuth } from "../../hooks/Auth";

export const ServerContext = createContext();
const ServerProvider = ({ children }) => {
  const [servers, setServers] = useState([]);

  const { user } = useAuth();
  const loadServers = useCallback(async () => {
    if (user) {
      return list_servers(user).then((list) => {
        const { error } = list;
        if (!error) {
          setServers(
            list.map((server) => {
              const { id, hostname, friendlyname } = server;
              return {
                id: id,
                friendlyname: friendlyname,
                hostname: hostname,
              };
            })
          );
          return false;
        } else {
          return { error: error };
        }
      });
    } else {
      return { error: "auth" };
    }
  }, [user]);

  const addServer = useCallback(
    async (formdata) => {
      if (user) {
        return add_server(user, formdata).then((server) => {
          const { error } = server;
          if (!error) {
            const { id, hostname, friendlyname } = server;
            setServers([
              ...servers,
              {
                id: id,
                friendlyname: friendlyname,
                hostname: hostname,
              },
            ]);
            return false;
          } else {
            return { error: error };
          }
        });
      } else {
        return { error: "auth" };
      }
    },
    [servers, user]
  );

  const [currentServer, setCurrentServer] = useState(null);
  const [currentService, setCurrentService] = useState(null);
  return (
    <ServerContext.Provider
      value={{
        servers,
        loadServers,
        addServer,

        currentServer,
        setCurrentServer,
        currentService,
        setCurrentService,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export default ServerProvider;
