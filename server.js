/**
 * server.js — Servidor Express para Netlify Functions + dev local
 *
 * No Netlify: exportado como handler para a Netlify Function
 * Local: roda como servidor standalone na porta 3000
 *
 * Autenticação via token HMAC auto-contido (funciona em serverless)
 */

const express = require('express');
const path = require('path');
const crypto = require('crypto');

process.chdir(__dirname);

const storage = require('./storage');

const app = express();
const SESSION_SECRET = process.env.SESSION_SECRET || 'projeto-social-secret-key-2024';

// ==================== TOKENS AUTO-CONTIDOS (Serverless-safe) ====================

/**
 * Gera um token assinado: base64(data).signature
 * O servidor pode verificar a assinatura sem estado persistente.
 */
function signToken(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

function verifyToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [data, signature] = parts;
    const expected = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
    if (signature !== expected) return null;

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));

    // Expira em 4 horas
    if (Date.now() - payload.createdAt > 4 * 60 * 60 * 1000) return null;

    return payload;
  } catch {
    return null;
  }
}

// ==================== MIDDLEWARE ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function requireAdmin(req, res, next) {
  const token = req.headers['x-session-token'];
  const payload = token ? verifyToken(token) : null;
  if (!payload || !payload.isAdmin) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }
  req.adminUser = payload;
  next();
}

// Nível mínimo: admin OU coordenador
function requireCoordenador(req, res, next) {
  const token = req.headers['x-session-token'];
  const payload = token ? verifyToken(token) : null;
  if (!payload || !payload.isAdmin || (payload.nivel !== 'admin' && payload.nivel !== 'coordenador')) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }
  req.adminUser = payload;
  next();
}

// Admin master apenas
function requireMaster(req, res, next) {
  const token = req.headers['x-session-token'];
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.nivel !== 'admin') {
    return res.status(401).json({ error: 'Apenas administrador master.' });
  }
  req.adminUser = payload;
  next();
}

// ==================== AUTENTICAÇÃO ====================

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
  }

  const admin = await storage.getAdmin(username);
  if (!admin) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos' });
  }

  const hash = storage.hashPassword(password);
  if (hash !== admin.password) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos' });
  }

  const nivel = admin.nivel || 'admin';
  const token = signToken({
    isAdmin: true,
    nivel: nivel,
    username: admin.username,
    modalidade: admin.modalidade || null,
    createdAt: Date.now()
  });

  return res.json({
    success: true,
    token,
    username: admin.username,
    nivel: nivel,
    modalidade: admin.modalidade || null,
    message: 'Login realizado com sucesso!'
  });
});

app.post('/api/admin/logout', (_req, res) => {
  // Token auto-contido: logout é client-side (remover token do localStorage)
  res.json({ success: true });
});

app.get('/api/admin/check', (req, res) => {
  const token = req.headers['x-session-token'];
  const payload = token ? verifyToken(token) : null;
  if (payload && payload.isAdmin) {
    return res.json({ authenticated: true, username: payload.username, nivel: payload.nivel || 'admin', modalidade: payload.modalidade || null });
  }
  res.json({ authenticated: false });
});

// ==================== INSCRIÇÕES - CRIANÇA ====================

app.post('/api/inscricao/crianca', async (req, res) => {
  try {
    if (!req.body.nome || !req.body.data_nascimento) {
      return res.status(400).json({ error: 'Nome e Data de Nascimento são obrigatórios' });
    }
    const { id, matricula } = await storage.insertCrianca(req.body);
    if (!id) return res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
    res.status(201).json({ success: true, id, matricula, message: 'Inscrição salva com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar criança:', err.message);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Erro ao salvar inscrição' });
  }
});

app.get('/api/inscricao/crianca', requireAdmin, async (_req, res) => {
  try {
    const inscricoes = await storage.getAllCriancas();
    res.json(inscricoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar' });
  }
});

app.get('/api/inscricao/crianca/:id', requireAdmin, async (req, res) => {
  try {
    const inscricao = await storage.getCriancaById(req.params.id);
    if (!inscricao) return res.status(404).json({ error: 'Inscrição não encontrada' });
    res.json(inscricao);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar' });
  }
});

app.put('/api/inscricao/crianca/:id', requireAdmin, async (req, res) => {
  try {
    const ok = await storage.updateCrianca(req.params.id, req.body);
    if (!ok) return res.status(404).json({ error: 'Inscrição não encontrada' });
    res.json({ success: true, message: 'Inscrição atualizada!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
});

app.delete('/api/inscricao/crianca/:id', requireAdmin, async (req, res) => {
  try {
    const ok = await storage.deleteCrianca(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Inscrição não encontrada' });
    res.json({ success: true, message: 'Inscrição removida!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover' });
  }
});

// ==================== INSCRIÇÕES - ADULTO ====================

app.post('/api/inscricao/adulto', async (req, res) => {
  try {
    if (!req.body.nome || !req.body.data_nascimento) {
      return res.status(400).json({ error: 'Nome e Data de Nascimento são obrigatórios' });
    }
    const { id, matricula } = await storage.insertAdulto(req.body);
    if (!id) return res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
    res.status(201).json({ success: true, id, matricula, message: 'Inscrição salva com sucesso!' });
  } catch (err) {
    console.error('Erro ao salvar adulto:', err.message);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Erro ao salvar inscrição' });
  }
});

app.get('/api/inscricao/adulto', requireAdmin, async (_req, res) => {
  try {
    const inscricoes = await storage.getAllAdultos();
    res.json(inscricoes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar' });
  }
});

app.get('/api/inscricao/adulto/:id', requireAdmin, async (req, res) => {
  try {
    const inscricao = await storage.getAdultoById(req.params.id);
    if (!inscricao) return res.status(404).json({ error: 'Inscrição não encontrada' });
    res.json(inscricao);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar' });
  }
});

app.put('/api/inscricao/adulto/:id', requireAdmin, async (req, res) => {
  try {
    const ok = await storage.updateAdulto(req.params.id, req.body);
    if (!ok) return res.status(404).json({ error: 'Inscrição não encontrada' });
    res.json({ success: true, message: 'Inscrição atualizada!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
});

app.delete('/api/inscricao/adulto/:id', requireAdmin, async (req, res) => {
  try {
    const ok = await storage.deleteAdulto(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Inscrição não encontrada' });
    res.json({ success: true, message: 'Inscrição removida!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover' });
  }
});

// ==================== ESTATÍSTICAS ====================

app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
  try {
    const stats = await storage.getStats();
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// ==================== USUÁRIOS (admin master only) ====================

app.get('/api/admin/usuarios', requireMaster, async (req, res) => {
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/admin_users?select=id,username,nivel,modalidade,created_at&order=id.asc', {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
    });
    res.json(await r.json());
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/usuarios', requireMaster, async (req, res) => {
  try {
    const { username, password, nivel, modalidade } = req.body;
    const r = await fetch(SUPABASE_URL + '/rest/v1/admin_users', {
      method: 'POST', headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
      body: JSON.stringify({ username, password: storage.hashPassword(password), nivel: nivel||'professor', modalidade: modalidade||null, created_at: new Date().toISOString() })
    });
    const result = await r.json();
    res.status(201).json({ success: true, user: result[0] });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

app.delete('/api/admin/usuarios/:id', requireMaster, async (req, res) => {
  try {
    await fetch(SUPABASE_URL + '/rest/v1/admin_users?id=eq.' + req.params.id, {
      method: 'DELETE', headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' }
    });
    res.json({ success: true });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// ==================== API DE FALTAS ====================
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zzsnltnxonttilruiloc.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Registrar falta (requer autenticação)
app.post('/api/faltas', requireAdmin, async (req, res) => {
  try {
    const { matricula, aluno_nome, tipo, modalidade, data_falta, motivo, registrado_por } = req.body;
    if (!matricula || !aluno_nome) return res.status(400).json({ error: 'Matrícula e nome são obrigatórios' });

    const r = await fetch(SUPABASE_URL + '/rest/v1/faltas', {
      method: 'POST',
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
      body: JSON.stringify({ matricula, aluno_nome, tipo: tipo||'adulto', modalidade: modalidade||'', data_falta: data_falta||new Date().toISOString().substring(0,10), motivo: motivo||'', registrado_por: registrado_por||req.adminUser?.username||'', created_at: new Date().toISOString() })
    });
    const result = await r.json();
    res.status(201).json({ success: true, id: result[0]?.id, message: 'Falta registrada!' });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// Listar faltas (requer autenticação)
app.get('/api/faltas', requireAdmin, async (req, res) => {
  try {
    const { matricula, modalidade, data_inicio, data_fim } = req.query;
    let params = [];
    if (matricula) params.push('matricula=eq.' + encodeURIComponent(matricula));
    if (modalidade) params.push('modalidade=eq.' + encodeURIComponent(modalidade));
    if (data_inicio) params.push('data_falta=gte.' + data_inicio);
    if (data_fim) params.push('data_falta=lte.' + data_fim);
    const query = params.length ? '?' + params.join('&') + '&' : '?';
    const r = await fetch(SUPABASE_URL + '/rest/v1/faltas' + query + 'order=data_falta.desc&limit=2000', {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY }
    });
    res.json(await r.json());
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// Deletar falta
app.delete('/api/faltas/:id', requireAdmin, async (req, res) => {
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/faltas?id=eq.' + req.params.id, {
      method: 'DELETE', headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'return=minimal' }
    });
    res.json({ success: r.ok });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// ==================== BACKUP (admin only) ====================
// Usado pelo script de deploy para preservar dados entre deploys
app.get('/api/admin/backup', requireAdmin, async (_req, res) => {
  try {
    const criancas = await storage.getAllCriancas();
    const adultos = await storage.getAllAdultos();
    const admins = []; // admin users são recriados pelo ensureDefaultAdmin
    res.json({ criancas, adultos, admin_users: admins, exported_at: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao exportar backup' });
  }
});

// ==================== ROTAS HTML ====================

app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/crianca', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'crianca.html')));
app.get('/adulto', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'adulto.html')));
app.get('/admin', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

// ==================== INIT ====================

storage.ensureDefaultAdmin().catch(err => console.error('Erro ao criar admin:', err));

// ==================== EXPORT ====================

const serverless = require('serverless-http');
exports.handler = serverless(app);

// Dev local
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║   🌟 Projeto Social: Você é Incrível!       ║');
    console.log(`║   Servidor: http://localhost:${PORT}            ║`);
    console.log('║   Admin:   http://localhost:' + PORT + '/admin         ║');
    console.log('║   Login:   admin / admin123                 ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
  });
}
