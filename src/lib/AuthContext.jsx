import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app);
const AuthContext = createContext();

const MANAGER_EMAIL = "alinajatca@gmail.com";
const NAMES = {
  "alinajatca@gmail.com": "Alina",
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: NAMES[firebaseUser.email] || firebaseUser.displayName || firebaseUser.email.split("@")[0],
          isManager: firebaseUser.email === MANAGER_EMAIL,
        });
      } else {
        setUser(null);
      }
      setIsLoadingAuth(false);
    });
    return unsub;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, isLoadingAuth, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);