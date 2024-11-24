import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  login: (loginRequest: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = async (loginRequest: { username: string; password: string }) => {
    try {
      console.log('Attempting to log in with:', loginRequest);
      const { data } = await axios.post('http://localhost:8081/api/v1/auth/login', loginRequest);

      if (!data.token || data.token.split('.').length !== 3) {
        throw new Error('Token inválido recibido del servidor.');
      }
      console.log('Received token:', data.token);
      localStorage.setItem('token', data.token);
      setToken(data.token);

      const response = await axios.get('http://localhost:8081/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      const user = response.data;
      console.log('Received user data:', user);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    if (token) {
      console.log('Setting authorization header with token:', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('Removing authorization header');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};