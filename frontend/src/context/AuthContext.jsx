import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('prabhaUser');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);

    // Global fetch interceptor for expired sessions
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      if (response.status === 401) {
        const clone = response.clone();
        try {
          const data = await clone.json();
          if (data.message === 'Your admin session has expired. Please login again.') {
            setUser(null);
            localStorage.removeItem('prabhaUser');
            window.location.href = '/login';
          }
        } catch(e) {}
      }
      return response;
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    
    setUser(data);
    localStorage.setItem('prabhaUser', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    
    setUser(data);
    localStorage.setItem('prabhaUser', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('prabhaUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
