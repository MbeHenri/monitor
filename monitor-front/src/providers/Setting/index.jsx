import { createContext } from "react";

export const SettingContext = createContext();
export const SettingProvider = ({ children }) => {
  const delayAccess = 10000;
  const delayServer = 10000;
  return (
    <SettingContext.Provider value={{ delayAccess, delayServer }}>
      {children}
    </SettingContext.Provider>
  );
};
