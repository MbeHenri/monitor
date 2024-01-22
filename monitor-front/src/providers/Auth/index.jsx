import { createContext, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../../hooks/LocalStorage";
import { useToast } from "@chakra-ui/react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  const toast = useToast();

  // cette fonction est la fontion permettant de se connexion
  // il utilisera l'API de connexion
  const login = useCallback(
    async (data) => {
      setUser({ ...data, password: null, token: "thjef54fdf" });
      navigate("/");
      toast({
        description: `Bonjour ${data.username}`,
        status: "success",
        duration: 1500,
      });
    },
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
