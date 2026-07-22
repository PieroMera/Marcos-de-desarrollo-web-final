import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, STORAGE_KEY } from '../api/client';

const AuthContext = createContext(null);

function readSession() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { token: null, user: null };
  try {
    const parsed = JSON.parse(stored);
    return { token: parsed.token || null, user: parsed.user || null };
  } catch {
    return { token: null, user: null };
  }
}

function writeSession(token, user) {
  if (token && user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function AuthProvider({ children }) {
  const initial = readSession();
  const [user, setUser] = useState(initial.user);
  const [token, setToken] = useState(initial.token);
  const [loading, setLoading] = useState(Boolean(initial.token));

  useEffect(() => {
    if (!initial.token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ user: freshUser }) => {
        setUser(freshUser);
        writeSession(initial.token, freshUser);
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        writeSession(null, null);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    try {
      const { token: newToken, user: newUser } = await authApi.login(email, password);
      setToken(newToken);
      setUser(newUser);
      writeSession(newToken, newUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const register = async (payload) => {
    try {
      const { token: newToken, user: newUser } = await authApi.register(payload);
      setToken(newToken);
      setUser(newUser);
      writeSession(newToken, newUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    writeSession(null, null);
  };

  const updateUser = (newUser) => {
    setUser(newUser);
    writeSession(token, newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
