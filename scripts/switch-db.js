/**
 * Script para trocar entre PostgreSQL e SQLite
 * 
 * Uso:
 *   node scripts/switch-db.js postgresql   - Ativar PostgreSQL
 *   node scripts/switch-db.js sqlite       - Ativar SQLite
 *   node scripts/switch-db.js status      - Verificar banco atual
 */

const fs = require('fs');
const path = require('path');

const ENV_PATH = path.join(__dirname, '..', '.env');

function readEnv() {
  if (!fs.existsSync(ENV_PATH)) {
    console.error('Arquivo .env não encontrado!');
    process.exit(1);
  }
  return fs.readFileSync(ENV_PATH, 'utf-8');
}

function writeEnv(content) {
  fs.writeFileSync(ENV_PATH, content, 'utf-8');
}

function updateEnv(provider) {
  const content = readEnv();
  const lines = content.split('\n');
  
  let found = false;
  const newLines = lines.map(line => {
    if (line.startsWith('DB_PROVIDER=')) {
      found = true;
      return `DB_PROVIDER=${provider}`;
    }
    return line;
  });
  
  if (!found) {
    newLines.push(`DB_PROVIDER=${provider}`);
  }
  
  writeEnv(newLines.join('\n'));
}

function getCurrentProvider() {
  const content = readEnv();
  const match = content.match(/DB_PROVIDER=(\w+)/);
  return match ? match[1] : 'postgresql';
}

function showStatus() {
  const provider = getCurrentProvider();
  console.log(`\n📊 Status do Banco de Dados`);
  console.log(`═══════════════════════════════`);
  console.log(`Provider atual: ${provider === 'sqlite' ? '🪶 SQLite' : '🐘 PostgreSQL (Supabase)'}`);
  console.log(`═══════════════════════════════\n`);
}

// Main
const arg = process.argv[2];

switch (arg) {
  case 'postgresql':
    updateEnv('postgresql');
    console.log('✅ Banco alterado para PostgreSQL (Supabase)');
    console.log('   Execute: npm run db:generate && npm run db:push\n');
    break;
    
  case 'sqlite':
    updateEnv('sqlite');
    console.log('✅ Banco alterado para SQLite');
    console.log('   Execute: npm run db:sqlite:generate && npm run db:sqlite:push\n');
    break;
    
  case 'status':
    showStatus();
    break;
    
  default:
    console.log(`
🎛️  Script para trocar entre bancos de dados

Uso:
  node scripts/switch-db.js <comando>

Comandos:
  postgresql   - Trocar para PostgreSQL (Supabase)
  sqlite       - Trocar para SQLite
  status       - Verificar banco atual

Exemplos:
  npm run db:use:postgres   # Ativar PostgreSQL
  npm run db:use:sqlite    # Ativar SQLite
  npm run db:status        # Ver status
`);
}
