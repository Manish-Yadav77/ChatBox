// context/UserContext.js
import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [isKycVerified, setIsKycVerified] = useState(false);

  return (
    <UserContext.Provider value={{ isKycVerified, setIsKycVerified }}>
      {children}
    </UserContext.Provider>
  );
};