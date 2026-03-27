/**
 * Script para configurar o banco de dados (push/migrate)
 * Baseado no DB_PROVIDER atual
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
  const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
  const content = fs.readFileSync(schemaPath, 'utf-8');
  
  let modified = content;
  
  if (provider === 'sqlite') {
    modified = modified.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
    modified = modified.replace(/url\s*=\s*env\("DATABASE_URL"\)/, `url = "${sqliteUrl}"`);
    modified = modified.replace(/directUrl\s*=\s*env\("DIRECT_URL"\)/, '');
    
    // Remover enum para SQLite (SQLite não suporta enums)
    const enumRegex = /\nenum\s+TipoTransacao\s*\{[^}]+\}/g;
    modified = modified.replace(enumRegex, '');
    modified = modified.replace(/tipo\s+TipoTransacao/, 'tipo String');
    
  } else {
    modified = modified.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
    modified = modified.replace(/url\s*=\s*"file:[^"]+"/, 'url = env("DATABASE_URL")');
    
    if (!modified.includes('directUrl')) {
      modified = modified.replace(
        /url\s*=\s*env\("DATABASE_URL"\)/,
        'url       = env("DATABASE_URL")\n  directUrl = env("DIRECT_URL")'
      );
    }
    
    // Restaurar enum para PostgreSQL
    modified = modified.replace(/tipo\s+String/, 'tipo TipoTransacao');
    
    if (!modified.includes('enum TipoTransacao')) {
      modified = modified.trim() + '\n\nenum TipoTransacao {\n  DEPOSITO\n  SAQUE\n  TRANSFERENCIA\n}\n';
    }
  }
  
  return modified;
}

function main() {
  const action = process.argv[2]; // 'push' ou 'migrate'
  const { dbProvider, sqliteUrl } = loadEnv();
  
  if (!['push', 'migrate'].includes(action)) {
    console.log(`
📦 Script para configurar o banco de dados

Uso:
  node scripts/setup-db.js push     - Executar db push
  node scripts/setup-db.js migrate - Executar migrate dev

Banco atual: ${dbProvider === 'sqlite' ? '🪶 SQLite' : '🐘 PostgreSQL'}
`);
    return;
  }
  
  console.log(`\n🎯 Configurando banco: ${dbProvider === 'sqlite' ? '🪶 SQLite' : '🐘 PostgreSQL'}`);
  console.log(`   Ação: ${action}\n`);
  
  const tempSchema = generateSchema(dbProvider, sqliteUrl);
  const tempPath = path.join(__dirname, '..', 'prisma', 'schema.temp.prisma');
  
  try {
    fs.writeFileSync(tempPath, tempSchema);
    
    const cmd = action === 'push' 
      ? `npx prisma db push --schema=${tempPath}` 
      : `npx prisma migrate dev --schema=${tempPath} --name init`;
    
    execSync(cmd, { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    
    console.log('\n✅ Banco configurado com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro ao configurar banco:', error.message);
    process.exit(1);
  } finally {
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
}

main();
