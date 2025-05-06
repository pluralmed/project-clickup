import React, { useEffect, useState } from 'react';
import { getCurrentUser, signOut } from '../services/supabaseService';
import LoginForm from './LoginForm';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Exportando o usuário para utilização em outros componentes
export const useCurrentUser = () => {
  const [user, setUser] = useState<any | null>(null);
  
  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return { user, checkUser, handleLogout };
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, checkUser, handleLogout } = useCurrentUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      await checkUser();
      setLoading(false);
    };
    
    loadUser();
  }, []);

  const handleLogin = () => {
    checkUser();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <LoginForm onSuccess={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default AuthGuard; 