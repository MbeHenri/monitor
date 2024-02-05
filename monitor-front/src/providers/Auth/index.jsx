import { createContext, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/LocalStorage";
import { useToast } from "@chakra-ui/react";
import { connection } from "../../apis/Auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  const toast = useToast();

  // cette fonction est la fontion permettant de se conneter
  // il utilisera l'API de connexion
  const login = useCallback(
    async (data) =>
      connection(data).then((response) => {
        const { error } = response;
        if (error) {
          // s'il ya eu une erreur on l'affiche
          const { detail } = response;
          toast({
            description: detail
              ? "Ces informations ne correspondent à aucun compte. Veillez les vérifier et réessayer"
              : "Une erreur est survenu. Veillez réessayer",
            status: "error",
            duration: 3500,
          });
        } else {
          // si il n'y a pas eu d'erreur on initialise l'utilisateur
          const { access } = response;
          const { username } = data;
          setUser({ username: username, token: access });
          navigate("/");
          toast({
            description: `Bonjour ${username}`,
            status: "success",
            duration: 1500,
          });
        }
      }),
    [setUser, navigate, toast]
  );

  // cette fonction est la fonction permettant de se déconnecter
  // il utilisera l'API de deconnexion
  const logout = useCallback(async () => {
    setUser(null);
    navigate("/login", { replace: true });
  }, [setUser, navigate]);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
