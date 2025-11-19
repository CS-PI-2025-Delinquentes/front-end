import React, { createContext, useState, ReactNode, useContext } from "react";

interface UserContextType {
  name: string;
  setName: (name: string) => void;
  document: string;
  setDocument: (document: string) => void;
  type: string;
  setType: (document: string) => void;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: UserProviderProps) {
  const [name, setName] = useState<string>("");
  const [document, setDocument] = useState<string>("");
  const [type, setType] = useState<string>("");

  return (
    <UserContext.Provider value={{ name, setName, document, setDocument, type, setType }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('no context');
  }
  
  return context;
}
