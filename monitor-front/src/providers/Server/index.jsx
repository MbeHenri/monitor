import { useState, createContext } from "react";

export const ServerContext = createContext();
const ServerProvider = ({ children }) => {
  const [currentServer, setCurrentServer] = useState(null);
  const [currentService, setCurrentService] = useState(null);
  return (
    <ServerContext.Provider
      value={{
        currentServer,
        setCurrentServer,
        currentService,
        setCurrentService,
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export default ServerProvider;
