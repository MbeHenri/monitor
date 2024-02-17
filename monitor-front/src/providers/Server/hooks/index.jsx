import { useContext } from "react";
import { ServerContext } from "..";

/**
 * hook permettant d'accéder au provider Server
 */
export function useServer() {
  return useContext(ServerContext);
}

export function useIsAccessibleServer(idServer) {
  const { isAccesibleServers } = useServer();
  return { isAccessible: isAccesibleServers[idServer] };
}

/**
 * hook permettant d'avoir le retour disponible d'une commande
 * @param {*} idServer
 * @returns
 */
export function useCmdServer(idServer, cmd_type) {
  const { dataSessionServers } = useServer();
  if (dataSessionServers[idServer] && dataSessionServers[idServer][cmd_type]) {
    return { data: dataSessionServers[idServer][cmd_type] };
  }
  return { data: null };
}

/**
 * hook permettant d'avoir le serveur courant avec les fonctions associées
 * @returns
 */
export function useCurrentServer() {
  const { currentServer, clearCurrentServer, updateCurrentServer } =
    useContext(ServerContext);
  return { currentServer, updateCurrentServer, clearCurrentServer };
}

/**
 * hook permettant de savoir si un serveur est en session
 * @returns
 */
export function useSessionServer(idServer) {
  const { sessions, isConnecting } = useContext(ServerContext);
  return {
    inSession: sessions[idServer],
    isConnecting: isConnecting[idServer],
  };
}
