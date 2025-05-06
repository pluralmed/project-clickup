import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="flex flex-col items-center">
        <Loader className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-gray-600">Carregando lista de candidatos...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;