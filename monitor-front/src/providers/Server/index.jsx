import { useState, createContext, useCallback } from "react";
import { list_servers } from "../../apis/Server";
import { useAuth } from "../../hooks/Auth";

export const ServerContext = createContext();
const ServerProvider = ({ children }) => {
  const [servers, setServers] = useState([]);

  const { user } = useAuth();
  const loadServers = useCallback(async () => {
    if (user) {
      return list_servers(user).then((list) => {
        if (list) {
          setServers(
            list.map((server) => {
              const { id, hostname, friendlyname } = server;
              return {
                id: id,
                name: friendlyname,
                hostname: hostname,
              };
            })
          );
          return false;
        } else {
          return { error: "get" };
        }
      });
    } else {
      return { error: "auth" };
    }
  }, [user]);

  const [currentServer, setCurrentServer] = useState(null);
  const [currentService, setCurrentService] = useState(null);
  return (
    <ServerContext.Provider
      value={{
        servers,
        loadServers,

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
