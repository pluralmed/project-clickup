import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config/supabaseConfig';

// Cria o cliente do Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Login com email e senha
export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(`Erro ao fazer login: ${error.message}`);
  }

  return data;
};

// Logout do usuário
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(`Erro ao fazer logout: ${error.message}`);
  }
};

// Obter usuário atual
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    return null;
  }
  
  return data?.user || null;
};

// Verificar se a sessão está ativa
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    return null;
  }
  
  return data.session;
}; 