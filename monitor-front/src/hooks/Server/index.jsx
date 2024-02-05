import { useState, useEffect, useContext } from "react";

import { useAuth } from "../Auth";
import { ServerContext } from "../../providers/Server";

/**
 * hook permettant d'accéder au provider Server
 */
export function useServer() {
  return useContext(ServerContext);
}

/**
 * hook permettant de retourner la liste des serveurs en fournissant
 * @returns
 */
export function useServers() {
  const { servers, loadServers } = useContext(ServerContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadServers()
      .then((res) => {
        const { error } = res;
        if (error) {
          setError({ type: error });
        }
      })
      .finally(() => setIsLoading(false));
  }, [loadServers]);

  return { isLoading, servers, error };
}

/**
 * hook permettant de recuperer l'uptime du serveur ayant l'identifiant "idServer"
 * @param {*} idServer
 * @returns
 */
export function useInfosUptimeServer(idServer) {
  const [uptime, setUptime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    const loadapi = async () => {
      if (user) {
        // l'utilisateur est authentifié
        const datenow = new Date();
        setUptime({
          id: idServer,
          date: datenow.toDateString(),
          time: datenow.toLocaleTimeString(),
        });
      } else {
        // l'utilisateur ne l'est pas
        setError({ type: "auth" });
      }
      setIsLoading(false);
    };
    loadapi();
  }, [idServer, user]);
  return { isLoading, uptime, error };
}

/**
 * hook permettant d'avoir les infos sur les mémoires du serveur d'identifiant "idServer"
 * @param {*} idServer
 * @returns
 */
export function useInfosMemoriesServer(idServer) {
  const [memories, setMemories] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    const loadapi = async () => {
      if (user) {
        // l'utilisateur est authentifié
        setMemories({
          id: idServer,
          mem: { total: 1200, used: 0.8 },
          swap: { total: 12, used: 0.8 },
          disk: { total: 12000, used: 0.5 },
        });
      } else {
        // l'utilisateur ne l'est pas
        setError({ type: "auth" });
      }
      setIsLoading(false);
    };
    loadapi();
  }, [idServer, user]);
  return { isLoading, memories, error };
}

/**
 * hook permettant d'avoir la liste des cpus avec leur pourcentage d'utilisation
 * @param {*} idServer
 * @returns
 */
export function useInfosCPUServer(idServer) {
  const [cpus, setCpus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    setError(false);
    const loadapi = async () => {
      if (user) {
        // l'utilisateur est authentifié
        setCpus([{ used: 0.5 }]);
      } else {
        // l'utilisateur ne l'est pas
        setError({ type: "auth" });
      }
      setIsLoading(false);
      setError(false);
    };
    loadapi();
  }, [idServer, user]);
  return { isLoading, cpus, error };
}

/**
 * hook permettant d'avoir le serveur courant avec les fonctions associées
 * @returns
 */
export function useCurrentServer() {
  const {
    currentServer,
    clearCurrentServer,
    updateCurrentServer,
  } = useContext(ServerContext);
  return { currentServer, updateCurrentServer, clearCurrentServer };
}
