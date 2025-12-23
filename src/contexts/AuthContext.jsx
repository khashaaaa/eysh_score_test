import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Decode token to get user info
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const payload = JSON.parse(atob(newToken.split('.')[1]));
    setUser(payload);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};