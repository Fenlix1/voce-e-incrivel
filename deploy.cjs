/**
 * deploy.cjs — Deploy inteligente com backup de dados
 *
 * Fluxo:
 * 1. Faz login no admin da API live
 * 2. Baixa backup dos dados atuais
 * 3. Salva em netlify/functions/data/ (será incluído no bundle)
 * 4. Executa deploy normalmente
 *
 * Uso: node deploy.cjs
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE = process.env.SITE_URL || 'https://cerulean-sunflower-53e6e1.netlify.app';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

function httpReq(method, urlPath, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, SITE);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' },
      rejectUnauthorized: true
    };
    if (token) options.headers['x-session-token'] = token;

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function backupData() {
  // Step 1: Login
  console.log('🔑 Fazendo login no admin...');
  const login = await httpReq('POST', '/api/admin/login', { username: ADMIN_USER, password: ADMIN_PASS });
  if (!login.body.success || !login.body.token) {
    throw new Error('Falha no login: ' + JSON.stringify(login.body));
  }
  const token = login.body.token;
  console.log('✅ Login ok');

  // Step 2: Download backup
  console.log('📥 Baixando dados live...');
  const bak = await httpReq('GET', '/api/admin/backup', null, token);
  if (bak.status !== 200) {
    throw new Error('Falha no backup: ' + JSON.stringify(bak.body));
  }

  // Step 3: Save to netlify/functions/ (raiz da função)
  const bundleDir = path.join(__dirname, 'netlify', 'functions');
  if (!fs.existsSync(bundleDir)) fs.mkdirSync(bundleDir, { recursive: true });

  fs.writeFileSync(path.join(bundleDir, '_criancas.json'), JSON.stringify(bak.body.criancas || []));
  fs.writeFileSync(path.join(bundleDir, '_adultos.json'), JSON.stringify(bak.body.adultos || []));
  fs.writeFileSync(path.join(bundleDir, '_admin.json'), JSON.stringify(bak.body.admin_users || []));

  const count = (bak.body.criancas||[]).length + (bak.body.adultos||[]).length;
  console.log(`💾 Backup salvo: ${count} inscrições em netlify/functions/data/`);
  console.log(`   🧒 Crianças: ${(bak.body.criancas||[]).length}`);
  console.log(`   👤 Adultos: ${(bak.body.adultos||[]).length}`);
}

async function deploy() {
  console.log('\n🚀 Iniciando deploy...\n');
  execSync('npx netlify deploy --prod --dir=public --functions=netlify/functions', {
    cwd: __dirname,
    stdio: 'inherit'
  });
}

(async () => {
  try {
    await backupData();
    await deploy();
    console.log('\n✅ Deploy concluído com backup de dados preservado!');
    console.log(`   Site: ${SITE}`);
  } catch (err) {
    console.error('\n❌ Erro:', err.message);
    process.exit(1);
  }
})();
