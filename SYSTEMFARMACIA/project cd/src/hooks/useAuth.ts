import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga del usuario desde localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulación de login - en producción conectar con API
    if (email === 'admin@farmaciaantana.com' && password === 'password123') {
      const adminUser: User = {
        id: 1,
        nombre: 'Administrador',
        email: 'admin@farmaciaantana.com',
        rol: 'admin',
        telefono: '999999999'
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    } else if (email === 'vendedor@farmaciaantana.com' && password === 'vendedor123') {
      const vendedorUser: User = {
        id: 2,
        nombre: 'Vendedor Principal',
        email: 'vendedor@farmaciaantana.com',
        rol: 'vendedor',
        telefono: '987654321'
      };
      setUser(vendedorUser);
      localStorage.setItem('user', JSON.stringify(vendedorUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulación de registro - en producción conectar con API
    const newUser: User = {
      id: Date.now(),
      nombre: userData.nombre || '',
      email: userData.email || '',
      rol: userData.rol || 'cliente',
      telefono: userData.telefono,
      direccion: userData.direccion
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  return {
    user,
    login,
    logout,
    register,
    isLoading
  };
};

export { AuthContext };