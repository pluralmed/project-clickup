export interface Task {
  id: string;
  name: string;
  date_created: string;
  status: {
    status: string;
    color: string;
  };
  custom_fields: {
    id: string;
    name: string;
    type: string;
    type_config?: {
      options?: Array<{
        name: string;
      }>;
    };
    value: any;
  }[];
  url: string;
  list: {
    name: string;
  };
  space?: {
    id: string;
  };
}

export interface ClickUpResponse {
  tasks: Task[];
}

export interface FormattedTask {
  id?: string;
  date_created: string;
  badge: string | null;
  name: string;
  birth_date: string | null;
  cpf: string | null;
  genre: string | null;
  civil_state: string | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  phone_number1: string | null;
  phone_number2: string | null;
  email_address1: string | null;
  email_address2: string | null;
  pcd: string | null;
  pcd_name: string | null;
  curriculum: string | null;
  middle_graduation: string | null;
  high_graduation: string | null;
  consul_register: string | null;
  debit_certify: string | null;
  status: string;
  indered_why: string | null;
  form_name: string;
  url: string;
}