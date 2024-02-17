import { useState, createContext, useCallback, useEffect } from "react";
import { add_server, delete_server, list_servers } from "../../apis/Server";
import { useAuth } from "../../hooks/Auth";
import { serverWebAPIUrl } from "../../apis/Server/path";
import { delay } from "../../utils/functions";
import { useSetting } from "../../hooks/Setting";

export const ServerContext = createContext();
const ServerProvider = ({ children }) => {
  /* Recupération des données utiles importantes */

  // Recupération de l'utilisateur
  const { user } = useAuth();
  // Recupération des paramètres de l'utilisateur
  const { delayAccess } = useSetting();

  /* Chargement de la liste des serveurs */

  // variable pour la liste des serveurs
  const [servers, setServers] = useState([]);
  // variable de verification du chargement des serveurs
  const [isLoading, setIsLoading] = useState(true);
  // variable d'erreur du chargement
  const [error, setError] = useState(false);

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
    loadServers();
  }, [user]);

  // méthode de suppréssion de serveurs
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

  /* Gestion du flux de vérification de l'accessiblité des serveurs */

  // variable du websocket du flux
  const [fluxAccesServer, setFluxAccesServer] = useState(null);
  // variable d'accéssibilité des serveurs
  const [isAccesibleServers, setIsAccesibleServers] = useState({});
  // variable du message reçu en tete du flux
  const [headMsgInFluxAccess, setHeadMsgInFluxAccess] = useState(null);

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
            if (fluxAccesServer) {
              fluxAccesServer.send(`{"server_id":${id}}`);
            }
            return false;
          } else {
            return { error: error };
          }
        });
      } else {
        return { error: "auth" };
      }
    },
    [fluxAccesServer, servers, user]
  );

  // Lancement du flux d'accéssibilité des serveurs
  useEffect(() => {
    if (user) {
      if (!fluxAccesServer) {
        var flux = new WebSocket(
          `${serverWebAPIUrl}/servers/accessible/${user.token}`
        );
        // a l'ouverture du flux, on met à jour notre variable de flux
        flux.onopen = () => setFluxAccesServer(flux);
        flux.onmessage = (e) => setHeadMsgInFluxAccess(JSON.parse(e.data));

        flux.onclose = () => setFluxAccesServer(null);
        flux.onerror = (e) => console.log(e);
      }
    }

    return () => {
      if (fluxAccesServer) {
        fluxAccesServer.close();
      }
    };
  }, [fluxAccesServer, user]);

  // Lancement des premiers test d'accessibilité des serveurs apès leur chargement
  const [alreadyRunFirstPing, setAlreadyRunFirstPing] = useState(false);
  useEffect(() => {
    if (user) {
      if (!isLoading) {
        if (fluxAccesServer) {
          if (!alreadyRunFirstPing) {
            console.log("--->   send First pings");
            servers.forEach((server) =>
              fluxAccesServer.send(`{"server_id":${server.id}}`)
            );
            setAlreadyRunFirstPing(true);
          }
        }
      }
    }
    return () => {};
  }, [alreadyRunFirstPing, fluxAccesServer, isLoading, servers, user]);

  // Gestion du flux d'accéssibilté des serveurs
  useEffect(() => {
    const handle = async () => {
      if (headMsgInFluxAccess) {
        const newdict = { ...isAccesibleServers };
        const { id, value, error } = headMsgInFluxAccess;
        if (!error) {
          // console.log(headMsgInFluxAccess);
          newdict[id] = value;
          setIsAccesibleServers(newdict);
          if (fluxAccesServer) {
            delay(delayAccess).then(() =>
              fluxAccesServer.send(`{"server_id":${id}}`)
            );
          }
        }
      }
    };
    handle();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fluxAccesServer, headMsgInFluxAccess]);

  /* Gestion du flux des sessions de serveurs */

  // Lancement du flux de sessions de serveurs
  
  // variable du serveur courant
  const [currentServer, setCurrentServer] = useState(null);
  // variable du service courant
  const [currentService, setCurrentService] = useState(null);

  // methode d'actuaisation du serveur courant
  const updateCurrentServer = useCallback((data) => setCurrentServer(data), []);
  // methode de nettoyage du serveur courant
  const clearCurrentServer = useCallback(() => setCurrentServer(null), []);

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
