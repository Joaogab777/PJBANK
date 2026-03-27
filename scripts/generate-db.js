/**
 * Script para gerar o cliente Prisma baseado no DB_PROVIDER
 * 
 * Este script substitui dinamicamente o provider no schema.prisma
 * antes de executar prisma generate
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PRISMA_DIR = path.join(__dirname, '..', 'prisma');
const SCHEMA_PATH = path.join(PRISMA_DIR, 'schema.prisma');
const BACKUP_PATH = path.join(PRISMA_DIR, 'schema.backup.prisma');
const TEMP_PATH = path.join(PRISMA_DIR, 'schema.temp.prisma');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('Arquivo .env não encontrado!');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const dbProvider = envContent.match(/DB_PROVIDER=(\w+)/)?.[1] || 'postgresql';
  const sqliteUrl = envContent.match(/SQLITE_DATABASE_URL="([^"]+)"/)?.[1] || 'file:./db/pjbank.db';
  
  return { dbProvider, sqliteUrl };
}

function generateSchema(provider, sqliteUrl) {
  const content = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  
  let modified = content;
  
  if (provider === 'sqlite') {
    // Substituir provider e URL para SQLite
    modified = modified.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
    modified = modified.replace(/url\s*=\s*env\("DATABASE_URL"\)/, `url = "${sqliteUrl}"`);
    modified = modified.replace(/directUrl\s*=\s*env\("DIRECT_URL"\)/, '');
    
    // Remover enum para SQLite (SQLite não suporta enums)
    // Remover a definição do enum (do início até o fim)
    const enumRegex = /\nenum\s+TipoTransacao\s*\{[^}]+\}/g;
    modified = modified.replace(enumRegex, '');
    
    // Mudar o campo tipo de enum para String
    modified = modified.replace(/tipo\s+TipoTransacao/, 'tipo String');
    
  } else {
    // Garantir que está usando PostgreSQL
    modified = modified.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
    modified = modified.replace(/url\s*=\s*"file:[^"]+"/, 'url = env("DATABASE_URL")');
    
    // Adicionar directUrl se não existir
    if (!modified.includes('directUrl')) {
      modified = modified.replace(
        /url\s*=\s*env\("DATABASE_URL"\)/,
        'url       = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")'
      );
    }
    
    // Restaurar enum para PostgreSQL
    modified = modified.replace(/tipo\s+String/, 'tipo TipoTransacao');
    
    // Adicionar enum se não existir
    if (!modified.includes('enum TipoTransacao')) {
      modified = modified.trim() + '\n\nenum TipoTransacao {\n  DEPOSITO\n  SAQUE\n  TRANSFERENCIA\n}\n';
    }
  }
  
  return modified;
}

function main() {
  const { dbProvider, sqliteUrl } = loadEnv();
  
  console.log(`\n🎯 Gerando cliente Prisma para: ${dbProvider === 'sqlite' ? '🪶 SQLite' : '🐘 PostgreSQL'}\n`);
  
  // Fazer backup do schema original se não existir
  if (!fs.existsSync(BACKUP_PATH)) {
    fs.copyFileSync(SCHEMA_PATH, BACKUP_PATH);
  }
  
  try {
    // Gerar schema temporário com o provider correto
    const tempSchema = generateSchema(dbProvider, sqliteUrl);
    fs.writeFileSync(TEMP_PATH, tempSchema);
    
    console.log('📝 Schema temporário gerado');
    
    // Executar prisma generate com o schema temporário
    console.log('⚙️  Executando prisma generate...');
    execSync(`npx prisma generate --schema=${TEMP_PATH}`, { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
    
    console.log('\n✅ Cliente Prisma gerado com sucesso!');
    console.log(`   Provider: ${dbProvider}`);
    
  } catch (error) {
    console.error('\n❌ Erro ao gerar cliente Prisma:', error.message);
    process.exit(1);
  } finally {
    // Limpar arquivo temporário
    if (fs.existsSync(TEMP_PATH)) {
      fs.unlinkSync(TEMP_PATH);
    }
  }
}

main();
