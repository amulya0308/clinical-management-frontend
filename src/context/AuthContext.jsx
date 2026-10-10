import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const profile = await authService.getCurrentUser();
          const currentUserData = {
            id: profile.id,
            email: profile.email,
            role: profile.role,
            fullName: profile.fullName,
            profileId: profile.profileId,
          };
          setUser(currentUserData);
          localStorage.setItem('user', JSON.stringify(currentUserData));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    const authUser = {
      id: data.id,
      email: data.email,
      role: data.role,
      fullName: data.fullName,
      profileId: data.profileId,
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(authUser));
    setToken(data.token);
    setUser(authUser);
    return authUser;
  };

  const register = async (registerData) => {
    const data = await authService.register(registerData);
    const authUser = {
      id: data.id,
      email: data.email,
      role: data.role,
      fullName: data.fullName,
      profileId: data.profileId,
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(authUser));
    setToken(data.token);
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        role: user?.role,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
