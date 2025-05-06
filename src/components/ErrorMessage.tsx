import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="p-8 flex justify-center">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md max-w-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error fetching data</h3>
            <div className="mt-1 text-sm text-red-700">
              <p>{message}</p>
              <p className="mt-2">Please check your connection and try again.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;