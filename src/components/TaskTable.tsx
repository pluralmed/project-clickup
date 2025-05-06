import React, { useState } from 'react';
import { FormattedTask } from '../types/clickup';
import { Calendar, ChevronDown, ChevronUp, ExternalLink, User, FileText, Phone, Mail, MapPin, BadgeCheck, Building, ClipboardList } from 'lucide-react';

interface TaskTableProps {
  tasks: FormattedTask[];
}

type SortField = keyof FormattedTask;
type SortDirection = 'asc' | 'desc';

const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
  const [sortField, setSortField] = useState<SortField>('date_created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
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
          {sortedTasks.map((task, index) => (
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
  );
};

export default TaskTable;