// src/screens/users/userContextMock.jsx
import { createContext, useContext, useState } from "react";

// Crée le contexte utilisateur
const UserContext = createContext();

// Hook pour l'utiliser
export const useUserContext = () => useContext(UserContext);

// Provider mock
export function UserProviderMock({ children }) {
  // Mock user pour simuler un auteur
  const [user, setUser] = useState({
    uid: "mock-author-123",
    username: "AuteurTest",
    role: "author",       // role "author" pour activer la publication
    studioActivated: false, // pas encore activé en studio
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}