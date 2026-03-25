# PJBANK - Sistema Bancário

Um protótipo de sistema bancário desenvolvido com **Next.js**, **Prisma** e **Supabase (PostgreSQL)**.

## 🚀 Como Rodar o Projeto

Siga os passos abaixo para configurar o projeto em sua máquina local.

### 1. Pré-requisitos

Certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 2. Clonar o Repositório

```bash
git clone <url-do-seu-repositorio>
cd pjbank
```

### 3. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as suas credenciais do **Supabase**. Você pode encontrar essas URLs no painel do Supabase em `Settings > Database`.

```env
# URL do Connection Pooler (Transaction Mode - Porta 6543 ou 5432 dependendo da config)
DATABASE_URL="postgres://postgres.[seuid]:[suasenha]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# URL de Conexão Direta (Session Mode - Porta 5432)
DIRECT_URL="postgres://postgres.[seuid]:[suasenha]@db.[seuid].supabase.co:5432/postgres"
```

> **Nota:** É importante usar o `DIRECT_URL` para as migrações do Prisma funcionarem corretamente no Supabase.

### 4. Instalar Dependências

Instale os pacotes do projeto. Isso também executará o `prisma generate` automaticamente através do script `postinstall`.

```bash
npm install
```

### 5. Sincronizar o Banco de Dados

Para criar as tabelas no seu banco de dados Supabase de acordo com o schema do Prisma:

```bash
# Se você estiver apenas começando e quiser subir o schema rápido:
npm run db:push

# Ou, para rodar as migrações existentes:
npm run db:migrate
```

### 6. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 15+**: Framework React para o frontend e API routes.
- **Prisma**: ORM para manipulação do banco de dados.
- **Supabase**: Banco de dados PostgreSQL escalável.
- **Tailwind CSS**: Estilização moderna e responsiva.

## 📁 Estrutura do Projeto

- `/app`: Páginas e rotas da aplicação (Next.js App Router).
- `/app/api`: Endpoints da API para operações bancárias.
- `/prisma`: Configurações de schema e migrações do banco de dados.
- `/public`: Assets estáticos.
