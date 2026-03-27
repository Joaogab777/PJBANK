# 🗄️ Sistema Dual Database - PJBANK

Este projeto suporta dois bancos de dados: **PostgreSQL (Supabase)** e **SQLite**.

## 🚀 Como Usar

### 1. Verificar Status do Banco Atual

```bash
npm run db:status
```

### 2. Trocar para PostgreSQL (Supabase)

```bash
npm run db:use:postgres
npm run db:generate    # Gerar cliente Prisma
npm run db:push       # Criar/atualizar schema
```

### 3. Trocar para SQLite

```bash
npm run db:use:sqlite
npm run db:generate   # Gerar cliente Prisma
npm run db:push       # Criar/atualizar banco local
```

## 📋 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run db:status` | Verificar qual banco está ativo |
| `npm run db:use:postgres` | Trocar para PostgreSQL |
| `npm run db:use:sqlite` | Trocar para SQLite |
| `npm run db:generate` | Gerar cliente Prisma |
| `npm run db:push` | Aplicar schema ao banco |
| `npm run db:migrate` | Criar migrations |
| `npm run db:studio` | Abrir Prisma Studio |

## ⚙️ Configuração (.env)

```env
# Seletor de banco: "postgresql" ou "sqlite"
DB_PROVIDER=postgresql

# PostgreSQL (Supabase)
DIRECT_URL=postgresql://...
DATABASE_URL=postgresql://...

# SQLite
SQLITE_DATABASE_URL="file:./prisma/dev.db"
```

## 🔄 Fluxo de Troca de Banco

1. **Alterar `.env`** → `DB_PROVIDER=sqlite` (ou `postgresql`)
2. **Gerar cliente** → `npm run db:generate`
3. **Aplicar schema** → `npm run db:push`
4. **Reiniciar o app** → `npm run dev`

## ⚠️ Notas Importantes

- O enum `TipoTransacao` é convertido para `String` no SQLite (SQLite não suporta enums)
- Em produção, sempre use PostgreSQL
- O banco SQLite é local (`./prisma/dev.db`)
- Certifique-se de que `DB_PROVIDER` está correto antes de executar comandos

## 🐛 Troubleshooting

### Erro de Module Not Found
```bash
npm run db:generate
```

### Banco não criado
```bash
npm run db:push
```

### Problemas com cache
```bash
rm -rf node_modules/.prisma
npm run db:generate
```
