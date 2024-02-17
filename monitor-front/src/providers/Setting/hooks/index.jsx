import { useContext } from "react";
import { SettingContext } from "..";

/**
 * hook permettant d'avoir les settings sur l'utilisateur, avec les fonctions de connexion et de déconnexion
 * @returns
 */
export const useSetting = () => {
  return useContext(SettingContext);
};
