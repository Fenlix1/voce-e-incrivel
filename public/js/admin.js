// admin.js — Vanilla JS, Supabase-ready, sort + modality filter
(function() {
'use strict';

var TOKEN = localStorage.getItem('_ps_tk') || '';
var TAB = 'crianca';
var DADOS = [];
var sortMode = 'none';

function api(url, method, body) {
  var h = { 'Content-Type': 'application/json' };
  if (TOKEN) h['x-session-token'] = TOKEN;
  var opts = { method: method || 'GET', headers: h };
  if (body) opts.body = JSON.stringify(body);
  return fetch(url, opts).then(function(r) { return r.json(); });
}

// ===== LOGIN =====
document.getElementById('btnLogin').addEventListener('click', function() {
  var u = document.getElementById('lu').value.trim();
  var p = document.getElementById('lp').value.trim();
  var msg = document.getElementById('loginMsg');
  if (!u || !p) { msg.style.display='block'; msg.style.background='#fee2e2'; msg.style.color='#991b1b'; msg.textContent='Preencha usuário e senha'; return; }
  api('/api/admin/login', 'POST', { username: u, password: p }).then(function(d) {
    if (d.success && d.token) { TOKEN = d.token; try { localStorage.setItem('_ps_tk', TOKEN); } catch(e) {} showDash(d.username, d.nivel, d.modalidade); }
    else { msg.style.display='block'; msg.style.background='#fee2e2'; msg.style.color='#991b1b'; msg.textContent = d.error || 'Usuário ou senha inválidos'; }
  }).catch(function() { msg.style.display='block'; msg.style.background='#fee2e2'; msg.style.color='#991b1b'; msg.textContent='Erro de conexão'; });
});
document.getElementById('lp').addEventListener('keydown', function(e) { if (e.key === 'Enter') document.getElementById('btnLogin').click(); });

var _nivel = 'admin';
var _modalidadeUser = null;

function showDash(u, nivel, modalidade) {
  _nivel = nivel || 'admin';
  _modalidadeUser = modalidade || null;
  document.getElementById('loginBox').style.display = 'none';
  document.getElementById('dashBox').style.display = 'block';
  var label = u;
  if (_nivel === 'professor') label += ' 🟢 Professor';
  else if (_nivel === 'coordenador') label += ' 🟡 Coordenador';
  else label += ' 🔴 Admin';
  document.getElementById('adName').innerHTML = '&#128075; ' + label;
  aplicarNivelAcesso();
  loadStats(); loadData();
  preloadReports();
}

function preloadReports() {
  Promise.all([
    api('/api/inscricao/crianca').catch(function(){return[];}),
    api('/api/inscricao/adulto').catch(function(){return[];})
  ]).then(function(results) {
    RD.criancas = Array.isArray(results[0]) ? results[0] : [];
    RD.adultos = Array.isArray(results[1]) ? results[1] : [];
    atualizarModTurma();
    atualizarPesquisaMod();
  });
}

document.getElementById('btnSair').addEventListener('click', function(e) {
  e.preventDefault(); TOKEN = ''; try { localStorage.removeItem('_ps_tk'); } catch(e) {}
  document.getElementById('loginBox').style.display = 'block';
  document.getElementById('dashBox').style.display = 'none';
});

function aplicarNivelAcesso() {
  // Professor: só vê Faltas
  if (_nivel === 'professor') {
    document.getElementById('btC').style.display = 'none';
    document.getElementById('btA').style.display = 'none';
    document.getElementById('btR').style.display = 'none';
    document.getElementById('btU').style.display = 'none';
    document.getElementById('dvTabela').style.display = 'none';
  }
  // Admin master: vê aba Usuários
  if (_nivel === 'admin') {
    document.getElementById('btU').style.display = 'inline';
  }
  // Coordenador: não pode excluir
  if (_nivel === 'coordenador') {
    document.getElementById('tb').setAttribute('data-nivel', 'coordenador');
  }
}

// ===== STATS =====
function loadStats() {
  api('/api/admin/stats').then(function(s) {
    document.getElementById('sC').textContent = s.total_criancas||0;
    document.getElementById('sA').textContent = s.total_adultos||0;
    document.getElementById('sT').textContent = s.total_geral||0;
    document.getElementById('sR').textContent = (s.recentes_criancas||0)+(s.recentes_adultos||0);
  }).catch(function(){});
}

// ===== LOAD =====
function loadData() {
  api('/api/inscricao/' + TAB).then(function(d) {
    DADOS = Array.isArray(d) ? d : [];
    atualizarListaModalidades();
    aplicarFiltros();
  }).catch(function() { DADOS = []; renderTable([]); });
}

// ===== TABS =====
document.getElementById('btC').addEventListener('click', function() { switchTab('crianca'); });
document.getElementById('btA').addEventListener('click', function() { switchTab('adulto'); });
document.getElementById('btR').addEventListener('click', function() { switchTab('relatorios'); });
document.getElementById('btF').addEventListener('click', function() { switchTab('faltas'); });
document.getElementById('btU').addEventListener('click', function() { switchTab('usuarios'); });

function switchTab(t) {
  TAB = t;
  sortMode = 'none';
  ['btC','btA','btR','btF','btU'].forEach(function(id) {
    var b = document.getElementById(id);
    var active = (id === 'bt' + t.substring(0,1).toUpperCase() + t.substring(1,2)) || (id === 'btF' && t === 'faltas');
    if (active) { b.style.background='white'; b.style.color='#5a1e99'; b.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'; }
    else { b.style.background='transparent'; b.style.color='#5e5e7a'; b.style.boxShadow='none'; }
  });
  document.getElementById('dvTabela').style.display = (t==='relatorios'||t==='faltas'||t==='usuarios')?'none':'block';
  document.getElementById('dvRelatorios').style.display = (t==='relatorios')?'block':'none';
  document.getElementById('dvFaltas').style.display = (t==='faltas')?'block':'none';
  document.getElementById('dvUsuarios').style.display = (t==='usuarios')?'block':'none';
  if (t === 'relatorios') loadReports();
  else if (t === 'faltas') carregarFaltas();
  else if (t === 'usuarios') carregarUsuarios();
  else loadData();
}

// ===== SORT & MODALITY =====
document.getElementById('btnSortNome').addEventListener('click', function() {
  sortMode = (sortMode === 'nome') ? 'none' : 'nome';
  this.style.background = (sortMode==='nome')?'#ede9fe':'';
  document.getElementById('btnSortIdade').style.background = '';
  aplicarFiltros();
});
document.getElementById('btnSortIdade').addEventListener('click', function() {
  sortMode = (sortMode === 'idade') ? 'none' : 'idade';
  this.style.background = (sortMode==='idade')?'#ede9fe':'';
  document.getElementById('btnSortNome').style.background = '';
  aplicarFiltros();
});

window.filtrarPorModalidade = function() { aplicarFiltros(); };

function atualizarListaModalidades() {
  var sel = document.getElementById('filtroModalidade');
  if (!sel) return;
  var mods = {};
  DADOS.forEach(function(d) {
    var m = d.modalidade;
    if (typeof m === 'string') m = m.split(',').map(function(s){return s.trim();});
    if (Array.isArray(m)) m.forEach(function(x){if(x) mods[x]=(mods[x]||0)+1;});
  });
  var prevVal = sel.value;
  sel.innerHTML = '<option value="">🏅 Todas as modalidades (' + DADOS.length + ')</option>';
  Object.keys(mods).sort().forEach(function(m) {
    sel.innerHTML += '<option value="' + esc(m) + '">' + esc(m) + ' (' + mods[m] + ')</option>';
  });
  sel.value = prevVal;
}

function aplicarFiltros() {
  var modFiltro = document.getElementById('filtroModalidade')?.value || '';
  var busca = (document.getElementById('busca')?.value || '').toLowerCase().trim();
  var data = DADOS;

  // Busca por nome ou matrícula
  if (busca) {
    data = data.filter(function(d) {
      var nome = (d.nome||'').toLowerCase();
      var mat = (d.matricula||'').toLowerCase();
      return nome.indexOf(busca) !== -1 || mat.indexOf(busca) !== -1;
    });
  }

  if (modFiltro) {
    data = data.filter(function(d) {
      var m = d.modalidade;
      if (typeof m === 'string') m = m.split(',').map(function(s){return s.trim();});
      return Array.isArray(m) && m.indexOf(modFiltro) !== -1;
    });
  }
  if (sortMode === 'nome') {
    data = data.slice().sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
  } else if (sortMode === 'idade') {
    data = data.slice().sort(function(a,b) {
      function parseIdade(ds){ if(!ds) return 999; var p=ds.split('-'); if(p.length<3) return 999; var birth=new Date(Number(p[0]),Number(p[1])-1,Number(p[2])); var now=new Date(); var age=now.getFullYear()-birth.getFullYear(); var m=now.getMonth()-birth.getMonth(); if(m<0||(m===0&&now.getDate()<birth.getDate())) age--; return age; }
      return parseIdade(a.data_nascimento) - parseIdade(b.data_nascimento);
    });
  }
  renderTable(data);
}

function aplicarFiltrosReturn() {
  var modFiltro = document.getElementById('filtroModalidade')?.value || '';
  var data = DADOS;
  if (modFiltro) {
    data = data.filter(function(d) {
      var m = d.modalidade; if (typeof m === 'string') m = m.split(',').map(function(s){return s.trim();});
      return Array.isArray(m) && m.indexOf(modFiltro) !== -1;
    });
  }
  if (sortMode === 'nome') data = data.slice().sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
  else if (sortMode === 'idade') {
    data = data.slice().sort(function(a,b) {
      function parseIdade(ds){ if(!ds) return 999; var p=ds.split('-'); if(p.length<3) return 999; var birth=new Date(Number(p[0]),Number(p[1])-1,Number(p[2])); var now=new Date(); var age=now.getFullYear()-birth.getFullYear(); var m=now.getMonth()-birth.getMonth(); if(m<0||(m===0&&now.getDate()<birth.getDate())) age--; return age; }
      return parseIdade(a.data_nascimento) - parseIdade(b.data_nascimento);
    });
  }
  return data;
}

// ===== HELPERS =====
function esc(s) {
  if (s === undefined || s === null) return '';
  if (typeof s === 'object') s = JSON.stringify(s);
  var d = document.createElement('div'); d.textContent = String(s); return d.innerHTML;
}
function escAttr(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function fd(s) { if (!s) return '-'; try { var d=new Date(s); if(!isNaN(d.getTime())) return d.toLocaleDateString('pt-BR'); } catch(e){} return String(s).substring(0,10); }

// ===== RENDER TABLE =====
function renderTable(dados) {
  document.getElementById('cnt').textContent = dados.length;
  document.getElementById('th').innerHTML = '<tr><th>Matrícula</th><th>Nome</th><th>Data Nasc.</th><th>Cidade/UF</th><th>Telefone</th><th>Cadastro</th><th>Ações</th></tr>';
  if (!dados || dados.length === 0) {
    document.getElementById('tb').innerHTML = '<tr><td colspan="7" style="text-align:center;padding:30px;color:#999">Nenhum registro</td></tr>'; return;
  }
  var html = '';
  for (var i=0; i<dados.length; i++) {
    var x = dados[i];
    html += '<tr>';
    html += '<td><span class="tag">' + esc(x.matricula||'-') + '</span></td>';
    html += '<td><strong>' + esc(x.nome) + '</strong></td>';
    html += '<td>' + fd(x.data_nascimento) + '</td>';
    html += '<td>' + esc(x.cidade||'-') + (x.uf?'/'+x.uf:'') + '</td>';
    html += '<td>' + esc(x.telefone||x.responsavel_telefone||'-') + '</td>';
    html += '<td>' + fd(x.created_at) + '</td>';
    html += '<td><button class="btn btn-outline btn-sm" data-action="view" data-type="' + TAB + '" data-id="' + escAttr(x.id) + '">👁️</button> ';
    html += '<button class="btn btn-outline btn-sm" data-action="edit" data-type="' + TAB + '" data-id="' + escAttr(x.id) + '">✏️</button> ';
    html += '<button class="btn btn-outline btn-sm" data-action="print" data-type="' + TAB + '" data-id="' + escAttr(x.id) + '">🖨️</button> ';
    html += '<button class="btn btn-outline btn-sm" data-action="del" data-type="' + TAB + '" data-id="' + escAttr(x.id) + '">🗑️</button></td></tr>';
  }
  document.getElementById('tb').innerHTML = html;
}

// ===== TABLE CLICKS =====
document.getElementById('tb').addEventListener('click', function(e) {
  var btn = e.target.closest('button');
  if (!btn) return;
  var action = btn.getAttribute('data-action');
  var tipo = btn.getAttribute('data-type');
  var id = Number(btn.getAttribute('data-id'));
  if (action === 'view') openDetail(tipo, id);
  else if (action === 'edit') openEdit(tipo, id);
  else if (action === 'print') printFicha(tipo, id);
  else if (action === 'del') confirmDelete(tipo, id);
});

// ===== SEARCH =====
document.getElementById('busca').addEventListener('input', function() { aplicarFiltros(); });

// Botão Buscar e Enter
document.getElementById('btnBuscar').addEventListener('click', function() { aplicarFiltros(); });
window.buscarAvancado = function() { aplicarFiltros(); };

// Botão Salvar PDF da tabela atual
document.getElementById('btnSalvarPDF').addEventListener('click', function() {
  var dados = aplicarFiltrosReturn();
  if (!dados || dados.length === 0) { alert('Nenhum dado para salvar.'); return; }
  var tipoTxt = TAB === 'crianca' ? 'Crianças' : 'Adultos';
  var w = window.open('about:blank', '_blank', 'width=850,height=700');
  var now = new Date().toLocaleDateString('pt-BR');
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Busca — '+tipoTxt+'</title>'+
    '<style>'+
    '*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
    'html,body{font-family:Arial,sans-serif;margin:0;padding:8px 6px;color:#222;overflow:visible!important;height:auto!important}'+
    'h1{text-align:center;color:#5a1e99;margin:0 0 2px 0;font-size:1.1rem}'+
    'h2{text-align:center;color:#7b2ff7;margin:0 0 4px 0;font-size:0.9rem}'+
    '.bar{background:linear-gradient(135deg,#e94560,#7b2ff7,#3b82f6);height:2px;margin-bottom:8px;border-radius:3px}'+
    '.no-print{display:block}'+
    'table{width:100%;border-collapse:collapse;font-size:0.55rem}'+
    'thead{display:table-header-group!important}'+
    'tr{page-break-inside:auto;page-break-after:auto}'+
    'th{background:#e2e4ea!important;padding:1px 3px;text-align:left;border-bottom:1px solid #ccc;font-size:0.52rem;font-weight:700}'+
    'td{padding:0px 3px;border-bottom:1px solid #f0f0f0;font-size:0.52rem;line-height:1.15}'+
    '@media print{'+
    '  html,body{height:auto!important;overflow:visible!important;min-height:0!important;max-height:none!important}'+
    '  .no-print{display:none!important}'+
    '  @page{margin:0.5cm;size:A4 landscape}'+
    '}'+
    '</style></head><body>'+
    '<div class="bar"></div><h1>🌟 Projeto Social: Você é Incrível!</h1>'+
    '<h2>Resultado — '+tipoTxt+'</h2><p style="text-align:center;color:#999">'+dados.length+' registro(s) | '+now+'</p>'+
    '<p class="no-print" style="text-align:center"><button onclick="window.print()" style="background:#e94560;color:white;border:none;padding:8px 20px;border-radius:20px;font-size:0.9rem;cursor:pointer;font-weight:600;margin-bottom:8px">🖨️ Salvar PDF</button></p>'+
    '<table><thead><tr><th>#</th><th>Matrícula</th><th>Nome</th><th>Data Nasc.</th><th>Cidade/UF</th><th>Tel</th><th>Modalidade</th><th>Horário</th><th>Cadastro</th></tr></thead><tbody>';
  dados.forEach(function(d, idx) {
    html += '<tr><td>'+(idx+1)+'</td><td>'+esc(d.matricula||'-')+'</td><td><strong>'+esc(d.nome)+'</strong></td><td>'+fd(d.data_nascimento)+'</td><td>'+esc(d.cidade||'-')+(d.uf?'/'+d.uf:'')+'</td><td>'+esc((d.telefone||d.responsavel_telefone||'-').substring(0,15))+'</td><td>'+esc(d.modalidade||'-')+'</td><td>'+esc(d.horario||d.turno_desejado||'-')+'</td><td>'+fd(d.created_at)+'</td></tr>';
  });
  html += '</tbody></table><p class="no-print" style="text-align:center;color:#999;font-size:0.7rem;margin-top:12px">Impresso em: '+now+'</p></body></html>';
  w.document.write(html); w.document.close();
});

// Botões A-Z
document.getElementById('btnImprimirAdultosAZ').addEventListener('click', function() {
  var dados = RD.adultos.slice().sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
  imprimirListaAZ('👤 Adultos — Ordem Alfabética', dados);
});
document.getElementById('btnImprimirCriancasAZ').addEventListener('click', function() {
  var dados = RD.criancas.slice().sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
  imprimirListaAZ('🧒 Crianças — Ordem Alfabética', dados);
});
document.getElementById('btnImprimirTodosAZ').addEventListener('click', function() {
  var dados = (RD.criancas.concat(RD.adultos)).slice().sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
  imprimirListaAZ('📋 Todos — Ordem Alfabética', dados);
});

// IMPRIMIR TODOS ALUNOS (com telefone + endereço)
document.getElementById('btnImprimirTodosContato').addEventListener('click', function() {
  var dados = (RD.criancas.concat(RD.adultos)).slice().sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
  imprimirTodosContato(dados);
});
document.getElementById('btnImprimirAdultosContato').addEventListener('click', function() {
  imprimirTodosContato(RD.adultos.slice().sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); }));
});
document.getElementById('btnImprimirCriancasContato').addEventListener('click', function() {
  imprimirTodosContato(RD.criancas.slice().sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); }));
});

function imprimirTodosContato(dados) {
  if (!dados || dados.length === 0) { alert('Nenhum dado disponível. Carregue os relatórios primeiro.'); return; }
  var w = window.open('about:blank', '_blank', 'width=900,height=700');
  var now = new Date().toLocaleDateString('pt-BR');
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Lista de Contatos</title>'+
    '<style>'+
    '*{box-sizing:border-box}'+
    'html,body{font-family:Arial,sans-serif;margin:0;padding:8px 6px;color:#222;overflow:visible!important;height:auto!important}'+
    'h1{text-align:center;color:#5a1e99;margin:0 0 2px 0;font-size:1.1rem}'+
    'h2{text-align:center;color:#7b2ff7;margin:0 0 4px 0;font-size:0.9rem}'+
    '.bar{background:linear-gradient(135deg,#e94560,#7b2ff7,#3b82f6);height:2px;margin-bottom:8px;border-radius:3px}'+
    '.no-print{display:block}'+
    'table{width:100%;border-collapse:collapse;font-size:0.58rem}'+
    'thead{display:table-header-group!important}'+
    'tr{page-break-inside:auto;page-break-after:auto}'+
    'th{background:#e2e4ea!important;padding:1px 3px!important;text-align:left;border-bottom:1px solid #ccc;font-size:0.52rem;font-weight:700;-webkit-print-color-adjust:exact}'+
    'td{padding:0px 3px!important;border-bottom:1px solid #f0f0f0;font-size:0.52rem;line-height:1.15}'+
    '.child td{background:#fffef5}.adult td{background:#faf8ff}'+
    '@media print{'+
    '  html,body{height:auto!important;overflow:visible!important;min-height:0!important;max-height:none!important}'+
    '  .no-print{display:none!important}'+
    '}'+
    '</style></head><body>'+
    '<div class="bar"></div><h1>🌟 Projeto Social: Você é Incrível!</h1>'+
    '<h2>📋 Lista de Contatos — '+dados.length+' aluno(s)</h2><p style="text-align:center;color:#999">'+now+'</p>'+
    '<p class="no-print" style="text-align:center"><button onclick="window.print()" style="background:#e94560;color:white;border:none;padding:10px 28px;border-radius:25px;font-size:1rem;cursor:pointer;font-weight:600;margin-bottom:16px">🖨️ Salvar PDF</button></p>'+
    '<table><thead><tr><th>#</th><th>Nome</th><th>Telefone</th><th>Endereço</th><th>Bairro</th><th>Cidade/UF</th><th>Modalidade</th></tr></thead><tbody>';
  dados.forEach(function(d, idx) {
    var isAdulto = !!(d.profissao || d.cpf || d.sexo);
    var cls = isAdulto ? 'adult' : 'child';
    var telefone = d.telefone || d.responsavel_telefone || '-';
    var endereco = d.endereco || '-';
    if (d.numero) endereco += ', ' + d.numero;
    html += '<tr class="'+cls+'"><td>'+(idx+1)+'</td><td><strong>'+esc(d.nome)+'</strong></td><td>'+esc(telefone)+'</td><td>'+esc(endereco)+'</td><td>'+esc(d.bairro||'-')+'</td><td>'+esc(d.cidade||'-')+(d.uf?'/'+d.uf:'')+'</td><td>'+esc(d.modalidade||'-')+'</td></tr>';
  });
  html += '</tbody></table><p class="no-print" style="text-align:center;color:#999;font-size:0.75rem;margin-top:20px">Impresso em: '+now+' | Projeto Social: Você é Incrível!</p></body></html>';
  w.document.write(html); w.document.close();
}

// ANIVERSARIANTES DO MÊS
function verificarAniversariantes() {
  var all = (RD.criancas||[]).concat(RD.adultos||[]);
  var mesAtual = new Date().getMonth();
  var diaAtual = new Date().getDate();
  var aniversariantesMes = [];
  var aniversariantesHoje = [];
  all.forEach(function(d) {
    if (!d.data_nascimento) return;
    var p = d.data_nascimento.split('-');
    if (p.length < 3) return;
    var mes = Number(p[1]) - 1;
    var dia = Number(p[2]);
    var isAdulto = !!(d.profissao || d.cpf || d.sexo);
    var telefone = d.telefone || d.responsavel_telefone || '-';
    if (mes === mesAtual) {
      aniversariantesMes.push({ nome: d.nome, dia: dia, telefone: telefone, modalidade: d.modalidade||'-', tipo: isAdulto?'Adulto':'Criança' });
      if (dia === diaAtual) {
        aniversariantesHoje.push({ nome: d.nome, telefone: telefone, modalidade: d.modalidade||'-' });
      }
    }
  });
  aniversariantesMes.sort(function(a,b){ return a.dia - b.dia; });
  renderizarAniversariantes(aniversariantesMes, aniversariantesHoje);
}

function renderizarAniversariantes(mes, hoje) {
  var container = document.getElementById('listaAniversariantes');
  if (!container) return;
  var html = '';
  if (hoje.length > 0) {
    html += '<div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:10px;padding:14px;margin-bottom:16px">';
    html += '<h4 style="color:#92400e;margin-bottom:8px">🎂 Aniversariantes de HOJE ('+hoje.length+')</h4>';
    hoje.forEach(function(a) {
      var msg = encodeURIComponent('Olá '+a.nome+'! 🎉🎂\n\nO Projeto Social: Você é Incrível! deseja um Feliz Aniversário!\nQue esse novo ano seja repleto de saúde, amor e muitas conquistas! 💪🌟\n\n venha celebrar com a gente! 🏅');
      html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px;border-bottom:1px solid #fde68a;font-size:0.9rem">'+
        '<div><strong>'+esc(a.nome)+'</strong> — '+esc(a.modalidade)+'</div>'+
        '<a href="https://wa.me/55'+a.telefone.replace(/\D/g,'')+'?text='+msg+'" target="_blank" style="background:#25D366;color:white;padding:6px 14px;border-radius:20px;text-decoration:none;font-weight:600;font-size:0.8rem">📱 Enviar Parabéns</a>'+
        '</div>';
    });
    html += '</div>';
  }
  if (mes.length > 0) {
    html += '<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:14px">';
    html += '<h4 style="color:#166534;margin-bottom:8px">📅 Aniversariantes do Mês ('+mes.length+')</h4>';
    html += '<table style="width:100%;border-collapse:collapse;font-size:0.85rem">';
    html += '<tr style="background:#dcfce7"><th style="padding:6px;text-align:left">Dia</th><th style="padding:6px;text-align:left">Nome</th><th style="padding:6px;text-align:left">Tipo</th><th style="padding:6px;text-align:left">Telefone</th><th style="padding:6px;text-align:left">Ação</th></tr>';
    mes.forEach(function(a) {
      var msg = encodeURIComponent('Olá '+a.nome+'! 🎉🎂\n\nO Projeto Social: Você é Incrível! deseja um Feliz Aniversário!\nQue esse novo ano seja repleto de saúde, amor e muitas conquistas! 💪🌟\n\n venha celebrar com a gente! 🏅');
      html += '<tr><td style="padding:4px 6px;font-weight:700;color:#166534">'+a.dia+'</td>'+
        '<td style="padding:4px 6px"><strong>'+esc(a.nome)+'</strong></td>'+
        '<td style="padding:4px 6px">'+esc(a.tipo)+'</td>'+
        '<td style="padding:4px 6px">'+esc(a.telefone)+'</td>'+
        '<td style="padding:4px 6px"><a href="https://wa.me/55'+a.telefone.replace(/\D/g,'')+'?text='+msg+'" target="_blank" style="background:#25D366;color:white;padding:4px 10px;border-radius:14px;text-decoration:none;font-size:0.75rem;font-weight:600">📱 WhatsApp</a></td></tr>';
    });
    html += '</table></div>';
  }
  if (mes.length === 0 && hoje.length === 0) {
    html = '<p style="text-align:center;color:#999;padding:20px">Nenhum aniversariante este mês.</p>';
  }
  container.innerHTML = html;
}

document.getElementById('btnVerificarAniversariantes').addEventListener('click', verificarAniversariantes);

// Enviar parabéns em massa (todos aniversariantes do mês)
document.getElementById('btnEnviarParabensMassa').addEventListener('click', function() {
  var all = (RD.criancas||[]).concat(RD.adultos||[]);
  var mesAtual = new Date().getMonth();
  var aniversariantes = [];
  all.forEach(function(d) {
    if (!d.data_nascimento) return;
    var p = d.data_nascimento.split('-');
    if (p.length < 3) return;
    var mes = Number(p[1]) - 1;
    var dia = Number(p[2]);
    var isAdulto = !!(d.profissao || d.cpf || d.sexo);
    var telefone = d.telefone || d.responsavel_telefone || '';
    if (mes === mesAtual && telefone && telefone !== '-') {
      aniversariantes.push({ nome: d.nome, telefone: telefone.replace(/\D/g,'') });
    }
  });
  if (aniversariantes.length === 0) {
    alert('Nenhum aniversariante com telefone este mês.');
    return;
  }
  var msg = 'Olá [NOME]! 🎉🎂\n\nO Projeto Social: Você é Incrível! deseja um Feliz Aniversário!\nQue esse novo ano seja repleto de saúde, amor e muitas conquistas! 💪🌟\n\n venha celebrar com a gente! 🏅';
  var lista = aniversariantes.map(function(a) {
    return a.nome + ' → wa.me/55' + a.telefone;
  }).join('\n');
  var confirmar = confirm('Enviar parabéns via WhatsApp para ' + aniversariantes.length + ' aniversariante(s)?\n\n' + lista);
  if (confirmar) {
    aniversariantes.forEach(function(a, i) {
      setTimeout(function() {
        var texto = msg.replace('[NOME]', a.nome);
        var link = 'https://wa.me/55' + a.telefone + '?text=' + encodeURIComponent(texto);
        window.open(link, '_blank');
      }, i * 2000);
    });
  }
});

// IMPRIMIR POR TURMA (modalidade + horário)
// Popula dropdown de modalidades na aba relatórios
function atualizarModTurma() {
  var sel = document.getElementById('filtroModalidadeTurma');
  if (!sel) return;
  var tipo = document.getElementById('filtroTipoTurma')?.value || '';
  var all = [];
  if (tipo === 'crianca') all = (RD.criancas||[]).slice();
  else if (tipo === 'adulto') all = (RD.adultos||[]).slice();
  else all = (RD.criancas||[]).concat(RD.adultos||[]);
  var mods = {};
  all.forEach(function(d) { var m = d.modalidade; if (m) mods[m] = (mods[m]||0)+1; });
  sel.innerHTML = '<option value="">Todas Modalidades</option>';
  Object.keys(mods).sort().forEach(function(m) { sel.innerHTML += '<option value="'+esc(m)+'">'+esc(m)+' ('+mods[m]+')</option>'; });
}
document.getElementById('btnImprimirTurma').addEventListener('click', function() {
  var tipo = document.getElementById('filtroTipoTurma').value;
  var mod = document.getElementById('filtroModalidadeTurma').value;
  var hora = document.getElementById('filtroHorarioTurma').value;
  var all = [];
  if (tipo === 'crianca') all = (RD.criancas||[]).slice();
  else if (tipo === 'adulto') all = (RD.adultos||[]).slice();
  else all = (RD.criancas||[]).concat(RD.adultos||[]);
  if (!all || all.length === 0) { alert('Carregue os relatórios primeiro: clique na aba 📊 Relatórios.'); return; }
  if (mod) all = all.filter(function(d){ return d.modalidade === mod; });
  if (hora) all = all.filter(function(d){ return (d.horario||d.turno_desejado||'') === hora; });
  if (all.length === 0) { alert('Nenhum aluno encontrado com os filtros: ' + (tipo||'todos') + (mod?' - '+mod:'') + (hora?' - '+hora:'')); return; }
  all.sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
  var label = (tipo==='crianca'?'🧒 Crianças':tipo==='adulto'?'👤 Adultos':'Todos');
  if (mod) label += ' — ' + mod;
  if (hora) label += ' — ' + hora;
  imprimirListaAZ('🏅 ' + label, all);
});

// Atualiza dropdown de horários quando muda modalidade ou tipo na impressão
function atualizarHorariosTurma() {
  var tipo = document.getElementById('filtroTipoTurma').value;
  var mod = document.getElementById('filtroModalidadeTurma').value;
  var horaSel = document.getElementById('filtroHorarioTurma');
  var all = [];
  if (tipo === 'crianca') all = (RD.criancas||[]).slice();
  else if (tipo === 'adulto') all = (RD.adultos||[]).slice();
  else all = (RD.criancas||[]).concat(RD.adultos||[]);
  var filtrados = mod ? all.filter(function(d){ return d.modalidade === mod; }) : all;
  var horas = {};
  filtrados.forEach(function(d){ var h = d.horario||d.turno_desejado; if(h) horas[h]=(horas[h]||0)+1; });
  horaSel.innerHTML = '<option value="">Todos Horários</option>';
  Object.keys(horas).sort().forEach(function(h){ horaSel.innerHTML += '<option value="'+h+'">'+h+' ('+horas[h]+')</option>'; });
}
document.getElementById('filtroModalidadeTurma').addEventListener('change', atualizarHorariosTurma);
document.getElementById('filtroTipoTurma').addEventListener('change', function() {
  atualizarModTurma();
  atualizarHorariosTurma();
});

function imprimirListaAZ(titulo, dados) {
  if (!dados || dados.length === 0) { alert('Nenhum dado disponível. Carregue os relatórios primeiro.'); return; }
  var w = window.open('about:blank', '_blank', 'width=850,height=700');
  var now = new Date().toLocaleDateString('pt-BR');
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+titulo+'</title>'+
    '<style>'+
    '*{box-sizing:border-box}'+
    'html,body{font-family:Arial,sans-serif;margin:0;padding:8px 6px;color:#222;overflow:visible!important;height:auto!important}'+
    'h1{text-align:center;color:#5a1e99;margin:0 0 2px 0;font-size:1.1rem}'+
    'h2{text-align:center;color:#7b2ff7;margin:0 0 4px 0;font-size:0.9rem}'+
    '.bar{background:linear-gradient(135deg,#e94560,#7b2ff7,#3b82f6);height:2px;margin-bottom:8px;border-radius:3px}'+
    '.no-print{display:block}'+
    'table{width:100%;border-collapse:collapse;font-size:0.55rem}'+
    'thead{display:table-header-group!important}'+
    'tr{page-break-inside:auto;page-break-after:auto}'+
    'th{background:#e2e4ea!important;padding:1px 3px!important;text-align:left;border-bottom:1px solid #ccc;font-size:0.52rem;font-weight:700;-webkit-print-color-adjust:exact}'+
    'td{padding:0px 3px!important;border-bottom:1px solid #f0f0f0;font-size:0.52rem;line-height:1.15}'+
    '.child td{background:#fffef5}.adult td{background:#faf8ff}'+
    '@media print{'+
    '  html,body{height:auto!important;overflow:visible!important;min-height:0!important;max-height:none!important}'+
    '  .no-print{display:none!important}'+
    '}'+
    '</style></head><body>'+
    '<div class="bar"></div><h1>🌟 Projeto Social: Você é Incrível!</h1>'+
    '<h2>'+titulo+'</h2><p style="text-align:center;color:#999">'+dados.length+' ficha(s) | '+now+'</p>'+
    '<p class="no-print" style="text-align:center"><button onclick="window.print()" style="background:#e94560;color:white;border:none;padding:10px 28px;border-radius:25px;font-size:1rem;cursor:pointer;font-weight:600;margin-bottom:16px">🖨️ Salvar PDF</button></p>'+
    '<table><thead><tr><th>#</th><th>Matrícula</th><th>Nome</th><th>Data Nasc.</th><th>Cidade/UF</th><th>Telefone</th><th>Modalidade</th><th>Horário</th><th>Cadastro</th></tr></thead><tbody>';
  dados.forEach(function(d, idx) {
    var isAdulto = !!(d.profissao || d.cpf || d.sexo);
    var cls = isAdulto ? 'adult' : 'child';
    var telefone = isAdulto ? (d.telefone || '-') : (d.responsavel_telefone || '-');
    html += '<tr class="'+cls+'"><td>'+(idx+1)+'</td><td>'+esc(d.matricula||'-')+'</td><td><strong>'+esc(d.nome)+'</strong></td><td>'+fd(d.data_nascimento)+'</td><td>'+esc(d.cidade||'-')+(d.uf?'/'+d.uf:'')+'</td><td>'+esc(telefone)+'</td><td>'+esc(d.modalidade||'-')+'</td><td>'+esc(d.horario||d.turno_desejado||'-')+'</td><td>'+fd(d.created_at)+'</td></tr>';
  });
  html += '</tbody></table><p class="no-print" style="text-align:center;color:#999;font-size:0.75rem;margin-top:20px">Impresso em: '+now+' | Projeto Social: Você é Incrível!</p></body></html>';
  w.document.write(html); w.document.close();
}

document.getElementById('btnLimparBusca').addEventListener('click', function() {
  document.getElementById('busca').value = '';
  sortMode = 'none';
  document.getElementById('btnSortNome').style.background = '';
  document.getElementById('btnSortIdade').style.background = '';
  document.getElementById('filtroModalidade').value = '';
  aplicarFiltros();
});

document.getElementById('btnAtualizar').addEventListener('click', loadData);

// ===== VIEW DETAIL =====
function openDetail(tipo, id) {
  api('/api/inscricao/' + tipo + '/' + id).then(function(d) {
    document.getElementById('mdDetTit').textContent = 'Matrícula: ' + (d.matricula||'-') + ' — ' + (tipo==='crianca'?'Criança':'Adulto');
    var html = '';
    Object.keys(d).forEach(function(k) {
      var v = d[k];
      if (v !== undefined && v !== null && v !== '' && v !== 0 && v !== '0' && !String(v).startsWith('data:image')) {
        html += '<div style="display:flex;padding:4px 0;border-bottom:1px solid #f0f0f5;font-size:0.84rem"><span style="font-weight:600;min-width:155px;color:#5a1e99">' + esc(k) + ':</span><span>' + esc(String(v).substring(0,200)) + '</span></div>';
      }
    });
    document.getElementById('mdDetCon').innerHTML = html || '<p>Nenhum dado</p>';
    document.getElementById('mdDetalhe').classList.add('show');
  });
}

// ===== EDIT (todos os campos, menos matrícula) =====
var EDIT_ID = null, EDIT_TIPO = null, DEL_ID = null, DEL_TIPO = null;
var CAMPOS_CRIANCA = ['nome','data_nascimento','idade','peso_aproximado','estatura_aproximada','data_ultima_avaliacao_medica','responsavel_nome','responsavel_parentesco','responsavel_cpf','responsavel_telefone','responsavel_email','endereco','numero','bairro','cidade','uf','cep','situacao_escolar','serie','turno','nome_unidade_escolar','modalidade','turno_desejado','intervencao_cirurgica','situacao_vacinal','situacao_vacinal_irregular_especifique','medicamentos_ultimos_tempos','tem_alergia','tratamento_saude','tratamento_saude_especifique','uso_medicamento_constante','uso_medicamento_especifique','problema_especifique','condicoes_saude_especifique','responsavel_acompanhamento','responsavel_acompanhamento_outros','problema_impossibilita_atividade_fisica','problema_impossibilita_especifique','teve_hepatite','possui_convenio_medico','convenio_medico_qual','obs'];
var CAMPOS_ADULTO = ['nome','profissao','composicao_familiar','data_nascimento','idade','sexo','cpf','rg','orgao_emissor','filiacao_pai','filiacao_mae','telefone','email','peso','altura','endereco','numero','bairro','cidade','uf','cep','modalidade','turno_desejado','possui_deficiencia','possui_deficiencia_descricao','ja_frequentou_modalidade','ja_frequentou_tempo','pratica_atividade_fisica','pratica_atividade_qual','pratica_atividade_frequencia','condicao_fisica_saude','problema_muscular_etc','problema_muscular_qual','antecedentes_familiares','usa_medicamento','usa_medicamento_qual','usa_medicamento_motivo','faz_tratamento','faz_tratamento_outros_qual','horas_sono','etilismo','tabagismo','refeicoes_por_dia','objetivo_peso','obs'];

function openEdit(tipo, id) {
  EDIT_TIPO = tipo; EDIT_ID = id;
  api('/api/inscricao/' + tipo + '/' + id).then(function(d) {
    document.getElementById('mdEdTit').textContent = '✏️ Editar — Matrícula: ' + (d.matricula||'-');
    var campos = (tipo==='crianca') ? CAMPOS_CRIANCA : CAMPOS_ADULTO;
    var html = '<div class="form-group"><label>🔒 Matrícula (bloqueada)</label><input type="text" value="' + esc(d.matricula||'-') + '" readonly style="background:#f0f0f5;color:#666"></div><hr style="margin:14px 0;border-color:#e2e4ea">';
    for (var i=0; i<campos.length; i++) {
      var f = campos[i];
      var v = (d[f] !== undefined && d[f] !== null) ? String(d[f]) : '';
      html += '<div class="form-group"><label>' + esc(f) + '</label>';
      if (f.indexOf('data_')===0 || f==='data_nascimento' || f==='data_ultima_avaliacao_medica') html += '<input type="date" name="' + f + '" value="' + esc(v.substring(0,10)) + '">';
      else if (f==='obs') html += '<textarea name="' + f + '" rows="2">' + esc(v) + '</textarea>';
      else html += '<input type="text" name="' + f + '" value="' + esc(v) + '">';
      html += '</div>';
    }
    document.getElementById('mdEdCampos').innerHTML = html;
    document.getElementById('mdEdMsg').style.display = 'none';
    document.getElementById('mdEditar').classList.add('show');
  });
}

document.getElementById('btnNova').addEventListener('click', function() {
  EDIT_TIPO = TAB; EDIT_ID = null;
  document.getElementById('mdEdTit').textContent = '➕ Nova — ' + (TAB==='crianca'?'Criança':'Adulto');
  var html = '<div class="form-group"><label>Nome <span style="color:#e94560">*</span></label><input type="text" name="nome" required></div>' +
    (TAB==='adulto'?'<div class="form-group"><label>CPF <span style="color:#e94560">*</span></label><input type="text" name="cpf" required placeholder="000.000.000-00" oninput="maskCPF(this)"></div>':'') +
    '<div class="form-group"><label>Data Nasc.</label><input type="date" name="data_nascimento"></div>' +
    '<div class="form-group"><label>Telefone</label><input type="text" name="telefone"></div>' +
    '<div class="form-group"><label>Cidade</label><input type="text" name="cidade"></div>' +
    '<div class="form-group"><label>Modalidade (máx 2)</label><input type="text" name="modalidade" placeholder="Ex: Natação, Zumba"></div>' +
    '<div class="form-group"><label>Observações</label><textarea name="obs" rows="2"></textarea></div>';
  document.getElementById('mdEdCampos').innerHTML = html;
  document.getElementById('mdEdMsg').style.display = 'none';
  document.getElementById('mdEditar').classList.add('show');
});

document.getElementById('btnSalvarEdicao').addEventListener('click', function() {
  var inputs = document.querySelectorAll('#mdEdCampos input, #mdEdCampos textarea, #mdEdCampos select');
  var dados = {};
  inputs.forEach(function(el) { if (el.name) dados[el.name] = el.value; });
  if (!dados.nome || !dados.nome.trim()) { showEditErr('Nome é obrigatório'); return; }
  var url = EDIT_ID ? '/api/inscricao/' + EDIT_TIPO + '/' + EDIT_ID : '/api/inscricao/' + EDIT_TIPO;
  var method = EDIT_ID ? 'PUT' : 'POST';
  api(url, method, dados).then(function(d) {
    if (d.success) { document.getElementById('mdEditar').classList.remove('show'); loadData(); loadStats(); }
    else showEditErr(d.error || 'Erro');
  }).catch(function() { showEditErr('Erro de conexão'); });
});
function showEditErr(msg) { document.getElementById('mdEdMsg').style.display='block'; document.getElementById('mdEdMsg').style.background='#fee2e2'; document.getElementById('mdEdMsg').style.color='#991b1b'; document.getElementById('mdEdMsg').textContent=msg; }

// Delete
function confirmDelete(tipo, id) { DEL_TIPO=tipo; DEL_ID=id; document.getElementById('mdExcluir').classList.add('show'); }
document.getElementById('btnExcluirSim').addEventListener('click', function() {
  if (!DEL_ID) return;
  api('/api/inscricao/' + DEL_TIPO + '/' + DEL_ID, 'DELETE').then(function() {
    document.getElementById('mdExcluir').classList.remove('show'); DEL_ID=null; loadData(); loadStats();
  });
});

// Close modals
document.querySelectorAll('.md-overlay').forEach(function(ov) {
  ov.addEventListener('click', function(e) { if(e.target===ov) ov.classList.remove('show'); });
});

// ===== PRINT FICHA =====
function printFicha(tipo, id) {
  api('/api/inscricao/' + tipo + '/' + id).then(function(d) {
    var titulo = (tipo==='crianca'?'Criança':'Adulto');
    var now = new Date().toLocaleDateString('pt-BR');
    var rows = '';
    function row(l,v) {
      if (v===undefined||v===null||v===''||v===0||v==='0') return '';
      if (typeof v==='string' && v.startsWith('data:image')) return '<tr><td style="font-weight:600;color:#5a1e99;width:180px">'+l+':</td><td><img src="'+v+'" style="max-width:100px;max-height:100px;border-radius:8px"></td></tr>';
      return '<tr><td style="font-weight:600;color:#5a1e99;width:180px">'+l+':</td><td>'+esc(String(v))+'</td></tr>';
    }
    Object.keys(d).forEach(function(k) { rows += row(k, d[k]); });
    var w = window.open('','_blank','width=800,height=700');
    w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Ficha '+titulo+'</title>'+
      '<style>body{font-family:sans-serif;max-width:750px;margin:0 auto;padding:20px;color:#1a1a2e}'+
      'h1{text-align:center;color:#5a1e99}h2{text-align:center;color:#7b2ff7}table{width:100%;border-collapse:collapse}'+
      'td{border-bottom:1px solid #e2e4ea;padding:4px 8px;font-size:0.85rem}'+
      '.bar{background:linear-gradient(135deg,#e94560,#7b2ff7,#3b82f6);height:5px;margin-bottom:20px;border-radius:3px}'+
      '@media print{body{padding:0}}</style></head><body>'+
      '<div class="bar"></div><h1>🌟 Projeto Social: Você é Incrível!</h1><h2>Ficha — '+titulo+'</h2><h3 style="text-align:center;color:#e94560">Matrícula: '+(d.matricula||'-')+'</h3>'+
      '<table>'+rows+'</table><p style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#e94560;color:white;border:none;padding:10px 28px;border-radius:25px;font-size:1rem;cursor:pointer;font-weight:600">🖨️ Imprimir</button></p>'+
      '<p style="text-align:center;color:#999;font-size:0.75rem;margin-top:20px">Impresso em: '+now+'</p></body></html>');
    w.document.close();
  });
}

// ===== REPORTS =====
var RD = { criancas: [], adultos: [] };

function loadReports() {
  // Se já temos dados pré-carregados, só renderiza os gráficos (rápido)
  if (RD.criancas.length > 0 || RD.adultos.length > 0) {
    buildCharts(RD.criancas.concat(RD.adultos));
    atualizarModTurma();
    atualizarPesquisaMod();
  }
  // Sempre recarrega do servidor para ter dados frescos
  Promise.all([
    api('/api/inscricao/crianca').catch(function(){return[];}),
    api('/api/inscricao/adulto').catch(function(){return[];})
  ]).then(function(results) {
    RD.criancas = Array.isArray(results[0]) ? results[0] : [];
    RD.adultos = Array.isArray(results[1]) ? results[1] : [];
    buildCharts(RD.criancas.concat(RD.adultos));
    setTimeout(function() {
      atualizarModTurma();
      atualizarPesquisaMod();
    }, 300);
  });
}

function calcIdade(ds) {
  if (!ds) return null;
  var p = ds.split('-'); if (p.length < 3) return null;
  var d = new Date(Number(p[0]), Number(p[1])-1, Number(p[2]));
  var age = new Date().getFullYear() - d.getFullYear();
  var m = new Date().getMonth() - d.getMonth();
  if (m < 0 || (m===0 && new Date().getDate() < d.getDate())) age--;
  return isNaN(age) ? null : age;
}

function buildCharts(all) {
  if (!window.Chart) { var s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js'; s.onload = function() { buildCharts(all); }; document.head.appendChild(s); return; }
  try { if(window._ch1)window._ch1.destroy(); } catch(e){}
  try { if(window._ch2)window._ch2.destroy(); } catch(e){}
  try { if(window._ch3)window._ch3.destroy(); } catch(e){}
  try { if(window._ch4)window._ch4.destroy(); } catch(e){}

  var fx={'0-10':0,'11-17':0,'18-30':0,'31-45':0,'46-60':0,'60+':0};
  all.forEach(function(d){var a=calcIdade(d.data_nascimento);if(a===null)return;if(a<=10)fx['0-10']++;else if(a<=17)fx['11-17']++;else if(a<=30)fx['18-30']++;else if(a<=45)fx['31-45']++;else if(a<=60)fx['46-60']++;else fx['60+']++;});
  window._ch1 = new Chart(document.getElementById('chIdade'),{type:'bar',data:{labels:Object.keys(fx),datasets:[{label:'Inscritos',data:Object.values(fx),backgroundColor:['#e94560','#f59e0b','#10b981','#3b82f6','#8b5cf6','#6b7280']}]},options:{responsive:true,plugins:{legend:{display:false}}}});

  var gen={};
  all.forEach(function(d){var g=d.sexo||'Não informado';gen[g]=(gen[g]||0)+1;});
  window._ch2 = new Chart(document.getElementById('chGenero'),{type:'doughnut',data:{labels:Object.keys(gen),datasets:[{data:Object.values(gen),backgroundColor:['#e94560','#3b82f6','#10b981','#f59e0b','#8b5cf6']}]},options:{responsive:true}});

  var mods={};
  all.forEach(function(d){var m=d.modalidade;if(typeof m==='string')m=m.split(',').map(function(s){return s.trim();});if(Array.isArray(m))m.forEach(function(x){if(x)mods[x]=(mods[x]||0)+1;});});
  var sorted=Object.entries(mods).sort(function(a,b){return b[1]-a[1];});
  window._ch3 = new Chart(document.getElementById('chMod'),{type:'bar',data:{labels:sorted.map(function(p){return p[0];}),datasets:[{label:'Inscritos',data:sorted.map(function(p){return p[1];}),backgroundColor:'#7b2ff7'}]},options:{responsive:true,indexAxis:'y',plugins:{legend:{display:false}}}});

  var meses=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];var cnts=[0,0,0,0,0,0,0,0,0,0,0,0];
  all.forEach(function(d){if(!d.created_at)return;var m=new Date(d.created_at).getMonth();if(!isNaN(m))cnts[m]++;});
  window._ch4 = new Chart(document.getElementById('chMes'),{type:'line',data:{labels:meses,datasets:[{label:'Inscrições',data:cnts,borderColor:'#e94560',backgroundColor:'rgba(233,69,96,0.1)',fill:true,tension:0.4}]},options:{responsive:true}});

  var total=all.length, comTel=all.filter(function(d){return d.telefone||d.responsavel_telefone;}).length;
  var comCPF=all.filter(function(d){return d.cpf||d.responsavel_cpf;}).length;
  var idades=all.map(function(d){return calcIdade(d.data_nascimento);}).filter(function(a){return a!==null;});
  var avg=idades.length?(idades.reduce(function(a,b){return a+b;},0)/idades.length).toFixed(1):'--';
  var cids={};all.forEach(function(d){if(d.cidade)cids[d.cidade]=(cids[d.cidade]||0)+1;});
  var topC=Object.entries(cids).sort(function(a,b){return b[1]-a[1];}).slice(0,5).map(function(p){return p[0]+' ('+p[1]+')';}).join(', ');
  document.getElementById('resumo').innerHTML = '<strong>Total:</strong> '+total+'<br><strong>Média idade:</strong> '+avg+' anos<br><strong>Com telefone:</strong> '+comTel+'<br><strong>Com CPF:</strong> '+comCPF+'<br><strong>Top cidades:</strong> '+(topC||'--');
}

// ===== PESQUISA POR MODALIDADE =====
function atualizarPesquisaMod() {
  var sel = document.getElementById('filtroPesquisaMod');
  if (!sel) return;
  var all = (RD.criancas||[]).concat(RD.adultos||[]);
  if (!all || all.length === 0) return;
  var mods = {};
  all.forEach(function(d) { var m = d.modalidade; if (m) mods[m] = (mods[m]||0)+1; });
  sel.innerHTML = '<option value="">Selecione uma modalidade</option>';
  Object.keys(mods).sort().forEach(function(m) { sel.innerHTML += '<option value="'+esc(m)+'">'+esc(m)+' ('+mods[m]+')</option>'; });
}

if (document.getElementById('btnPesquisarMod')) {
// Popula turnos quando muda modalidade
document.getElementById('filtroPesquisaMod').addEventListener('change', function() {
  var mod = this.value;
  var turnoSel = document.getElementById('filtroTurnoPesquisa');
  turnoSel.innerHTML = '<option value="">Todos os turnos</option>';
  if (!mod) return;
  var all = (RD.criancas||[]).concat(RD.adultos||[]);
  var filtrados = all.filter(function(d){ return d.modalidade === mod; });
  var turnos = {};
  filtrados.forEach(function(d){ var t = d.horario||d.turno_desejado; if(t) turnos[t]=(turnos[t]||0)+1; });
  // Agrupa por Manhã/Tarde/Noite padrão
  var padroes = ['Manhã','Tarde','Noite'];
  padroes.forEach(function(p){ if(turnos[p]) turnoSel.innerHTML += '<option value="'+p+'">'+p+' ('+turnos[p]+')</option>'; });
  Object.keys(turnos).sort().forEach(function(t){ if(padroes.indexOf(t)===-1) turnoSel.innerHTML += '<option value="'+t+'">'+t+' ('+turnos[t]+')</option>'; });
});

document.getElementById('btnPesquisarMod').addEventListener('click', function() {
  var mod = document.getElementById('filtroPesquisaMod').value;
  var tipo = document.getElementById('filtroTipoPesquisa').value;
  var turno = document.getElementById('filtroTurnoPesquisa').value;
  if (!mod) { alert('Selecione uma modalidade.'); return; }
  var all = (RD.criancas||[]).concat(RD.adultos||[]);
  if (!all || all.length === 0) { alert('Carregue os relatórios primeiro (clique em 📊 Relatórios).'); return; }
  var subset = all.filter(function(d) { return d.modalidade === mod; });
  if (tipo === 'crianca') subset = subset.filter(function(d) { return !(d.profissao||d.cpf||d.sexo); });
  else if (tipo === 'adulto') subset = subset.filter(function(d) { return !!(d.profissao||d.cpf||d.sexo); });
  if (turno) subset = subset.filter(function(d) { return (d.horario||d.turno_desejado||'') === turno; });
  if (!subset.length) {
    var msg = 'Nenhum aluno encontrado para: ' + mod + (tipo?' ('+(tipo==='crianca'?'Crianças':'Adultos')+')':'') + (turno?' - '+turno:'');
    document.getElementById('resultadoPesquisaMod').innerHTML = '<p style="color:#999;text-align:center">'+msg+'</p>';
    document.getElementById('resultadoPesquisaMod').style.display='block'; return;
  }

  if (turno) {
    // Quando turno selecionado, separa por criança/adulto
    var criancas = subset.filter(function(d) { return !(d.profissao||d.cpf||d.sexo); });
    var adultos = subset.filter(function(d) { return !!(d.profissao||d.cpf||d.sexo); });
    var html = '<h4 style="margin:8px 0">🏅 ' + mod + ' — ' + turno + ' — ' + subset.length + ' aluno(s)</h4>';
    if (adultos.length > 0) {
      adultos.sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
      html += buildTabelaGrupo('👤 Adultos', adultos);
    }
    if (criancas.length > 0) {
      criancas.sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
      html += buildTabelaGrupo('🧒 Crianças', criancas);
    }
    document.getElementById('resultadoPesquisaMod').innerHTML = html;
  } else {
    // Sem turno, agrupa por turno
    var grupos = {};
    subset.forEach(function(d) {
      var t = d.horario || d.turno_desejado || 'Sem horário';
      if (!grupos[t]) grupos[t] = [];
      grupos[t].push(d);
    });
    var html = '<h4 style="margin:8px 0">🏅 ' + mod + ' — ' + subset.length + ' aluno(s)</h4>';
    var turnosKeys = Object.keys(grupos).sort();
    turnosKeys.forEach(function(t) {
      var alunos = grupos[t];
      // Dentro do turno, separa adulto/criança
      var cri = alunos.filter(function(d){ return !(d.profissao||d.cpf||d.sexo); });
      var adu = alunos.filter(function(d){ return !!(d.profissao||d.cpf||d.sexo); });
      html += '<div style="margin-bottom:10px;border:1px solid #e2e4ea;border-radius:8px;overflow:hidden">'+
        '<div style="background:#ede9fe;padding:6px 12px;font-weight:700;color:#5a1e99;font-size:0.85rem">'+
        '🕐 ' + t + ' — ' + alunos.length + ' aluno(s) ' + (adu.length?'👤'+adu.length+' ':'') + (cri.length?'🧒'+cri.length:'') +
        '</div>';
      if (adu.length > 0) {
        adu.sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
        html += '<div style="padding:2px 10px;font-size:0.75rem;font-weight:600;color:#666">👤 Adultos</div>';
        html += buildTabelaSimples(adu);
      }
      if (cri.length > 0) {
        cri.sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
        html += '<div style="padding:2px 10px;font-size:0.75rem;font-weight:600;color:#666">🧒 Crianças</div>';
        html += buildTabelaSimples(cri);
      }
      html += '</div>';
    });
    document.getElementById('resultadoPesquisaMod').innerHTML = html;
  }
  document.getElementById('resultadoPesquisaMod').style.display = 'block';
});
}

// Helper: tabela simples (Nome, Matrícula, Modalidade, Horário)
function buildTabelaSimples(alunos) {
  var h = '<table style="width:100%;border-collapse:collapse;font-size:0.78rem">'+
    '<tr style="background:#f8f9fb"><th style="padding:4px 8px;text-align:left">Nome</th><th style="padding:4px 8px;text-align:left">Matrícula</th><th style="padding:4px 8px;text-align:left">Modalidade</th><th style="padding:4px 8px;text-align:left">Horário</th></tr>';
  alunos.forEach(function(d) {
    h += '<tr><td style="padding:3px 8px;border-top:1px solid #f0f0f0"><strong>'+esc(d.nome)+'</strong></td><td style="padding:3px 8px;border-top:1px solid #f0f0f0">'+esc(d.matricula||'-')+'</td><td style="padding:3px 8px;border-top:1px solid #f0f0f0">'+esc(d.modalidade||'-')+'</td><td style="padding:3px 8px;border-top:1px solid #f0f0f0">'+esc(d.horario||d.turno_desejado||'-')+'</td></tr>';
  });
  return h + '</table>';
}

// Helper: grupo com título (para quando filtrado por turno)
function buildTabelaGrupo(titulo, alunos) {
  var h = '<div style="margin-bottom:10px;border:1px solid #e2e4ea;border-radius:8px;overflow:hidden">'+
    '<div style="background:#ede9fe;padding:6px 12px;font-weight:700;color:#5a1e99;font-size:0.85rem">'+titulo+' — '+alunos.length+' aluno(s)</div>';
  h += buildTabelaSimples(alunos) + '</div>';
  return h;
}

if (document.getElementById('btnSalvarPDFMod')) {
document.getElementById('btnSalvarPDFMod').addEventListener('click', function() {
  var mod = document.getElementById('filtroPesquisaMod').value;
  var tipo = document.getElementById('filtroTipoPesquisa').value;
  var turnoFiltro = document.getElementById('filtroTurnoPesquisa').value;
  if (!mod) { alert('Selecione uma modalidade primeiro.'); return; }
  var all = (RD.criancas||[]).concat(RD.adultos||[]);
  if (!all || all.length === 0) { alert('Carregue os relatórios primeiro.'); return; }
  var subset = all.filter(function(d) { return d.modalidade === mod; });
  if (tipo === 'crianca') subset = subset.filter(function(d) { return !(d.profissao||d.cpf||d.sexo); });
  else if (tipo === 'adulto') subset = subset.filter(function(d) { return !!(d.profissao||d.cpf||d.sexo); });
  if (turnoFiltro) subset = subset.filter(function(d) { return (d.horario||d.turno_desejado||'') === turnoFiltro; });
  if (!subset.length) { alert('Nenhum aluno nesta modalidade.'); return; }

  var label = mod;
  if (tipo) label += ' — ' + (tipo==='crianca'?'Crianças':'Adultos');
  if (turnoFiltro) label += ' — ' + turnoFiltro;

  var w = window.open('about:blank', '_blank', 'width=1000,height=700');
  var now = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR');
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Pesquisa — '+mod+'</title>'+
    '<style>'+
    '*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
    'html,body{font-family:Arial,sans-serif;margin:0;padding:12px 10px;color:#222;overflow:visible!important;height:auto!important}'+
    'h1{text-align:center;color:#5a1e99;margin:0 0 4px 0;font-size:1.2rem}'+
    'h2{text-align:center;color:#7b2ff7;margin:0 0 10px 0;font-size:0.9rem}'+
    '.bar{background:linear-gradient(135deg,#e94560,#7b2ff7,#3b82f6);height:3px;margin-bottom:12px;border-radius:3px}'+
    '.no-print{display:block}'+
    '.subtipo{background:#f0ecfe;padding:3px 10px;font-weight:600;color:#7b2ff7;font-size:0.7rem;margin:10px 0 2px 0;border-radius:4px}'+
    'table{width:100%;border-collapse:collapse;font-size:0.55rem}'+
    'thead{display:table-header-group!important}'+
    'tr{page-break-inside:auto;page-break-after:auto}'+
    'th{background:#e2e4ea;padding:2px 4px;text-align:left;border-bottom:1px solid #ccc;font-size:0.53rem;font-weight:700}'+
    'td{padding:1px 4px;border-bottom:1px solid #f0f0f0;font-size:0.52rem;line-height:1.15}'+
    '@media print{'+
    '  html,body{overflow:visible!important;height:auto!important;min-height:0!important;max-height:none!important}'+
    '  .no-print{display:none!important}'+
    '  @page{margin:0.5cm;size:A4 landscape}'+
    '}'+
    '</style></head><body>'+
    '<div class="bar"></div>'+
    '<h1>🌟 Projeto Social: Você é Incrível!</h1>'+
    '<h2>🔍 Pesquisa: '+label+' — '+subset.length+' aluno(s)</h2>'+
    '<p class="no-print" style="text-align:center"><button onclick="window.print()" style="background:#e94560;color:white;border:none;padding:8px 24px;border-radius:20px;font-size:0.9rem;cursor:pointer;font-weight:600">🖨️ Imprimir / Salvar PDF</button></p>';

  var seq = 0;
  // Agrupa por turno, e dentro de cada turno por adulto/criança
  var gruposTurno = {};
  subset.forEach(function(d) {
    var t = d.horario || d.turno_desejado || 'Sem horário';
    if (!gruposTurno[t]) gruposTurno[t] = [];
    gruposTurno[t].push(d);
  });

  var turnosOrder = Object.keys(gruposTurno).sort();
  turnosOrder.forEach(function(turnoNome) {
    var grupo = gruposTurno[turnoNome];
    // Separa adulto/criança
    var cri = grupo.filter(function(d){ return !(d.profissao||d.cpf||d.sexo); });
    var adu = grupo.filter(function(d){ return !!(d.profissao||d.cpf||d.sexo); });
    html += '<div class="subtipo">🕐 ' + turnoNome + ' — ' + grupo.length + ' aluno(s) (👤'+adu.length+' 🧒'+cri.length+')</div>';
    if (adu.length > 0) {
      adu.sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
      html += '<div style="font-size:0.6rem;font-weight:600;color:#666;padding:2px 6px">👤 Adultos</div>'+
        '<table><thead><tr><th>#</th><th>Nome</th><th>Matrícula</th><th>Modalidade</th><th>Horário</th></tr></thead><tbody>';
      adu.forEach(function(d){ seq++; html += '<tr><td>'+seq+'</td><td><strong>'+esc(d.nome)+'</strong></td><td>'+esc(d.matricula||'-')+'</td><td>'+esc(d.modalidade||'-')+'</td><td>'+esc(d.horario||d.turno_desejado||'-')+'</td></tr>'; });
      html += '</tbody></table>';
    }
    if (cri.length > 0) {
      cri.sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });
      html += '<div style="font-size:0.6rem;font-weight:600;color:#666;padding:2px 6px">🧒 Crianças</div>'+
        '<table><thead><tr><th>#</th><th>Nome</th><th>Matrícula</th><th>Modalidade</th><th>Horário</th></tr></thead><tbody>';
      cri.forEach(function(d){ seq++; html += '<tr><td>'+seq+'</td><td><strong>'+esc(d.nome)+'</strong></td><td>'+esc(d.matricula||'-')+'</td><td>'+esc(d.modalidade||'-')+'</td><td>'+esc(d.horario||d.turno_desejado||'-')+'</td></tr>'; });
      html += '</tbody></table>';
    }
  });

  html += '<p style="text-align:center;color:#999;font-size:0.7rem;margin-top:16px">Impresso em: '+now+' | Projeto Social: Você é Incrível!</p></body></html>';
  w.document.write(html); w.document.close();
});
}

// Refresh reports
document.getElementById('btnAtualizarRel').addEventListener('click', function() { loadReports(); });

// Printable report
document.getElementById('btnRelatorio').addEventListener('click', function() {
  var all = RD.criancas.concat(RD.adultos);
  var sectors = {};
  all.forEach(function(d){var m=d.modalidade;if(typeof m==='string')m=m.split(',').map(function(s){return s.trim();});if(Array.isArray(m))m.forEach(function(x){if(x)sectors[x]=true;});});
  sectors['Todas Crianças']=true; sectors['Todos Adultos']=true;
  var sel='<option value="todos">Todos os setores</option>';
  Object.keys(sectors).sort().forEach(function(s){sel+='<option value="'+esc(s)+'">'+esc(s)+'</option>';});
  document.getElementById('mdRelConteudo').innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3>🖨️ Relatório por Setor</h3><div style="display:flex;gap:8px"><select id="rpSetor" style="max-width:200px">'+sel+'</select><button class="btn btn-pink btn-sm" onclick="imprimirSetor()">🖨️ Imprimir</button><button class="btn btn-outline btn-sm" onclick="document.getElementById(\'mdRelatorio\').classList.remove(\'show\')">Fechar</button></div></div><div id="rpCorpo" style="margin-top:12px;color:#999;font-style:italic">Selecione um setor e clique em Imprimir</div>';
  document.getElementById('mdRelatorio').classList.add('show');
});

window.imprimirSetor = function() {
  var setor = document.getElementById('rpSetor').value;
  var all = RD.criancas.concat(RD.adultos);
  var subset = all;
  if (setor === 'Todas Crianças') subset = RD.criancas;
  else if (setor === 'Todos Adultos') subset = RD.adultos;
  else if (setor !== 'todos') subset = all.filter(function(d){ var m=d.modalidade; if(typeof m==='string') m=m.split(',').map(function(s){return s.trim();}); return Array.isArray(m)&&m.indexOf(setor)!==-1; });
  if (!subset.length) { alert('Nenhum registro neste setor.'); return; }
  subset.sort(function(a,b){ return (a.nome||'').localeCompare(b.nome||''); });

  var titulo = (setor==='todos'?'Todos os Setores':setor);
  var w = window.open('about:blank', '_blank', 'width=1000,height=700');
  var now = new Date().toLocaleDateString('pt-BR')+' às '+new Date().toLocaleTimeString('pt-BR');

  var idades=subset.map(function(d){return calcIdade(d.data_nascimento);}).filter(function(a){return a!==null;});
  var avg=idades.length?(idades.reduce(function(a,b){return a+b;},0)/idades.length).toFixed(1):'--';
  var masc=subset.filter(function(d){return d.sexo==='Masculino';}).length;
  var fem=subset.filter(function(d){return d.sexo==='Feminino';}).length;

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Relatório — '+titulo+'</title>'+
    '<style>'+
    '*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
    'html,body{font-family:Arial,sans-serif;margin:0;padding:12px 10px;color:#222;overflow:visible!important;height:auto!important}'+
    'h1{text-align:center;color:#5a1e99;margin:0 0 4px 0;font-size:1.2rem}'+
    'h2{text-align:center;color:#7b2ff7;margin:0 0 10px 0;font-size:0.9rem}'+
    '.bar{background:linear-gradient(135deg,#e94560,#7b2ff7,#3b82f6);height:3px;margin-bottom:12px;border-radius:3px}'+
    '.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px}'+
    '.card{background:#f8f6ff;padding:12px;border-radius:8px;text-align:center;border:1px solid #e2e4ea}'+
    '.card b{font-size:1.4rem;color:#5a1e99}.card small{font-size:0.72rem;color:#666}'+
    '.no-print{display:block}'+
    'table{width:100%;border-collapse:collapse;font-size:0.55rem}'+
    'thead{display:table-header-group!important}'+
    'tr{page-break-inside:auto;page-break-after:auto}'+
    'th{background:#e2e4ea!important;padding:2px 4px;text-align:left;border-bottom:2px solid #ccc;font-weight:700;font-size:0.55rem}'+
    'td{padding:1px 4px;border-bottom:1px solid #f0f0f0;font-size:0.53rem;line-height:1.15}'+
    '@media print{'+
    '  html,body{overflow:visible!important;height:auto!important;min-height:0!important;max-height:none!important}'+
    '  .no-print{display:none!important}'+
    '  @page{margin:0.5cm;size:A4 landscape}'+
    '}'+
    '</style></head><body>'+
    '<div class="bar"></div>'+
    '<h1>🌟 Projeto Social: Você é Incrível!</h1>'+
    '<h2>📊 Relatório: '+titulo+' — '+subset.length+' aluno(s)</h2>'+
    '<div class="cards">'+
    '<div class="card"><b>'+subset.length+'</b><br><small>Total</small></div>'+
    '<div class="card"><b>'+avg+'</b><br><small>Média Idade</small></div>'+
    '<div class="card"><b>'+masc+'</b><br><small>Masculino</small></div>'+
    '<div class="card"><b>'+fem+'</b><br><small>Feminino</small></div>'+
    '</div>'+
    '<p class="no-print" style="text-align:center;margin-bottom:10px"><button onclick="window.print()" style="background:#e94560;color:white;border:none;padding:8px 24px;border-radius:20px;font-size:0.9rem;cursor:pointer;font-weight:600">🖨️ Imprimir / Salvar PDF</button></p>'+
    '<table><thead><tr><th>#</th><th>Matrícula</th><th>Nome</th><th>Data Nasc.</th><th>Cidade/UF</th><th>Telefone</th><th>Modalidade</th><th>Horário</th></tr></thead><tbody>';

  subset.forEach(function(d, idx) {
    html += '<tr><td>'+(idx+1)+'</td><td>'+esc(d.matricula||'-')+'</td><td><strong>'+esc(d.nome)+'</strong></td><td>'+fd(d.data_nascimento)+'</td><td>'+esc(d.cidade||'-')+(d.uf?'/'+d.uf:'')+'</td><td>'+esc((d.telefone||d.responsavel_telefone||'-').substring(0,15))+'</td><td>'+esc(d.modalidade||'-')+'</td><td>'+esc(d.horario||d.turno_desejado||'-')+'</td></tr>';
  });

  html += '</tbody></table>'+
    '<p style="text-align:center;color:#999;font-size:0.7rem;margin-top:16px">Impresso em: '+now+' | Projeto Social: Você é Incrível!</p>'+
    '</body></html>';
  w.document.write(html); w.document.close();
};

// ===== USUÁRIOS (admin master) =====
function carregarUsuarios() {
  api('/api/admin/usuarios').then(function(d) {
    var tbody = document.getElementById('tbUsuarios');
    if (!Array.isArray(d) || d.length === 0) { tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:20px;color:#999">Nenhum usuário</td></tr>'; return; }
    tbody.innerHTML = d.map(function(u) {
      var nivelLabel = u.nivel==='admin'?'🔴 Admin':u.nivel==='coordenador'?'🟡 Coord':'🟢 Professor';
      return '<tr><td>'+u.id+'</td><td><strong>'+esc(u.username)+'</strong></td><td>'+nivelLabel+'</td><td>'+esc(u.modalidade||'-')+'</td><td>'+fd(u.created_at)+'</td><td>'+(u.username!=='admin'?'<button class="btn btn-outline btn-sm" onclick="removerUser('+u.id+',\''+esc(u.username)+'\')">🗑️</button>':'—')+'</td></tr>';
    }).join('');
  }).catch(function() {});
}

document.getElementById('btnCriarUser').addEventListener('click', function() {
  var username = document.getElementById('novoUser').value.trim();
  var password = document.getElementById('novaSenha').value.trim();
  var nivel = document.getElementById('novoNivel').value;
  var modalidade = document.getElementById('novaModalidade').value.trim();
  if (!username || !password) { alert('Preencha usuário e senha.'); return; }
  if (nivel === 'professor' && !modalidade) { alert('Professor precisa de modalidade.'); return; }
  api('/api/admin/usuarios', 'POST', { username: username, password: password, nivel: nivel, modalidade: modalidade||null }).then(function(d) {
    if (d.success) {
      document.getElementById('novoUser').value = '';
      document.getElementById('novaSenha').value = '';
      document.getElementById('novaModalidade').value = '';
      carregarUsuarios();
    } else { alert('Erro: ' + (d.error||'desconhecido')); }
  }).catch(function() { alert('Erro de conexão'); });
});

window.removerUser = function(id, username) {
  if (!confirm('Remover usuário ' + username + '?')) return;
  api('/api/admin/usuarios/' + id, 'DELETE').then(function(d) {
    if (d.success) carregarUsuarios(); else alert('Erro ao remover');
  });
};

// ===== FALTAS =====
var _alunoSelecionado = null;

function carregarFaltas() {
  api('/api/faltas').then(function(d) {
    var tbody = document.getElementById('tbFaltas');
    if (!Array.isArray(d) || d.length === 0) { tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:#999">Nenhuma falta registrada</td></tr>'; return; }
    tbody.innerHTML = d.map(function(f) {
      return '<tr><td>'+esc(f.matricula)+'</td><td>'+esc(f.aluno_nome)+'</td><td>'+esc(f.modalidade||'-')+'</td><td>'+fd(f.data_falta)+'</td><td>'+esc(f.motivo||'-')+'</td><td>'+esc(f.registrado_por||'-')+'</td><td><button class="btn btn-outline btn-sm" onclick="removerFalta('+f.id+')">🗑️</button></td></tr>';
    }).join('');
  }).catch(function() {});
}

window.buscarAlunoFalta = function() {
  var q = (document.getElementById('faltaBusca').value||'').toLowerCase();
  if (!q || q.length < 2) { document.getElementById('resultadoFalta').style.display='none'; return; }
  // Busca nos dados já carregados
  var all = (DADOS||[]).concat([]);
  var matches = all.filter(function(x) {
    return (x.nome||'').toLowerCase().indexOf(q) !== -1 || (x.matricula||'').toLowerCase().indexOf(q) !== -1;
  }).slice(0, 20);
  if (matches.length === 0) {
    document.getElementById('resultadoFalta').innerHTML = '<p style="padding:8px;color:#999">Nenhum aluno encontrado</p>';
    document.getElementById('resultadoFalta').style.display = 'block';
    return;
  }
  document.getElementById('resultadoFalta').innerHTML = matches.map(function(d) {
    return '<div style="padding:8px;border-bottom:1px solid #eee;cursor:pointer;font-size:0.85rem" onclick="selecionarAlunoFalta(\''+esc(d.matricula)+'\',\''+esc(d.nome)+'\',\''+esc(d.modalidade||'')+'\',\''+(d.profissao||d.cpf||d.sexo?'adulto':'crianca')+'\')">'+
      '<strong>'+esc(d.nome)+'</strong> — '+esc(d.matricula||'-')+' — '+esc(d.modalidade||'-')+
      '</div>';
  }).join('');
  document.getElementById('resultadoFalta').style.display = 'block';
};

window.selecionarAlunoFalta = function(matricula, nome, modalidade, tipo) {
  _alunoSelecionado = { matricula: matricula, nome: nome, modalidade: modalidade, tipo: tipo };
  document.getElementById('faltaNome').value = nome;
  document.getElementById('faltaMatricula').value = matricula;
  document.getElementById('faltaModalidade').value = modalidade;
  document.getElementById('resultadoFalta').style.display = 'none';
  document.getElementById('formFalta').style.display = 'flex';
};

document.getElementById('btnRegistrarFalta').addEventListener('click', function() {
  if (!_alunoSelecionado) { alert('Busque e selecione um aluno primeiro.'); return; }
  var data_falta = document.getElementById('faltaData').value || new Date().toISOString().substring(0,10);
  var motivo = document.getElementById('faltaMotivo').value || '';
  api('/api/faltas', 'POST', {
    matricula: _alunoSelecionado.matricula,
    aluno_nome: _alunoSelecionado.nome,
    tipo: _alunoSelecionado.tipo,
    modalidade: _alunoSelecionado.modalidade,
    data_falta: data_falta,
    motivo: motivo
  }).then(function(d) {
    if (d.success) {
      alert('Falta registrada!');
      document.getElementById('formFalta').style.display = 'none';
      _alunoSelecionado = null;
      document.getElementById('faltaBusca').value = '';
      carregarFaltas();
    } else { alert('Erro: ' + (d.error||'desconhecido')); }
  }).catch(function() { alert('Erro de conexão'); });
});

window.removerFalta = function(id) {
  if (!confirm('Remover esta falta?')) return;
  api('/api/faltas/' + id, 'DELETE').then(function() { carregarFaltas(); });
};

// ===== INIT =====
if (TOKEN) {
  api('/api/admin/check').then(function(d) {
    if (d.authenticated) showDash(d.username, d.nivel, d.modalidade);
    else { TOKEN=''; try { localStorage.removeItem('_ps_tk'); } catch(e){} }
  }).catch(function() { TOKEN=''; });
}

})();