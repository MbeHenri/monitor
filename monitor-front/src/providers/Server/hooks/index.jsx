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
  return { isAccessible: isAccesibleServers.get(idServer) };
}

/**
 * hook permettant d'avoir le retour disponible d'une commande
 * @param {*} idServer
 * @returns
 */
export function useCmdServer(idServer, cmd_type) {
  const { dataSessionServers } = useServer();
  if (dataSessionServers.has(idServer)) {
    return { data: dataSessionServers.get(idServer).get(cmd_type) };
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
  const { isInConnection, isConnecting } = useContext(ServerContext);
  return {
    inSession: isInConnection.get(idServer),
    isConnecting: isConnecting.get(idServer),
  };
}
