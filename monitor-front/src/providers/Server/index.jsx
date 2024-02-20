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
              setError(false);
            } else {
              error === "auth" && logout();
              setError({ type: error });
            }
          })
          .finally(() => setIsLoading(false));
      }
    };
    loadServers();
  }, [logout, user]);

  /* Gestion du flux de vérification de l'accessiblité des serveurs */

  // variable du websocket du flux
  const [fluxAccesServer, setFluxAccesServer] = useState(new Map());
  // variable d'accéssibilité des serveurs
  const [isAccesibleServers, setIsAccesibleServers] = useState(new Map());

  // Lancement du flux d'accéssibilité des serveurs

  // méthode permettant de gérer le flux
  const handleAccessServer = useCallback(() => {
    fluxAccesServer.forEach(async (flux, id) => {
      if (flux) {
        // lors de l'ouverture du flux
        flux.onopen = () => {
          if (user && !isLoading) {
            flux.send(JSON.stringify({}));
          }
        };

        // redefinition de la fonction de reception de message
        flux.onmessage = (e) => {
          if (user) {
            const { value, error } = JSON.parse(e.data);
            if (!error) {
              setIsAccesibleServers(copyMap(isAccesibleServers).set(id, value));
              delay(delayAccess).then(() => flux.send(JSON.stringify({})));
            }
          }
        };
      }
    });
  }, [delayAccess, fluxAccesServer, isAccesibleServers, isLoading, user]);

  const addNewFlux = useCallback(
    (idServer) => {
      if (user && !fluxAccesServer.get(idServer)) {
        const flux = new WebSocket(
          `${serverWebAPIUrl}/servers/v2/accessible/${user.token}/${idServer}/`
        );
        flux.onerror = () => {
          setFluxAccesServer(copyMap(fluxAccesServer).set(idServer, null));
        };
        flux.onclose = (e) => {
          setFluxAccesServer(copyMap(fluxAccesServer).set(idServer, null));
        };
        setFluxAccesServer(copyMap(fluxAccesServer).set(idServer, flux));
      }
    },
    [fluxAccesServer, user]
  );

  useEffect(() => {
    if (user) {
      if (!isLoading) {
        servers.forEach((server) => addNewFlux(server.id));
      }
    }
  }, [addNewFlux, isLoading, servers, user]);

  useEffect(() => {
    handleAccessServer();
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

            addNewFlux(id);
            return false;
          } else {
            return { type: error };
          }
        });
      } else {
        return { type: "auth" };
      }
    },
    [addNewFlux, servers, user]
  );

  /* Gestion du flux des sessions de serveurs */

  // variable de l'ensemble des sessions
  const [sessions, setSessions] = useState(new Map());

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
      if (session) {
        session.onopen = () => {
          if (user) {
            //setIsConneting(isConnecting.set(id));
            !isConnecting.get(id) &&
              setIsConnecting(copyMap(isConnecting).set(id, false));
            !isInConnection.get(id) &&
              setIsInConnection(copyMap(isInConnection).set(id, true));

            COMMANDS.forEach(async (cmd_type) => {
              session.send(JSON.stringify({ cmd_type: cmd_type }));
            });
          }
        };

        // redéfinition des fonctions de gestion de flux
        session.onmessage = (e) => {
          if (user) {
            const { cmd_type, data, error } = JSON.parse(e.data);
            if (!error) {
              // console.log(headMsgInFluxAccess);

              // si on n'avait pas encore ajouter de données pour le serveur
              // on ajoute son dictionnaire de données
              const aux = copyMap(dataSessionServers);
              !aux.get(id) && aux.set(id, new Map());
              setDataSessionServers(
                aux.set(cmd_type, aux.get(id).set(cmd_type, data))
              );

              //console.log(cmd_type);
              delay(delayServer[cmd_type]).then(() =>
                session.send(JSON.stringify({ cmd_type: cmd_type }))
              );
            } else {
              console.log(error);
            }
          }
        };
      }
    });
  }, [
    COMMANDS,
    dataSessionServers,
    delayServer,
    isConnecting,
    isInConnection,
    sessions,
    user,
  ]);

  useEffect(() => {
    handleCommandServer();
  }, [sessions, handleCommandServer]);

  const connexionServer = useCallback(
    async (idServer, formdata) => {
      if (user) {
        if (!sessions.get(idServer)) {
          // `${serverWebAPIUrl}/servers/accessible/${user.token}`
          const { login, password } = formdata;
          var flux = new WebSocket(
            `${serverWebAPIUrl}/servers/session/${user.token}/${idServer}/${login}/${password}/`
          );

          flux.onclose = (e) => {
            console.log(e);
            setIsInConnection(copyMap(isInConnection).set(idServer, false));
            setSessions(copyMap(sessions).set(idServer, null));
          };
          flux.onerror = () => {
            setIsInConnection(copyMap(isInConnection).set(idServer, false));
            setIsConnecting(copyMap(isConnecting).set(idServer, false));
            setSessions(copyMap(sessions).set(idServer, null));
            toast({
              title: `Impossible de se connecter`,
              status: "info",
              isClosable: true,
              position: "top",
            });
          };
          setIsConnecting(copyMap(isConnecting).set(idServer, true));
          setSessions(copyMap(sessions).set(idServer, flux));
        }
      }
    },
    [isConnecting, isInConnection, sessions, toast, user]
  );

  // méthode de déconnexion d'un serveur
  const deconnexionServer = useCallback(
    async (idServer) =>
      user && sessions.get(idServer) && sessions.get(idServer).close(),
    [sessions, user]
  );

  // méthode pour deconnecter tous les serveurs
  const deconnexionServers = useCallback(
    async () => sessions.forEach((session) => session && session.close()),
    [sessions]
  );

  // variable du serveur courant
  const [currentServer, setCurrentServer] = useState(null);

  // méthode de suppréssion de serveurs
  const deleteServer = useCallback(
    async (idServer) => {
      if (user) {
        return await delete_server(user, idServer).then((res) => {
          const { error } = res;
          if (!error) {
            // on arrete les test d'accéssibilité
            fluxAccesServer.get(idServer) &&
              fluxAccesServer.get(idServer).close();

            // on déconnecte le serveur s'il est connecté
            deconnexionServer(idServer);

            // on retire le serveur de l'ensemble des serveurs
            setServers(servers.filter((server) => server.id !== idServer));

            // on le retire le serveur courant s'il l'était
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
    [currentServer, deconnexionServer, fluxAccesServer, servers, user]
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
