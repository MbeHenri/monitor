import { createContext } from "react";

export const SettingContext = createContext();
export const SettingProvider = ({ children }) => {
  const reloaddelay = 3000;
  return (
    <SettingContext.Provider value={{ reloaddelay }}>
      {children}
    </SettingContext.Provider>
  );
};
