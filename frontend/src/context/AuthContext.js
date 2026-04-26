import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      try { setUser(JSON.parse(storedUser)); } catch {}
    }
  }, [token]);

  const login = (authResponse) => {
  const userData = {
    email: authResponse.email || '',
  };
  localStorage.setItem('token', authResponse.token);
  localStorage.setItem('user', JSON.stringify(userData));
  setToken(authResponse.token);
  setUser(userData);
};

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
