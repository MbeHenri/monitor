import { useContext } from "react";
import { AuthContext } from "../../providers/Auth";

/**
 * hook permettant d'avoir les informations sur l'utilsateur, avec les fonctions de connexion et de déconnexion
 * @returns 
 */
export const useAuth = () => {
  return useContext(AuthContext);
};