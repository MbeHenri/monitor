import { createContext } from "react";

export const SettingContext = createContext();
export const SettingProvider = ({ children }) => {
  const delayAccess = 3000;

  const delayServer = {
    cpu: 3000,
    disk: 60000,
    memory: 3000,
    swap: 3000,
    uptime: 60000,
    services: 60000,
  };

  return (
    <SettingContext.Provider value={{ delayAccess, delayServer }}>
      {children}
    </SettingContext.Provider>
  );
};
