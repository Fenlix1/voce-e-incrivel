/**
 * storage.js — Supabase schemaless (jsonb dados)
 * Campos desconhecidos automaticamente vão para jsonb 'dados'
 */
const crypto = require('crypto');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zzsnltnxonttilruiloc.supabase.co';
const getKey = () => process.env.SUPABASE_SERVICE_KEY;

function api(path, opts = {}) {
  const headers = { 'apikey': getKey(), 'Authorization': 'Bearer ' + getKey(), ...opts.headers };
  if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  return fetch(SUPABASE_URL + '/rest/v1/' + path, { ...opts, headers });
}

// Colunas que existem no Supabase (atualizadas)
const ADULTO_COLS = new Set([
  'nome','matricula','profissao','data_nascimento','idade','sexo','cpf','rg','orgao_emissor',
  'filiacao_pai','filiacao_mae','composicao_familiar','telefone','email','peso','altura',
  'cep','endereco','numero','bairro','cidade','uf','modalidade','turno_desejado','objetivo',
  'possui_deficiencia','possui_deficiencia_descricao','ja_frequentou_modalidade','ja_frequentou_tempo',
  'pratica_atividade_fisica','pratica_atividade_qual','pratica_atividade_frequencia',
  'condicao_fisica_saude','problema_muscular_etc','problema_muscular_qual',
  'antecedentes_familiares','usa_medicamento','usa_medicamento_qual','usa_medicamento_motivo',
  'faz_tratamento','faz_tratamento_outros_qual','horas_sono','etilismo','tabagismo',
  'refeicoes_por_dia','objetivo_peso','obs','termo_compromisso','dados'
]);

const CRIANCA_COLS = new Set([
  'nome','matricula','data_nascimento','idade','peso_aproximado','estatura_aproximada',
  'data_ultima_avaliacao_medica','responsavel_nome','responsavel_parentesco','responsavel_cpf',
  'responsavel_telefone','responsavel_email','cep','endereco','numero','bairro','cidade','uf',
  'situacao_escolar','serie','turno','nome_unidade_escolar','modalidade','turno_desejado',
  'intervencao_cirurgica','situacao_vacinal','situacao_vacinal_irregular_especifique',
  'medicamentos_ultimos_tempos','tem_alergia','tratamento_saude','tratamento_saude_especifique',
  'uso_medicamento_constante','uso_medicamento_especifique','problema_tipo','problema_especifique',
  'condicao_saude','condicoes_saude_especifique','responsavel_acompanhamento',
  'responsavel_acompanhamento_outros','problema_impossibilita_atividade_fisica',
  'problema_impossibilita_especifique','teve_hepatite','possui_convenio_medico',
  'convenio_medico_qual','obs','termo_compromisso','dados'
]);

function separarCampos(dados, knownCols) {
  const conhecidos = {};
  const extras = {};
  for (const [k, v] of Object.entries(dados)) {
    if (k === 'id' || k === 'created_at' || k === 'updated_at') continue;
    if (knownCols.has(k)) conhecidos[k] = v;
    else if (v !== undefined && v !== null && v !== '') extras[k] = v;
  }
  if (Object.keys(extras).length > 0) conhecidos.dados = extras;
  return conhecidos;
}

// ==================== Admin ====================
function hashPw(pw) { return crypto.createHmac('sha256','projeto-social-salt-2024').update(pw).digest('hex'); }

async function getAdmin(username) {
  try {
    const r = await api('admin_users?username=eq.' + encodeURIComponent(username) + '&limit=1');
    return (await r.json())[0] || null;
  } catch(e) { return null; }
}

async function ensureDefaultAdmin() {
  try {
    if ((await api('admin_users?limit=1').then(r=>r.json())).length === 0) {
      await api('admin_users', { method: 'POST', headers: { 'Prefer': 'return=minimal' },
        body: JSON.stringify({ username: 'admin', password: hashPw('admin123'), created_at: new Date().toISOString() }) });
    }
  } catch(e) {}
}

// ==================== Matrícula ====================
async function nextMatricula(table) {
  const r = await api(table + '?select=id');
  const data = await r.json();
  const ano = new Date().getFullYear();
  return 'PSI-' + ano + '-' + String(data.length + 1).padStart(4, '0');
}

// ==================== Schemaless INSERT ====================
async function insert(type, dados) {
  const table = type === 'criancas' ? 'criancas' : 'adultos';
  const cols = type === 'criancas' ? CRIANCA_COLS : ADULTO_COLS;
  const matricula = await nextMatricula(table);

  // CPF validation: required for adults, check duplicate
  if (type === 'adultos') {
    const cpf = (dados.cpf || '').replace(/\D/g, '');
    if (!cpf || cpf.length < 11) {
      throw { status: 400, message: 'CPF é obrigatório para inscrição de adulto.' };
    }
    const existing = await api(table + '?select=id,cpf&cpf=eq.' + encodeURIComponent(dados.cpf));
    const matches = await existing.json();
    if (matches && matches.length > 0) {
      throw { status: 409, message: 'Este CPF já está cadastrado. Cada CPF pode fazer apenas uma inscrição.' };
    }
  }

  const limpos = separarCampos(dados, cols);
  const registro = { matricula, ...limpos, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await api(table, { method: 'POST', headers: { 'Prefer': 'return=representation' }, body: JSON.stringify(registro) });
      if (r.status === 429) { await new Promise(r => setTimeout(r, 500 * (attempt+1))); continue; }
      if (!r.ok) { const txt = await r.text(); throw new Error(r.status + ': ' + txt.substring(0,300)); }
      const result = await r.json();
      if (result[0]?.id) return { id: result[0].id, matricula };
      throw new Error('Sem ID na resposta: ' + JSON.stringify(result).substring(0,200));
    } catch(e) {
      if (attempt === 2) throw e;
      await new Promise(r => setTimeout(r, 300 * (attempt+1)));
    }
  }
  throw new Error('Todas as tentativas falharam');
}

async function getAll(type) {
  const table = type === 'criancas' ? 'criancas' : 'adultos';
  // Campos essenciais (sem jsonb/dados) — evita estourar 6MB do Netlify
  // Agora 5000 sem limite de paginação
  if (type === 'criancas') {
    return await api(table + '?select=id,nome,matricula,data_nascimento,idade,cidade,uf,responsavel_nome,responsavel_telefone,serie,turno,situacao_vacinal,situacao_escolar,modalidade,turno_desejado,created_at&order=id.desc&limit=5000').then(r => r.json());
  }
  return await api(table + '?select=id,nome,matricula,data_nascimento,idade,sexo,cidade,uf,telefone,profissao,cpf,email,modalidade,turno_desejado,created_at&order=id.desc&limit=5000').then(r => r.json());
}

async function getById(type, id) {
  const table = type === 'criancas' ? 'criancas' : 'adultos';
  return (await api(table + '?id=eq.' + id + '&limit=1').then(r => r.json()))[0] || null;
}

async function update(type, id, dados) {
  const table = type === 'criancas' ? 'criancas' : 'adultos';
  const cols = type === 'criancas' ? CRIANCA_COLS : ADULTO_COLS;
  const limpos = separarCampos({...dados, updated_at: new Date().toISOString()}, cols);
  return (await api(table + '?id=eq.' + id, { method: 'PATCH', headers: { 'Prefer': 'return=minimal' }, body: JSON.stringify(limpos) })).ok;
}

async function remove(type, id) {
  const table = type === 'criancas' ? 'criancas' : 'adultos';
  return (await api(table + '?id=eq.' + id, { method: 'DELETE', headers: { 'Prefer': 'return=minimal' } })).ok;
}

async function getStats() {
  try {
    // Contagem via headers (leve, sem transferir dados)
    const [cHead, aHead] = await Promise.all([
      api('criancas?select=id&limit=1', { headers: { 'Prefer': 'count=exact' } }).then(r => r.headers.get('content-range')),
      api('adultos?select=id&limit=1', { headers: { 'Prefer': 'count=exact' } }).then(r => r.headers.get('content-range'))
    ]);
    const totalC = cHead ? parseInt(cHead.split('/')[1]) || 0 : 0;
    const totalA = aHead ? parseInt(aHead.split('/')[1]) || 0 : 0;

    // Recentes: sample dos últimos 100
    const since = new Date(Date.now() - 7*24*60*60*1000).toISOString();
    const [cRec, aRec] = await Promise.all([
      api('criancas?select=created_at&order=id.desc&limit=100&created_at=gte.' + since).then(r => r.json()),
      api('adultos?select=created_at&order=id.desc&limit=100&created_at=gte.' + since).then(r => r.json())
    ]);

    return {
      total_criancas: totalC, total_adultos: totalA, total_geral: totalC + totalA,
      recentes_criancas: cRec.length, recentes_adultos: aRec.length
    };
  } catch(e) { return { total_criancas:0, total_adultos:0, total_geral:0, recentes_criancas:0, recentes_adultos:0 }; }
}

module.exports = {
  ensureDefaultAdmin, getAdmin, hashPassword: hashPw, getStats,
  insertCrianca: d => insert('criancas', d),
  getAllCriancas: () => getAll('criancas'),
  getCriancaById: id => getById('criancas', id),
  updateCrianca: (id, d) => update('criancas', id, d),
  deleteCrianca: id => remove('criancas', id),
  insertAdulto: d => insert('adultos', d),
  getAllAdultos: () => getAll('adultos'),
  getAdultoById: id => getById('adultos', id),
  updateAdulto: (id, d) => update('adultos', id, d),
  deleteAdulto: id => remove('adultos', id),
};
