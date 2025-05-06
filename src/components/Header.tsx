import React from 'react';
import { RefreshCw, Download, LogOut } from 'lucide-react';
import { useCurrentUser } from './AuthGuard';

interface HeaderProps {
  onRefresh: () => void;
  onExportCSV: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, onExportCSV }) => {
  const { user, handleLogout } = useCurrentUser();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold">Formulários de Inscrição - ClickUp</h1>
            <p className="text-blue-100">Informações de candidatos para as vagas em aberto</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            {user && (
              <span className="text-sm text-white mr-1">
                {user.email}
              </span>
            )}
            
            <button
              onClick={onRefresh}
              className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-md shadow hover:bg-blue-50 transition-colors duration-150"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar dados
            </button>
            
            <button
              onClick={onExportCSV}
              className="flex items-center bg-transparent text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-blue-600 transition-colors duration-150"
            >
              <Download className="w-4 h-4 mr-2" />
              Baixar planilha
            </button>
            
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 text-white border border-red-600 px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-150"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;