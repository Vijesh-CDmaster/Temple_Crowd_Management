import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing token
    const token = localStorage.getItem('temple_token');
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('temple_token', userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('temple_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
