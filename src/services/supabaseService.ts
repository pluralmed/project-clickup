import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config/supabaseConfig';

// Cria o cliente do Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('Supabase client inicializado com URL:', SUPABASE_URL);

// Login com email e senha
export const signInWithEmail = async (email: string, password: string) => {
  console.log('Tentando login com email:', email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Erro no login:', error.message);
    throw new Error(`Erro ao fazer login: ${error.message}`);
  }

  console.log('Login bem-sucedido:', data.user?.email);
  return data;
};

// Logout do usuário
export const signOut = async () => {
  console.log('Iniciando processo de logout');
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Erro no logout:', error.message);
    throw new Error(`Erro ao fazer logout: ${error.message}`);
  }

  console.log('Logout realizado com sucesso');
};

// Obter usuário atual
export const getCurrentUser = async () => {
  console.log('Verificando usuário atual');
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Erro ao obter usuário:', error.message);
    return null;
  }
  
  if (data.user) {
    console.log('Usuário encontrado:', data.user.email);
  } else {
    console.log('Nenhum usuário encontrado');
  }
  
  return data?.user || null;
};

// Verificar se a sessão está ativa
export const getSession = async () => {
  console.log('Verificando sessão');
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Erro ao verificar sessão:', error.message);
    return null;
  }
  
  if (data.session) {
    console.log('Sessão ativa encontrada para:', data.session.user.email);
  } else {
    console.log('Nenhuma sessão ativa encontrada');
  }
  
  return data.session;
}; 