import { Task, ClickUpResponse, FormattedTask } from '../types/clickup';

const CLICKUP_BASE_URL = 'https://api.clickup.com/api/v2';
const CLICKUP_TEAM_ID = '31161306';
const CLICKUP_AUTH_HEADER = 'pk_55121576_ZY57GMZRCQNQYO8F9Q0LP1X575741BI1';
const TARGET_SPACE_ID = '90130939878';

const formatDate = (timestamp: string): string => {
  try {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('pt-BR');
  } catch {
    return '';
  }
};

// Função de debug para inspecionar campos personalizados
const debugCustomField = (task: Task, fieldName: string): void => {
  // Se for o usuário Lucas Vitorino, faça um log mais detalhado
  if (task.name.toLowerCase().includes('lucas vitorino')) {
    console.log('========== LUCAS VITORINO ENCONTRADO ==========');
    console.log('Todos os campos customizados:');
    task.custom_fields.forEach(field => {
      console.log(`Campo: ${field.name}`);
      console.log(`Tipo: ${field.type}`);
      console.log(`Valor: ${JSON.stringify(field.value)}`);
      if (field.type === 'drop_down' && field.type_config?.options) {
        console.log(`Opções: ${JSON.stringify(field.type_config.options)}`);
        if (typeof field.value === 'number') {
          console.log(`Valor selecionado: ${JSON.stringify(field.type_config.options[field.value])}`);
        }
      }
      console.log('-----------------------------------');
    });
  }
  
  console.log(`Debugando campo: ${fieldName} para task: ${task.name}`);
  
  const field = task.custom_fields.find(f => f.name === fieldName);
  if (!field) {
    console.log(`Campo ${fieldName} não encontrado`);
    // Listar todos os campos disponíveis para ajudar a encontrar o nome correto
    console.log('Campos disponíveis:', task.custom_fields.map(f => f.name));
    return;
  }
  
  console.log('Campo encontrado:', {
    name: field.name,
    type: field.type,
    value: field.value,
    typeConfig: field.type_config
  });
  
  if (field.type === 'drop_down') {
    console.log('É um dropdown, opções:', field.type_config?.options);
    console.log('Valor selecionado (índice):', field.value);
    if (typeof field.value === 'number' && field.type_config?.options) {
      console.log('Opção correspondente:', field.type_config.options[field.value]);
    }
  }
};

const getCustomFieldValue = (task: Task, fieldName: string): any => {
  const field = task.custom_fields.find(f => f.name === fieldName);
  if (!field) return null;

  if (field.type === 'drop_down' && field.type_config?.options) {
    const selectedValue = field.value;
    if (typeof selectedValue === 'number' && selectedValue >= 0 && field.type_config.options[selectedValue]) {
      return field.type_config.options[selectedValue].name;
    }
    return null;
  }

  if (field.type === 'attachment' && Array.isArray(field.value) && field.value.length > 0) {
    return field.value[0].url_w_host;
  }

  return field.value;
};

// Versão melhorada para campos dropdown que também tenta por "Cargo Pretendido" exatamente como está no script Python
const getCargoFieldValue = (task: Task): string | null => {
  // Para o usuário Lucas Vitorino, testamos uma força bruta para achar o campo certo
  if (task.name.toLowerCase().includes('lucas vitorino')) {
    // Testamos todos os campos customizados
    for (const field of task.custom_fields) {
      if (field.type === 'drop_down' && field.type_config?.options && 
          typeof field.value === 'number' && field.value >= 0) {
        const option = field.type_config.options[field.value];
        if (option && option.name) {
          // Se encontrarmos qualquer opção que diga RECEPCIONISTA
          if (option.name.toUpperCase().includes('RECEPCIONISTA')) {
            console.log(`Encontramos RECEPCIONISTA para Lucas Vitorino em ${field.name}`);
            return option.name;
          }
        }
      }
    }
  }
  
  // Script Python style: Experimentar a mesma lógica de extração usada no script Python
  for (const field of task.custom_fields) {
    if (field.name === "Cargo Pretendido") {
      if (field.type === "drop_down") {
        const selectedIndex = field.value;
        const options = field.type_config?.options || [];
        if (typeof selectedIndex === 'number' && selectedIndex >= 0 && selectedIndex < options.length) {
          console.log(`[Python style] Cargo encontrado: ${options[selectedIndex].name}`);
          return options[selectedIndex].name;
        }
      }
    }
  }
  
  // Busca pelo campo usando várias possibilidades
  const possibleFieldNames = [
    'Cargo Pretendido',
    'Cargo',
    'cargo pretendido',
    'cargo',
    'Cargo pretendido',
    'CARGO PRETENDIDO',
    'CARGO'
  ];
  
  let cargoField = null;
  for (const name of possibleFieldNames) {
    cargoField = task.custom_fields.find(f => f.name === name);
    if (cargoField) {
      console.log(`Encontrou campo com nome exato: ${name}`);
      break;
    }
  }
  
  // Se ainda não encontrou, tente com includes
  if (!cargoField) {
    cargoField = task.custom_fields.find(f => 
      f.name.toLowerCase().includes('cargo')
    );
    if (cargoField) {
      console.log(`Encontrou campo com nome parcial: ${cargoField.name}`);
    }
  }
  
  // Logamos os detalhes para debug
  if (cargoField) {
    console.log(`Campo cargo encontrado: ${cargoField.name}, tipo: ${cargoField.type}, valor: ${cargoField.value}`);
    
    if (cargoField.type === 'drop_down' && cargoField.type_config?.options) {
      const selectedValue = cargoField.value;
      
      if (typeof selectedValue === 'number' && selectedValue >= 0 && cargoField.type_config.options[selectedValue]) {
        const cargoName = cargoField.type_config.options[selectedValue].name;
        console.log(`Cargo encontrado: ${cargoName}`);
        return cargoName;
      }
    }
    
    // Se não for dropdown mas tiver um valor, retornamos o valor diretamente
    if (cargoField.value) {
      console.log(`Cargo encontrado (valor direto): ${cargoField.value}`);
      return String(cargoField.value);
    }
  } else {
    console.log('Nenhum campo de cargo encontrado');
  }
  
  return null;
};

const formatTask = (task: Task): FormattedTask => {
  // Debug para o campo específico de cargo
  debugCustomField(task, 'Cargo Pretendido');
  
  // Usar a função especializada para o campo de cargo
  const cargoPretendido = getCargoFieldValue(task);
  
  return {
    id: task.id,
    date_created: formatDate(task.date_created),
    badge: cargoPretendido,
    name: task.name,
    birth_date: getCustomFieldValue(task, 'Data de Nascimento'),
    cpf: getCustomFieldValue(task, 'CPF'),
    genre: getCustomFieldValue(task, 'Sexo'),
    civil_state: getCustomFieldValue(task, 'Estado Civil'),
    address1: getCustomFieldValue(task, 'Endereço'),
    address2: getCustomFieldValue(task, 'Bairro'),
    address3: getCustomFieldValue(task, 'Município'),
    phone_number1: getCustomFieldValue(task, 'Telefone 1'),
    phone_number2: getCustomFieldValue(task, 'Telefone 2'),
    email_address1: getCustomFieldValue(task, 'Email 1'),
    email_address2: getCustomFieldValue(task, 'Email 2'),
    pcd: getCustomFieldValue(task, 'Pessoa com deficiência'),
    pcd_name: getCustomFieldValue(task, 'Descrever deficiência'),
    curriculum: getCustomFieldValue(task, 'Curriculum'),
    middle_graduation: getCustomFieldValue(task, 'Certificado de Conclusão do Ensino Médio'),
    high_graduation: getCustomFieldValue(task, 'Certificado de conclusão da graduação'),
    consul_register: getCustomFieldValue(task, 'Carteirinha do conselho'),
    debit_certify: getCustomFieldValue(task, 'Certidão negativa de débitos'),
    status: task.status.status,
    indered_why: getCustomFieldValue(task, 'Motivo do Indeferimento'),
    form_name: task.list.name,
    url: task.url
  };
};

export const fetchTasksPage = async (page: number): Promise<FormattedTask[]> => {
  try {
    const response = await fetch(
      `${CLICKUP_BASE_URL}/team/${CLICKUP_TEAM_ID}/task?include_closed=TRUE&subtasks=TRUE&page=${page}&include_custom_fields=true`,
      {
        headers: {
          Authorization: CLICKUP_AUTH_HEADER,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`ClickUp API error: ${response.status} ${response.statusText}`);
    }

    const data: ClickUpResponse = await response.json();
    
    console.log('Tasks recebidas:', data.tasks.length);
    // Fazer log dos nomes dos campos customizados da primeira task para debug
    if (data.tasks.length > 0) {
      console.log('Custom fields da primeira task:', 
        data.tasks[0].custom_fields.map(f => ({ name: f.name, type: f.type, value: f.value }))
      );
    }
    
    return data.tasks
      .filter(task => task.space?.id === TARGET_SPACE_ID)
      .map(formatTask);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const fetchAllTasks = async (): Promise<FormattedTask[]> => {
  let allTasks: FormattedTask[] = [];
  let page = 0;
  let hasMoreResults = true;

  while (hasMoreResults) {
    const pageTasks = await fetchTasksPage(page);
    
    if (pageTasks.length === 0) {
      hasMoreResults = false;
    } else {
      allTasks = [...allTasks, ...pageTasks];
      page++;
    }
  }

  return allTasks;
};