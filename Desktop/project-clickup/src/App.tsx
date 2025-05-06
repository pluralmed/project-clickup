import React, { useState, useEffect } from 'react';
import TaskTable from './components/TaskTable';
import Header from './components/Header';
import { fetchAllTasks } from './services/clickupService';
import { FormattedTask } from './types/clickup';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import * as XLSX from 'xlsx';
import { Search, Calendar, ClipboardList, BadgeCheck } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState<FormattedTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtros
  const [nameFilter, setNameFilter] = useState<string>('');
  const [formFilter, setFormFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [cargoFilter, setCargoFilter] = useState<string>('');

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await fetchAllTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleRefresh = () => {
    loadTasks();
  };

  const handleExportExcel = () => {
    if (tasks.length === 0) return;

    // Preparar os dados para exportação
    const exportData = tasks.map(task => ({
      'Formulário': task.form_name || 'N/A',
      'Data de Inscrição': task.date_created || 'N/A',
      'Cargo': task.badge || 'N/A',
      'Nome': task.name || 'N/A',
      'Município': task.address3 || 'N/A',
      'Telefone': task.phone_number1 || 'N/A',
      'Email': task.email_address1 || 'N/A',
      'Status': task.status || 'N/A',
      'CPF': task.cpf || 'N/A',
      'Data de Nascimento': task.birth_date || 'N/A',
      'Gênero': task.genre || 'N/A',
      'Estado Civil': task.civil_state || 'N/A',
      'Endereço': task.address1 || 'N/A',
      'Bairro': task.address2 || 'N/A',
      'PCD': task.pcd || 'N/A',
      'Descrição PCD': task.pcd_name || 'N/A',
      'Link ClickUp': task.url || 'N/A',
    }));

    // Criar uma planilha do Excel com os dados
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Ajustar a largura das colunas
    const columnWidths = [
      { wch: 20 }, // Formulário
      { wch: 15 }, // Data de Inscrição
      { wch: 20 }, // Cargo
      { wch: 30 }, // Nome
      { wch: 15 }, // Município
      { wch: 15 }, // Telefone
      { wch: 25 }, // Email
      { wch: 15 }, // Status
      { wch: 15 }, // CPF
      { wch: 15 }, // Data de Nascimento
      { wch: 10 }, // Gênero
      { wch: 15 }, // Estado Civil
      { wch: 30 }, // Endereço
      { wch: 20 }, // Bairro
      { wch: 5 },  // PCD
      { wch: 20 }, // Descrição PCD
      { wch: 30 }, // Link ClickUp
    ];
    
    worksheet['!cols'] = columnWidths;
    
    // Criar um livro de trabalho e adicionar a planilha
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inscrições");
    
    // Gerar o arquivo Excel e fazer o download
    const excelFileName = `clickup-inscricoes-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, excelFileName);
  };

  // Aplicar filtros
  const filteredTasks = tasks.filter(task => {
    const nameMatch = task.name.toLowerCase().includes(nameFilter.toLowerCase());
    const formMatch = task.form_name.toLowerCase().includes(formFilter.toLowerCase());
    const dateMatch = task.date_created.includes(dateFilter);
    const cargoMatch = task.badge ? task.badge.toLowerCase().includes(cargoFilter.toLowerCase()) : false;
    
    return nameMatch && formMatch && dateMatch && cargoMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onRefresh={handleRefresh} onExportCSV={handleExportExcel} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filtrar por nome..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ClipboardList className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filtrar por formulário..."
              value={formFilter}
              onChange={(e) => setFormFilter(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filtrar por data..."
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BadgeCheck className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filtrar por cargo..."
              value={cargoFilter}
              onChange={(e) => setCargoFilter(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <TaskTable tasks={filteredTasks} />
          )}
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
        <p>Fonte: ClickUp</p>
      </footer>
    </div>
  );
}

export default App;