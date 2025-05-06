# Aplicação de Gerenciamento de Inscrições

Esta aplicação permite visualizar, filtrar e gerenciar dados de inscrições armazenados no ClickUp, com integração ao Supabase para autenticação.

## Funcionalidades

- Autenticação segura com Supabase
- Busca automática de tarefas do ClickUp
- Filtros por nome, formulário, data e cargo
- Exportação de dados para Excel

## Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm (ou yarn)

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```

### Configuração do Supabase

1. Crie uma conta gratuita no [Supabase](https://supabase.com/)
2. Crie um novo projeto
3. Configure a autenticação por email e senha em Authentication > Providers
4. Crie usuários para acesso ao sistema em Authentication > Users

5. Crie um arquivo `.env` na raiz do projeto com as seguintes informações:

```
VITE_SUPABASE_URL=sua-url-do-supabase
VITE_SUPABASE_KEY=sua-chave-do-supabase
```

Para obter estas informações:
- URL: Vá para Project Settings > API > Project URL
- Key: Vá para Project Settings > API > anon/public key

### Execução

Para iniciar o projeto em modo de desenvolvimento:

```
npm run dev
```

## Uso

1. Faça login com as credenciais configuradas no Supabase
2. A aplicação carrega automaticamente os dados do ClickUp
3. Use os filtros para encontrar inscrições específicas
4. Exporte os dados filtrados para Excel quando necessário

## Tecnologias utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Autenticação)
- ClickUp API 