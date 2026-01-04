import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedTickets, setBookedTickets] = useState([]);

  useEffect(() => {
    // Check auth status on app load
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    const tickets = JSON.parse(localStorage.getItem('bookedTickets') || '[]');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setBookedTickets(tickets);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('bookedTickets');
    setUser(null);
    setBookedTickets([]);
  };

  const bookTicket = (ticket) => {
    const tickets = JSON.parse(localStorage.getItem('bookedTickets') || '[]');
    tickets.push(ticket);
    localStorage.setItem('bookedTickets', JSON.stringify(tickets));
    setBookedTickets(tickets);
  };

  const value = {
    user,
    login,
    logout,
    bookedTickets,
    bookTicket,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
