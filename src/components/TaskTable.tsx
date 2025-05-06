import React, { useState } from 'react';
import { FormattedTask } from '../types/clickup';
import { Calendar, ChevronDown, ChevronUp, ExternalLink, User, FileText, Phone, Mail, MapPin, BadgeCheck, Building, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';

interface TaskTableProps {
  tasks: FormattedTask[];
}

type SortField = keyof FormattedTask;
type SortDirection = 'asc' | 'desc';

const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
  const [sortField, setSortField] = useState<SortField>('date_created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Paginação
  const totalPages = Math.ceil(sortedTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTasks.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="inline-block w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="inline-block w-4 h-4 ml-1" />
    );
  };

  const renderLink = (url: string | null) => {
    if (!url) return 'N/A';
    return (
      <a 
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 flex items-center"
      >
        <FileText className="w-4 h-4 mr-1" />
        Ver
      </a>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th onClick={() => handleSort('form_name')} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    <ClipboardList className="w-4 h-4 mr-1" />
                    Formulário
                    <SortIcon field="form_name" />
                  </div>
                </th>
                <th onClick={() => handleSort('date_created')} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Data de Inscrição
                    <SortIcon field="date_created" />
                  </div>
                </th>
                <th onClick={() => handleSort('badge')} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    <BadgeCheck className="w-4 h-4 mr-1" />
                    Cargo
                    <SortIcon field="badge" />
                  </div>
                </th>
                <th onClick={() => handleSort('name')} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Nome
                    <SortIcon field="name" />
                  </div>
                </th>
                <th onClick={() => handleSort('address3')} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    Município
                    <SortIcon field="address3" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documentos
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((task, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.form_name || 'N/A'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {task.date_created}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.badge || 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{task.name}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {task.phone_number1 || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {task.email_address1 || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {task.address1 || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {task.address3 || 'N/A'}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>Curriculum: {renderLink(task.curriculum)}</div>
                      <div>Ensino Médio: {renderLink(task.middle_graduation)}</div>
                      <div>Graduação: {renderLink(task.high_graduation)}</div>
                      <div>Registro: {renderLink(task.consul_register)}</div>
                      <div>Certidão: {renderLink(task.debit_certify)}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <a 
                      href={task.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Ver no ClickUp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Paginação */}
      <div className="py-3 flex items-center justify-between border-t border-gray-200 bg-white px-4">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === 1 ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Anterior
          </button>
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              currentPage === totalPages ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Próximo
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{indexOfFirstItem + 1}</span> a{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, sortedTasks.length)}
              </span>{' '}
              de <span className="font-medium">{sortedTasks.length}</span> resultados
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Anterior</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {/* Botões numéricos de página */}
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }
                
                if (pageNumber <= totalPages) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === pageNumber
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                <span className="sr-only">Próximo</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
        
        {/* Seletor de itens por página */}
        <div className="mt-2 sm:mt-0 ml-4">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Volta para a primeira página ao mudar o número de itens
            }}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value={10}>10 por página</option>
            <option value={25}>25 por página</option>
            <option value={50}>50 por página</option>
            <option value={100}>100 por página</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskTable;