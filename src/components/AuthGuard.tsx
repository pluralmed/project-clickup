import React from 'react';
import LoginForm from './LoginForm';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, refreshUser } = useAuth();

  const handleLogin = () => {
    refreshUser();
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