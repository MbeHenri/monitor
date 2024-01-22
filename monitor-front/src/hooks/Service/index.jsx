import { useEffect, useState } from "react";
import { useAuth } from "../Auth";

/**
 * hook permettant d'avoir la liste des services d'un serveur
 * @param {*} idServer
 * @returns
 */
export function useServicesServer(idServer) {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadapi = async () => {
      if (user) {
        // l'utilisateur est authentifié
        setServices([
          {
            name: "apache",
            isRunning: true,
          },
          {
            name: "tomcat",
            isRunning: false,
          },
        ]);
      } else {
        // l'utilisateur ne l'est pas
        setError({ type: "auth" });
      }
      setIsLoading(false);
      setError(false);
    };
    loadapi();
  }, [idServer, user]);
  return { isLoading, services, error };
}
