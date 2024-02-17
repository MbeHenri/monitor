import {
  useState,
  createContext,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { add_server, delete_server, list_servers } from "../../apis/Server";
import { useAuth } from "../Auth/hooks";
import { serverWebAPIUrl } from "../../apis/Server/path";
import { delay } from "../../utils/functions";
import { useSetting } from "../Setting/hooks";

export const ServerContext = createContext();
const ServerProvider = ({ children }) => {
  /* Recupération des données utiles importantes */

  // Recupération de l'utilisateur
  const { user } = useAuth();
  // Recupération des paramètres de l'utilisateur
  const { delayAccess, delayServer } = useSetting();

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

  /* Gestion du flux de vérification de l'accessiblité des serveurs */

  // variable du websocket du flux
  const [fluxAccesServer, setFluxAccesServer] = useState(null);
  // variable d'accéssibilité des serveurs
  const [isAccesibleServers, setIsAccesibleServers] = useState({});
  // variable du message reçu en tete du flux
  const [headMsgInFluxAccess, setHeadMsgInFluxAccess] = useState(null);

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
              fluxAccesServer.send(JSON.stringify({ server_id: server.id }))
            );
            setAlreadyRunFirstPing(true);
          }
        }
      }
    }
    return () => {};
  }, [alreadyRunFirstPing, fluxAccesServer, isLoading, servers, user]);

  // Gestion du bouclage utilisant le flux d'accéssibilté des serveurs
  useEffect(() => {
    const handle = async () => {
      if (user) {
        if (headMsgInFluxAccess) {
          const { id, value, error } = headMsgInFluxAccess;
          if (!error) {
            // console.log(headMsgInFluxAccess);
            const newdict = { ...isAccesibleServers };
            newdict[id] = value;
            setIsAccesibleServers(newdict);
            if (fluxAccesServer) {
              delay(delayAccess).then(() =>
                fluxAccesServer.send(JSON.stringify({ server_id: id }))
              );
            }
          }
        }
      }
    };
    handle();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fluxAccesServer, headMsgInFluxAccess]);

  // methode d'ajout et de suppresion de serveurs
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
              const body = { server_id: id };
              fluxAccesServer.send(JSON.stringify(body));
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

  /* Gestion du flux des sessions de serveurs */

  // variable de l'ensemble des sessions
  const [sessions, setSessions] = useState({});
  const setSession = useCallback(
    (idServer, flux) => {
      const newsession = { ...sessions };
      newsession[idServer] = flux;
      setSessions(newsession);
    },
    [sessions]
  );

  const clearSession = useCallback(
    (idServer) => {
      const newsession = { ...sessions };
      newsession[idServer] = null;
      setSessions(newsession);
    },
    [sessions]
  );

  const clearSessions = useCallback(() => {
    servers.forEach((server) => {
      if (sessions[server.id]) {
        sessions[server.id].close();
      }
    });
    setSessions([]);
  }, [servers, sessions]);
  // variable de l'ensemble des données issus des serveurs
  const [dataSessionServers, setDataSessionServers] = useState({});

  const handleCommandServer = useCallback(
    async (idServer, result) => {
      if (user) {
        const { cmd_type, data, error } = result;
        if (!error) {
          // console.log(headMsgInFluxAccess);
          const datas = { ...dataSessionServers };
          datas[idServer][cmd_type] = data[cmd_type];
          setDataSessionServers(datas);
          if (sessions[idServer]) {
            delay(delayServer).then(() =>
              sessions[idServer].send(JSON.stringify({ cmd_type: cmd_type }))
            );
          }
        }
      }
    },
    [dataSessionServers, delayServer, sessions, user]
  );

  // méthode de connection à un serveur donné
  const COMMANDS = useMemo(
    () => ["cpu", "disk", "memory", "swap", "uptime", "services"],
    []
  );
  const connexionServer = useCallback(
    async (idServer, formdata) => {
      if (user) {
        if (!sessions[idServer]) {
          // `${serverWebAPIUrl}/servers/accessible/${user.token}`
          const { login, password } = formdata;
          var flux = new WebSocket(
            `${serverWebAPIUrl}/servers/session/${user.token}/${idServer}/${login}/${password}`
          );

          flux.onopen = () => {
            // on ajoute le serveur dans l'ensemble des serveurs
            setSession(idServer, flux);
            // on envoie tous les types de commandes au serveur
            COMMANDS.forEach(async (cmd_type) => {
              flux.send(JSON.stringify({ cmd_type: cmd_type }));
            });
          };
          flux.onmessage = (e) => {
            // rediriger les entrées
            handleCommandServer(idServer, JSON.parse(e.data));
          };
          flux.onclose = () => clearSession(idServer);
          flux.onerror = (e) => console.log(e);
        }
        return true;
      } else {
        return false;
      }
    },
    [COMMANDS, clearSession, handleCommandServer, sessions, setSession, user]
  );

  // méthode de déconnexion d'un serveur
  const deconnexionServer = useCallback(
    async (idServer) => {
      if (user) {
        if (sessions[idServer]) {
          sessions[idServer].close();
          clearSession(idServer);
        } else {
        }
        return true;
      } else {
        return false;
      }
    },
    [clearSession, sessions, user]
  );

  // méthode pour deconnecter tous les serveurs
  const deconnexionServers = useCallback(async () => {
    if (user) {
      // on libère les connexions des serveurs sur lesquels on était connecter
      servers.forEach((server) => {
        if (sessions[server.id]) {
          sessions[server.id].close();
        }
      });
      clearSessions();
      return true;
    } else {
      return false;
    }
  }, [clearSessions, servers, sessions, user]);

  // variable du serveur courant
  const [currentServer, setCurrentServer] = useState(null);

  // méthode de suppréssion de serveurs
  const deleteServer = useCallback(
    async (idServer) => {
      if (user) {
        return await delete_server(user, idServer).then((res) => {
          const { error } = res;
          if (!error) {
            // on déconnecte le serveur s'il est connecté
            deconnexionServer(idServer);

            // on retire le serveur de l'ensemble des serveurs
            setServers(servers.filter((server) => server.id !== idServer));

            // on vide le serveur si c'était lui
            currentServer &&
              currentServer.id === idServer &&
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
    [currentServer, deconnexionServer, servers, user]
  );

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

        sessions,
        dataSessionServers,
        connexionServer,
        deconnexionServer,
        deconnexionServers,

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
