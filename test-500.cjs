/**
 * Teste de stress — 500 cadastros (250 crianças + 250 adultos)
 * Testa persistência, performance e integridade dos dados
 */
const https = require('https');

const SITE = process.env.SITE || 'cerulean-sunflower-53e6e1.netlify.app';
const TOTAL = 500;
const HALF = 250;

const NOMES_F = ['Ana','Beatriz','Carla','Daniela','Eduarda','Fernanda','Gabriela','Helena','Isabela','Julia','Karina','Larissa','Mariana','Natalia','Olivia','Patricia','Raquel','Sabrina','Tatiana','Vanessa','Amanda','Bruna','Camila','Debora','Elaine'];
const NOMES_M = ['Joao','Pedro','Lucas','Mateus','Gabriel','Rafael','Marcos','Felipe','Andre','Carlos','Bruno','Daniel','Eduardo','Fernando','Gustavo','Henrique','Igor','Jose','Leonardo','Marcelo','Nicolas','Otavio','Paulo','Ricardo','Sergio'];
const SOBRENOMES = ['Silva','Santos','Oliveira','Souza','Costa','Pereira','Lima','Ferreira','Ribeiro','Almeida','Carvalho','Gomes','Martins','Araujo','Barbosa','Rocha','Dias','Moreira','Nunes','Teixeira'];
const CIDADES = ['Belford Roxo','Nova Iguacu','Rio de Janeiro','Duque de Caxias','Sao Joao de Meriti','Nilopolis','Mesquita','Queimados','Itaguai','Seropedica'];
const MODALIDADES = ['Natacao','Hidroginastica','Funcional','Boxe','Zumba','Jiu Jitsu','Muay Thai','Capoeira','Pilates'];
const TURNOS = ['Manha','Tarde','Noite'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randDate(startYear, endYear) {
  const y = randInt(startYear, endYear);
  const m = String(randInt(1, 12)).padStart(2, '0');
  const d = String(randInt(1, 28)).padStart(2, '0');
  return y + '-' + m + '-' + d;
}
function randTel() { return '(21)9' + randInt(1000,9999) + '-' + randInt(1000,9999); }
function pick(arr, max) {
  const n = randInt(1, Math.min(max, arr.length));
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function httpPost(path, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const opts = {
      hostname: SITE,
      port: 443,
      path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
      timeout: 30000
    };
    const req = https.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d, error: true }); }
      });
    });
    req.on('error', e => reject(e));
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(body);
    req.end();
  });
}

async function testAdulto(i) {
  const nome = rand(i < HALF/2 ? NOMES_F : NOMES_M) + ' ' + rand(SOBRENOMES);
  const mods = pick(MODALIDADES, 2).join(', ');
  const dados = {
    nome,
    data_nascimento: randDate(1960, 2005),
    idade: '',
    sexo: i < HALF/2 ? 'Feminino' : 'Masculino',
    profissao: rand(['Professor(a)','Motorista','Comerciante','Estudante','Dona de Casa','Enfermeiro(a)','Vendedor(a)']),
    cpf: String(randInt(100,999)) + '.' + String(randInt(100,999)) + '.' + String(randInt(100,999)) + '-' + String(randInt(10,99)),
    rg: 'MG-' + String(randInt(1000000, 99999999)),
    telefone: randTel(),
    email: nome.toLowerCase().replace(' ','.') + '@email.com',
    cidade: rand(CIDADES),
    uf: 'RJ',
    bairro: 'Centro',
    endereco: 'Rua ' + rand(SOBRENOMES) + ', ' + randInt(10, 2000),
    numero: String(randInt(10, 2000)),
    cep: String(randInt(20000, 28999)) + '-' + String(randInt(100, 999)),
    peso: String(randInt(50, 100)),
    altura: (randInt(150, 190) / 100).toFixed(2),
    modalidade: mods,
    turno_desejado: rand(TURNOS),
    condicao_fisica_saude: rand(['Bom','Muito bom','Razoavel']),
    objetivo_peso: rand(['Manter','Aumentar','Diminuir']),
    horas_sono: randInt(5, 9) + ' horas',
    refeicoes_por_dia: String(randInt(3, 6)),
    etilismo: Math.random() > 0.7 ? 'Sim' : 'Nao',
    tabagismo: Math.random() > 0.8 ? 'Sim' : 'Nao',
    composicao_familiar: String(randInt(1, 6)),
    pratica_atividade_fisica: Math.random() > 0.5 ? 'Sim' : 'Nao',
    possui_deficiencia: Math.random() > 0.9 ? 'Sim' : 'Nao',
    usa_medicamento: Math.random() > 0.8 ? 'Sim' : 'Nao',
    termo_compromisso: 'on'
  };
  return httpPost('/api/inscricao/adulto', dados);
}

async function testCrianca(i) {
  const nome = rand(i < HALF/2 ? NOMES_F : NOMES_M) + ' ' + rand(SOBRENOMES);
  const mods = pick(MODALIDADES, 2).join(', ');
  const dados = {
    nome,
    data_nascimento: randDate(2012, 2024),
    idade: '',
    responsavel_nome: rand(NOMES_F) + ' ' + rand(SOBRENOMES) + ' ' + rand(SOBRENOMES),
    responsavel_parentesco: rand(['Mae','Pai','Avo','Avo','Tio(a)']),
    responsavel_telefone: randTel(),
    responsavel_email: nome.toLowerCase().replace(' ','.') + '.resp@email.com',
    cidade: rand(CIDADES),
    uf: 'RJ',
    bairro: 'Centro',
    endereco: 'Rua ' + rand(SOBRENOMES) + ', ' + randInt(10, 2000),
    numero: String(randInt(10, 2000)),
    cep: String(randInt(20000, 28999)) + '-' + String(randInt(100, 999)),
    peso_aproximado: String(randInt(15, 60)),
    estatura_aproximada: (randInt(90, 170) / 100).toFixed(2),
    situacao_escolar: 'Cursando',
    serie: randInt(1, 9) + 'o ano',
    turno: rand(['Manha','Tarde','Integral']),
    nome_unidade_escolar: 'Escola Municipal ' + rand(SOBRENOMES),
    situacao_vacinal: Math.random() > 0.1 ? 'Regular' : 'Irregular',
    modalidade: mods,
    turno_desejado: rand(TURNOS),
    tratamento_saude: Math.random() > 0.9 ? 'Sim' : 'Nao',
    uso_medicamento_constante: Math.random() > 0.9 ? 'Sim' : 'Nao',
    teve_hepatite: 'Nao',
    possui_convenio_medico: Math.random() > 0.5 ? 'Sim' : 'Nao',
    problema_impossibilita_atividade_fisica: 'Nao',
    termo_compromisso: 'on'
  };
  return httpPost('/api/inscricao/crianca', dados);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const startTime = Date.now();
  let ok = 0, fail = 0, errors = [];

  console.log(`🔬 Teste de stress: ${TOTAL} cadastros`);
  console.log(`🌐 Site: https://${SITE}`);
  console.log(`📊 250 crianças + 250 adultos\n`);

  // Fazer em lotes de 10 para não sobrecarregar
  const BATCH = 5;

  // === ADULTOS ===
  console.log('👤 Cadastrando 250 adultos...');
  for (let i = 0; i < HALF; i += BATCH) {
    const batch = [];
    for (let j = i; j < Math.min(i + BATCH, HALF); j++) {
      batch.push(testAdulto(j));
    }
    const results = await Promise.allSettled(batch);
    for (let k = 0; k < results.length; k++) {
      const r = results[k];
      if (r.status === 'fulfilled' && r.value.status === 201 && r.value.body.success) {
        ok++;
      } else {
        fail++;
        const err = r.status === 'fulfilled' ? JSON.stringify(r.value.body).substring(0, 100) : r.reason?.message || 'unknown';
        errors.push(`Adulto #${i+k+1}: ${err}`);
      }
    }
    // Progresso
    const pct = Math.round((i + BATCH) / HALF * 100);
    process.stdout.write(`\r   Adultos: ${Math.min(i+BATCH, HALF)}/${HALF} (${pct}%) | ✅ ${ok} ❌ ${fail}`);
    await sleep(200);
  }
  console.log('');

  // === CRIANÇAS ===
  console.log('🧒 Cadastrando 250 crianças...');
  let childOk = 0, childFail = 0;
  for (let i = 0; i < HALF; i += BATCH) {
    const batch = [];
    for (let j = i; j < Math.min(i + BATCH, HALF); j++) {
      batch.push(testCrianca(j));
    }
    const results = await Promise.allSettled(batch);
    for (let k = 0; k < results.length; k++) {
      const r = results[k];
      if (r.status === 'fulfilled' && r.value.status === 201 && r.value.body.success) {
        ok++; childOk++;
      } else {
        fail++; childFail++;
        const err = r.status === 'fulfilled' ? JSON.stringify(r.value.body).substring(0, 100) : r.reason?.message || 'unknown';
        errors.push(`Criança #${i+k+1}: ${err}`);
      }
    }
    const pct = Math.round((i + BATCH) / HALF * 100);
    process.stdout.write(`\r   Crianças: ${Math.min(i+BATCH, HALF)}/${HALF} (${pct}%) | ✅ ${childOk} ❌ ${childFail}`);
    await sleep(200);
  }
  console.log('');

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 RESULTADO FINAL`);
  console.log(`${'='.repeat(60)}`);
  console.log(`⏱️  Tempo total: ${elapsed}s`);
  console.log(`✅ Sucesso: ${ok}/${TOTAL} (${(ok/TOTAL*100).toFixed(2)}%)`);
  console.log(`❌ Falhas: ${fail}/${TOTAL} (${(fail/TOTAL*100).toFixed(2)}%)`);
  console.log(`   👤 Adultos: ${HALF - (fail - childFail) - childFail} ok (${childFail} falhas)`);
  console.log(`   🧒 Crianças: ${childOk} ok (${childFail} falhas)`);
  console.log(`${'='.repeat(60)}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Primeiros erros:`);
    errors.slice(0, 10).forEach(e => console.log(`   - ${e}`));
    if (errors.length > 10) console.log(`   ... e mais ${errors.length - 10} erros`);
  }

  // Verificar stats
  console.log(`\n🔍 Verificando dados no servidor...`);
  await sleep(1000);
  try {
    const login = await httpPost('/api/admin/login', { username: 'admin', password: 'admin123' });
    const token = login.body.token;
    const stats = await new Promise((resolve, reject) => {
      const opts = { hostname: SITE, port: 443, path: '/api/admin/stats', method: 'GET', headers: { 'x-session-token': token }, timeout: 15000 };
      const req = https.request(opts, (res) => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))); });
      req.on('error', reject); req.end();
    });
    console.log(`📦 Dados no servidor:`);
    console.log(`   🧒 Crianças: ${stats.total_criancas}`);
    console.log(`   👤 Adultos:  ${stats.total_adultos}`);
    console.log(`   📋 Total:    ${stats.total_geral}`);
    console.log(`   🆕 Últ. 7d: ${stats.recentes_criancas + stats.recentes_adultos}`);
    console.log(`\n✅ Teste concluído!`);
  } catch(e) {
    console.log(`⚠️  Erro ao verificar stats: ${e.message}`);
  }

  process.exit(fail > TOTAL * 0.1 ? 1 : 0);
})();
