/**
 * Teste de stress — 10.000 cadastros (5.000 crianças + 5.000 adultos)
 */
const https = require('https');

const SITE = process.env.SITE || 'cerulean-sunflower-53e6e1.netlify.app';
const HALF = 5000;

const NOMES_F = ['Ana','Beatriz','Carla','Daniela','Eduarda','Fernanda','Gabriela','Helena','Isabela','Julia','Karina','Larissa','Mariana','Natalia','Olivia','Patricia','Raquel','Sabrina','Tatiana','Vanessa','Amanda','Bruna','Camila','Debora','Elaine','Fabiana','Gisele','Hortencia','Ingrid','Janaina'];
const NOMES_M = ['Joao','Pedro','Lucas','Mateus','Gabriel','Rafael','Marcos','Felipe','Andre','Carlos','Bruno','Daniel','Eduardo','Fernando','Gustavo','Henrique','Igor','Jose','Leonardo','Marcelo','Nicolas','Otavio','Paulo','Ricardo','Sergio','Thiago','Ulisses','Vinicius','Washington','Xavier'];
const SOBRENOMES = ['Silva','Santos','Oliveira','Souza','Costa','Pereira','Lima','Ferreira','Ribeiro','Almeida','Carvalho','Gomes','Martins','Araujo','Barbosa','Rocha','Dias','Moreira','Nunes','Teixeira','Cavalcanti','Melo','Correia','Vieira','Campos'];
const CIDADES = ['Belford Roxo','Nova Iguacu','Rio de Janeiro','Duque de Caxias','Sao Joao de Meriti','Nilopolis','Mesquita','Queimados','Itaguai','Seropedica','Mage','Japeri'];
const MODALIDADES = ['Natacao','Hidroginastica','Funcional','Boxe','Zumba','Jiu Jitsu','Muay Thai','Capoeira','Pilates','Ballet'];
const TURNOS = ['Manha','Tarde','Noite'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randDate(startYear, endYear) { return randInt(startYear, endYear) + '-' + String(randInt(1,12)).padStart(2,'0') + '-' + String(randInt(1,28)).padStart(2,'0'); }
function randTel() { return '(21)9' + randInt(1000,9999) + '-' + randInt(1000,9999); }
function pick(arr, max) { const n=randInt(1,Math.min(max,arr.length)); return [...arr].sort(()=>Math.random()-0.5).slice(0,n).join(', '); }

function httpPost(path, data) {
  return new Promise((resolve) => {
    const body = JSON.stringify(data);
    const opts = { hostname: SITE, port: 443, path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }, timeout: 30000 };
    const req = https.request(opts, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(d) }); } catch { resolve({ status: res.statusCode, body: d, error: true }); } });
    });
    req.on('error', e => resolve({ status: 0, error: e.message }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, error: 'timeout' }); });
    req.write(body); req.end();
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

(async () => {
  const startTime = Date.now();
  let ok = 0, fail = 0, errors = [];

  console.log('🔬 TESTE DE STRESS: 10.000 CADASTROS');
  console.log(`🌐 https://${SITE}`);
  console.log('📊 5.000 crianças + 5.000 adultos\n');

  // Usar batches de 3 para evitar rate limit
  const BATCH = 3;

  // === ADULTOS ===
  console.log('👤 Iniciando 5.000 adultos...');
  for (let i = 0; i < HALF; i += BATCH) {
    const promises = [];
    for (let j = i; j < Math.min(i + BATCH, HALF); j++) {
      const nome = rand(j < HALF/2 ? NOMES_F : NOMES_M) + ' ' + rand(SOBRENOMES) + ' ' + rand(SOBRENOMES);
      const data = {
        nome, data_nascimento: randDate(1960, 2005),
        sexo: j < HALF/2 ? 'Feminino' : 'Masculino',
        profissao: rand(['Professor(a)','Motorista','Comerciante','Estudante','Dona de Casa','Enfermeiro(a)','Vendedor(a)','Pedreiro','Mecanico','Advogado(a)']),
        cpf: String(randInt(100,999))+'.'+String(randInt(100,999))+'.'+String(randInt(100,999))+'-'+String(randInt(10,99)),
        rg: String(randInt(10000000,99999999)),
        telefone: randTel(),
        email: nome.toLowerCase().replace(/ /g,'.') + '@email.com',
        cidade: rand(CIDADES), uf: 'RJ', bairro: 'Centro',
        endereco: 'Rua ' + rand(SOBRENOMES) + ', ' + randInt(10,2000),
        numero: String(randInt(10,2000)),
        cep: String(randInt(20000,28999))+'-'+String(randInt(100,999)),
        peso: String(randInt(50,100)), altura: (randInt(150,190)/100).toFixed(2),
        modalidade: pick(MODALIDADES, 3),
        turno_desejado: rand(TURNOS),
        condicao_fisica_saude: rand(['Bom','Muito bom','Razoavel']),
        objetivo_peso: rand(['Manter','Aumentar','Diminuir']),
        horas_sono: randInt(5,9)+' horas',
        refeicoes_por_dia: String(randInt(3,6)),
        etilismo: Math.random()>0.7?'Sim':'Nao',
        tabagismo: Math.random()>0.8?'Sim':'Nao',
        composicao_familiar: String(randInt(1,6)),
        pratica_atividade_fisica: Math.random()>0.5?'Sim':'Nao',
        possui_deficiencia: Math.random()>0.9?'Sim':'Nao',
        usa_medicamento: Math.random()>0.8?'Sim':'Nao',
        termo_compromisso: 'on'
      };
      promises.push(httpPost('/api/inscricao/adulto', data));
    }
    const results = await Promise.all(promises);
    for (const r of results) {
      if (r.status === 201 && r.body?.success) ok++;
      else { fail++; errors.push({ type: 'adulto', batch: i, err: r.error || r.body }); }
    }
    if ((i/BATCH) % 25 === 0) {
      const pct = Math.round((i+BATCH)/HALF*100);
      const elapsed = ((Date.now()-startTime)/1000).toFixed(0);
      process.stdout.write(`\r  👤 ${Math.min(i+BATCH,HALF)}/${HALF} (${pct}%) | ✅ ${ok} ❌ ${fail} | ${elapsed}s`);
    }
  }
  process.stdout.write(`\r  👤 ${HALF}/${HALF} (100%) | ✅ ${ok} ❌ ${fail} | ${((Date.now()-startTime)/1000).toFixed(0)}s\n`);

  // === CRIANÇAS ===
  let childOk = 0, childFail = 0;
  console.log('\n🧒 Iniciando 5.000 crianças...');
  for (let i = 0; i < HALF; i += BATCH) {
    const promises = [];
    for (let j = i; j < Math.min(i + BATCH, HALF); j++) {
      const nome = rand(j < HALF/2 ? NOMES_F : NOMES_M) + ' ' + rand(SOBRENOMES) + ' ' + rand(SOBRENOMES);
      const data = {
        nome, data_nascimento: randDate(2012, 2024),
        responsavel_nome: rand(NOMES_F) + ' ' + rand(SOBRENOMES) + ' ' + rand(SOBRENOMES),
        responsavel_parentesco: rand(['Mae','Pai','Avo','Avo','Tio(a)']),
        responsavel_telefone: randTel(),
        responsavel_email: nome.toLowerCase().replace(/ /g,'.') + '.resp@email.com',
        cidade: rand(CIDADES), uf: 'RJ', bairro: 'Centro',
        endereco: 'Rua ' + rand(SOBRENOMES) + ', ' + randInt(10,2000),
        numero: String(randInt(10,2000)),
        cep: String(randInt(20000,28999))+'-'+String(randInt(100,999)),
        peso_aproximado: String(randInt(15,60)),
        estatura_aproximada: (randInt(90,170)/100).toFixed(2),
        situacao_escolar: 'Cursando',
        serie: randInt(1,9)+'o ano',
        turno: rand(['Manha','Tarde','Integral']),
        nome_unidade_escolar: 'Escola Municipal ' + rand(SOBRENOMES),
        situacao_vacinal: Math.random()>0.1?'Regular':'Irregular',
        modalidade: pick(MODALIDADES, 3),
        turno_desejado: rand(TURNOS),
        tratamento_saude: Math.random()>0.9?'Sim':'Nao',
        uso_medicamento_constante: Math.random()>0.9?'Sim':'Nao',
        teve_hepatite: 'Nao',
        possui_convenio_medico: Math.random()>0.5?'Sim':'Nao',
        problema_impossibilita_atividade_fisica: 'Nao',
        termo_compromisso: 'on'
      };
      promises.push(httpPost('/api/inscricao/crianca', data));
    }
    const results = await Promise.all(promises);
    for (const r of results) {
      if (r.status === 201 && r.body?.success) { ok++; childOk++; }
      else { fail++; childFail++; errors.push({ type: 'crianca', batch: i, err: r.error || r.body }); }
    }
    if ((i/BATCH) % 25 === 0) {
      const pct = Math.round((i+BATCH)/HALF*100);
      const elapsed = ((Date.now()-startTime)/1000).toFixed(0);
      process.stdout.write(`\r  🧒 ${Math.min(i+BATCH,HALF)}/${HALF} (${pct}%) | ✅ ${childOk} ❌ ${childFail} | ${elapsed}s`);
    }
  }
  process.stdout.write(`\r  🧒 ${HALF}/${HALF} (100%) | ✅ ${childOk} ❌ ${childFail} | ${((Date.now()-startTime)/1000).toFixed(0)}s\n`);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 RESULTADO FINAL');
  console.log(`${'='.repeat(60)}`);
  console.log(`⏱️  Tempo total: ${elapsed}s (${(elapsed/60).toFixed(1)} min)`);
  console.log(`✅ Sucesso: ${ok}/${HALF*2} (${(ok/(HALF*2)*100).toFixed(2)}%)`);
  console.log(`❌ Falhas: ${fail}/${HALF*2} (${(fail/(HALF*2)*100).toFixed(2)}%)`);
  console.log(`   👤 Adultos: ${HALF-childFail} ok (${childFail} falhas)`);
  console.log(`   🧒 Crianças: ${childOk} ok (${childFail} falhas)`);
  console.log(`${'='.repeat(60)}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Amostra de erros:`);
    errors.slice(0, 10).forEach(e => console.log(`   - ${e.type}#${e.batch}: ${JSON.stringify(e.err).substring(0,120)}`));
  }

  // Verificar stats
  console.log(`\n🔍 Verificando dados no servidor...`);
  await sleep(2000);
  try {
    const login = await httpPost('/api/admin/login', { username: 'admin', password: 'admin123' });
    const token = login.body.token;
    const statsResp = await new Promise((resolve) => {
      const opts = { hostname: SITE, port: 443, path: '/api/admin/stats', method: 'GET', headers: { 'x-session-token': token }, timeout: 30000 };
      const req = https.request(opts, (res) => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(JSON.parse(d))); });
      req.on('error',()=>resolve({})); req.end();
    });
    console.log(`📦 Supabase stats:`);
    console.log(`   🧒 Crianças: ${statsResp.total_criancas || 0}`);
    console.log(`   👤 Adultos:  ${statsResp.total_adultos || 0}`);
    console.log(`   📋 Total:    ${statsResp.total_geral || 0}`);
    console.log(`   🆕 Últ. 7d: ${(statsResp.recentes_criancas||0)+(statsResp.recentes_adultos||0)}`);
  } catch(e) {
    console.log(`⚠️ Erro ao verificar stats: ${e.message}`);
  }

  console.log(`\n✅ Teste concluído!`);
  process.exit(fail > HALF*2*0.01 ? 1 : 0);
})();
