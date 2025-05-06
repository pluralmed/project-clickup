import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, signOut, getSession } from '../services/supabaseService';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  handleLogout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setLoading(true);
      // Primeiro verificar se há uma sessão ativa
      const session = await getSession();
      
      if (session) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } else {
        // Se não há sessão, garantir que o usuário seja null
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      // Em caso de erro, garantir que o usuário seja null
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: iniciando verificação de usuário');
    refreshUser();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('Iniciando logout');
      await signOut();
      setUser(null);
      console.log('Logout realizado com sucesso, recarregando página');
      // Forçar um reload da página para garantir que tudo seja reinicializado
      window.location.reload();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const value = {
    user,
    loading,
    handleLogout,
    refreshUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 