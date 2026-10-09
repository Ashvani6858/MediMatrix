import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('mc_token');
    const savedUser = localStorage.getItem('mc_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (authData) => {
    setToken(authData.token);
    setUser({ id: authData.userId, email: authData.email, name: authData.fullName, role: authData.role });
    localStorage.setItem('mc_token', authData.token);
    localStorage.setItem('mc_user', JSON.stringify({
      id: authData.userId, email: authData.email, name: authData.fullName, role: authData.role
    }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('mc_token');
    localStorage.removeItem('mc_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
