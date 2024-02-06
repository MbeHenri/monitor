import { useState, createContext, useCallback, useEffect } from "react";
import {
  accessible_server,
  add_server,
  delete_server,
  list_servers,
} from "../../apis/Server";
import { useAuth } from "../../hooks/Auth";
import { useSetting } from "../../hooks/Setting";

export const ServerContext = createContext();
const ServerProvider = ({ children }) => {
  const { user } = useAuth();

  // etats pour la liste des serveurs
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  /* Chargement de la lsite du serveur */
  useEffect(() => {
    const loadServers = async () => {
      if (user) {
        await list_servers(user)
          .then((list) => {
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
            } else {
              setError({ type: error });
            }
          })
          .finally(() => setIsLoading(false));
      } else {
        setError({ type: "auth" });
      }
    };
    setIsLoading(true);
    setError(false);
    loadServers();
  }, [user]);

  // methodes d'ajout et de suppresion de serveurs
  const addServer = useCallback(
    async (formdata) => {
      if (user) {
        return await add_server(user, formdata).then((server) => {
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

  const deleteServer = useCallback(
    async (idServer) => {
      if (user) {
        return await delete_server(user, idServer).then((res) => {
          const { error } = res;
          if (!error) {
            setServers(servers.filter((server) => server.id !== idServer));
            setCurrentServer(null);
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

  const [isAccesibleServers, setIsAccesibleServers] = useState({});
  const { reloaddelay } = useSetting();

  useEffect(() => {
    const verifingAccessibleServer = async (idServer) => {
      if (user) {
        return await accessible_server(user, idServer).then((res) => {
          const { error } = res;
          if (!error) {
            const newdict = { ...isAccesibleServers };
            newdict[idServer] = res;
            setIsAccesibleServers(newdict);
          } else {
            if (error === "not_found" || error === "auth") {
              throw new Error(error);
            }
          }
        });
      } else {
        throw new Error("auth");
      }
    };
    
    servers.forEach((server) => {
      verifingAccessibleServer(server.id).catch((error) => {
        if (error.message === "auth") {
          setIsAccesibleServers({});
        } else {
          const newdict = { ...isAccesibleServers };
          newdict[server.id] = null;
          setIsAccesibleServers(newdict);
        }
      });
    });

    /* return function () {
      clearInterval(timer);
    }; */
    
  }, [isAccesibleServers, reloaddelay, servers, user]);

  const [currentServer, setCurrentServer] = useState(null);
  const [currentService, setCurrentService] = useState(null);

  const updateCurrentServer = (data) => setCurrentServer(data);
  const clearCurrentServer = () => setCurrentServer(null);

  return (
    <ServerContext.Provider
      value={{
        servers,
        isLoading,
        error,
        isAccesibleServers,
        addServer,
        deleteServer,

        currentServer,
        updateCurrentServer,
        clearCurrentServer,

        currentService,
        setCurrentService,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export default ServerProvider;
