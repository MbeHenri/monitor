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
import { useToast } from "@chakra-ui/react";

export const ServerContext = createContext();
const ServerProvider = ({ children }) => {
  // element d'aide de notifictions
  const toast = useToast();

  /* Recupération des données utiles importantes */

  // Recupération de l'utilisateur
  const { user, logout } = useAuth();
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
              error === "auth" && logout();
              setError({ type: error });
            }
          })
          .finally(() => setIsLoading(false));
      } else {
        setError({ type: "auth" });
      }
    };
    loadServers();
  }, [logout, user]);

  /* Gestion du flux de vérification de l'accessiblité des serveurs */

  // variable du websocket du flux
  const [fluxAccesServer, setFluxAccesServer] = useState(null);
  // variable d'accéssibilité des serveurs
  const [isAccesibleServers, setIsAccesibleServers] = useState(new Map());

  // Lancement du flux d'accéssibilité des serveurs

  // méthode permettant de gérer le flux
  const handleAccessServer = useCallback(() => {
    if (fluxAccesServer) {
      // lors de l'ouverture du flux
      fluxAccesServer.onopen = () => {
        if (user && !isLoading) {
          servers.forEach((server) =>
            fluxAccesServer.send(JSON.stringify({ server_id: server.id }))
          );
        }
      };

      // redefinition de la fonction de reception de message
      fluxAccesServer.onmessage = (e) => {
        if (user) {
          const { id, value, error } = JSON.parse(e.data);
          if (!error) {
            const aux = new Map();
            isAccesibleServers.forEach((ok, id) => aux.set(id, ok));
            setIsAccesibleServers(aux.set(id, value));
            delay(delayAccess).then(() =>
              fluxAccesServer.send(JSON.stringify({ server_id: id }))
            );
          }
        }
      };
    }
  }, [
    delayAccess,
    fluxAccesServer,
    isAccesibleServers,
    isLoading,
    servers,
    user,
  ]);

  useEffect(() => {
    var flux = null;
    if (user) {
      try {
        flux = new WebSocket(
          `${serverWebAPIUrl}/servers/accessible/${user.token}/`
        );
        flux.onerror = () => {};
        flux.onclose = () => {};
        setFluxAccesServer(flux);
      } catch (error) {
        console.log(error);
      }
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (fluxAccesServer) {
      handleAccessServer();
    }
  }, [fluxAccesServer, handleAccessServer]);

  // methode d'ajout d'un serveur
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
            return { type: error };
          }
        });
      } else {
        return { type: "auth" };
      }
    },
    [fluxAccesServer, servers, user]
  );

  /* Gestion du flux des sessions de serveurs */

  // variable de l'ensemble des sessions
  const [sessions, setSessions] = useState(new Map());
  const setSession = useCallback(
    (idServer, flux) => {
      setSessions(copyMap(sessions).set(idServer, flux));
    },
    [sessions]
  );

  const clearSession = useCallback(
    (idServer) => {
      const aux = new Map();
      sessions.forEach(
        (session, id) => id !== idServer && aux.set(id, session)
      );
      setSessions(aux);
    },
    [sessions]
  );

  const clearSessions = useCallback(() => {
    sessions.forEach((session) => session && session.close());
    setSessions([]);
  }, [sessions]);

  // variable de l'ensemble des données issus des serveurs
  const [dataSessionServers, setDataSessionServers] = useState(new Map());

  // méthode de connection à un serveur donné
  const COMMANDS = useMemo(
    () => ["cpu", "disk", "memory", "swap", "uptime", "services"],
    []
  );

  const [isConnecting, setIsConnecting] = useState(new Map());
  const [isInConnection, setIsInConnection] = useState(new Map());

  const handleCommandServer = useCallback(() => {
    sessions.forEach(async (session, id) => {
      // on envoie tous les types de commandes au serveur
      session.onopen = () => {
        //setIsConneting(isConnecting.set(id));
        setIsConnecting(copyMap(isInConnection).set(id, true));
        setIsInConnection(copyMap(isInConnection).set(id, true));

        COMMANDS.forEach(async (cmd_type) => {
          session.send(JSON.stringify({ cmd_type: cmd_type }));
        });
      };

      // redéfinition des fonctions de gestion de flux
      session.onmessage = (e) => {
        const { cmd_type, data, error } = JSON.parse(e.data);
        if (!error) {
          // console.log(headMsgInFluxAccess);

          // si on n'avait pas encore ajouter de données pour le serveur
          // on ajoute son dictionnaire de données
          const aux = copyMap(dataSessionServers);

          !aux.has(id) && aux.set(id, new Map());
          setDataSessionServers(
            aux.set(cmd_type, aux.get(id).set(cmd_type, data))
          );
          //console.log(cmd_type);
          delay(delayServer[cmd_type]).then(() =>
            session.send(JSON.stringify({ cmd_type: cmd_type }))
          );
        }
      };
    });
  }, [COMMANDS, dataSessionServers, delayServer, isInConnection, sessions]);

  useEffect(() => {
    handleCommandServer();
  }, [sessions, handleCommandServer]);

  const connexionServer = useCallback(
    async (idServer, formdata) => {
      if (user) {
        if (!sessions.has(idServer)) {
          // `${serverWebAPIUrl}/servers/accessible/${user.token}`
          const { login, password } = formdata;
          var flux = new WebSocket(
            `${serverWebAPIUrl}/servers/session/${user.token}/${idServer}/${login}/${password}/`
          );

          flux.onclose = () => {
            setIsInConnection(copyMap(isInConnection).set(idServer, false));
            clearSession(idServer);
            toast({
              title: `serveur déconnecté`,
              status: "info",
              isClosable: true,
              position: "top",
            });
          };
          flux.onerror = () => {
            setIsInConnection(copyMap(isInConnection).set(idServer, false));
            clearSession(idServer);
            toast({
              title: `la connection au serveur a échoué`,
              status: "info",
              isClosable: true,
              position: "top",
            });
          };

          setSession(idServer, flux);
        }
      }
    },
    [clearSession, sessions, setSession, toast, user]
  );

  // méthode de déconnexion d'un serveur
  const deconnexionServer = useCallback(
    async (idServer) => {
      if (user) {
        if (sessions.has(idServer)) {
          sessions.get(idServer).close();
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
      clearSessions();
      return true;
    } else {
      return false;
    }
  }, [clearSessions, user]);

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

            // on vide le serveur courant si c'était lui
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
        isConnecting,
        isInConnection,
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

export function copyMap(map) {
  var aux = new Map();
  map.forEach((value, key) => aux.set(key, value));
  return aux;
}
export default ServerProvider;
