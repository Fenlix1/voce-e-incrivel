/**
 * Projeto Social: Você é Incrível!
 * JavaScript compartilhado — foto, assinatura, máscaras, CEP, envio
 * v2 — corrigido: checkboxes múltiplos, foto resize, validação robusta
 */

// ==================== PHOTO REMOVED (não armazenamos fotos no banco) ====================

// ==================== SIGNATURE PAD ====================
var _sig = { canvas: null, ctx: null, drawing: false };

function initSignaturePad() {
  var canvas = document.getElementById('signatureCanvas');
  if (!canvas) return;
  _sig.canvas = canvas;
  _sig.ctx = canvas.getContext('2d');
  _sig.ctx.strokeStyle = '#1a1a2e';
  _sig.ctx.lineWidth = 2;
  _sig.ctx.lineCap = 'round';

  function draw(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    _sig.ctx.lineTo(x, y);
    _sig.ctx.stroke();
    _sig.ctx.beginPath();
    _sig.ctx.moveTo(x, y);
  }
  function saveSig() {
    try {
      // Only save if canvas has content
      var data = canvas.toDataURL('image/png');
      var el = document.getElementById('signatureData');
      if (el && data && data.length > 100) el.value = data;
    } catch(e) {}
  }

  canvas.addEventListener('mousedown', function(e) { _sig.drawing = true; draw(e); });
  canvas.addEventListener('mousemove', function(e) { if (_sig.drawing) draw(e); });
  canvas.addEventListener('mouseup', function() { _sig.drawing = false; saveSig(); });
  canvas.addEventListener('mouseleave', function() { _sig.drawing = false; saveSig(); });
  canvas.addEventListener('touchstart', function(e) { e.preventDefault(); _sig.drawing = true; draw(e.touches[0]); });
  canvas.addEventListener('touchmove', function(e) { e.preventDefault(); if (_sig.drawing) draw(e.touches[0]); });
  canvas.addEventListener('touchend', function() { _sig.drawing = false; saveSig(); });
}

function clearSignature() {
  if (!_sig.ctx || !_sig.canvas) return;
  _sig.ctx.clearRect(0, 0, _sig.canvas.width, _sig.canvas.height);
  _sig.ctx.beginPath();
  var el = document.getElementById('signatureData');
  if (el) el.value = '';
}

// ==================== HORÁRIOS POR FAIXA ETÁRIA ====================
var HORARIOS_ADULTO = {
  'Boxe': ['Seg/Qua/Sex 07:00-08:00','Seg/Qua/Sex 19:00-20:00'],
  'Jiu Jitsu': ['Seg/Qua/Sex 08:00-09:00','Seg/Qua/Sex 20:00-21:00'],
  'Muay Thai': ['Seg/Qua/Sex 09:00-10:00','Seg/Qua/Sex 21:00-22:00'],
  'Funcional': ['Ter/Qui 07:00-08:00','Seg/Qua 19:30-20:30'],
  'Pilates': ['Ter/Qui 08:00-09:00','Ter/Qui 11:00-12:00'],
  'Natação': ['Ter/Qui 09:00-10:00'],
  'Hidroginástica': ['Ter/Qui 10:00-11:00'],
  'Capoeira': ['Ter/Qui 14:00-15:00'],
  'Ballet': ['Ter/Qui 15:00-16:00'],
  'Zumba': ['Seg/Qua/Sex 17:00-18:00','Seg/Qua/Sex 18:00-19:00']
};
var HORARIOS_CRIANCA = {
  'Boxe': ['Ter/Qui 14:00-15:00'],
  'Jiu Jitsu': ['Ter/Qui 15:00-16:00'],
  'Muay Thai': ['Seg/Qua 14:00-15:00'],
  'Funcional': ['Seg/Qua 15:00-16:00'],
  'Pilates': ['Ter/Qui 16:00-17:00'],
  'Natação': ['Seg/Qua 10:00-11:00','Ter/Qui 10:00-11:00'],
  'Hidroginástica': ['Seg/Qua 11:00-12:00'],
  'Capoeira': ['Seg/Qua 16:00-17:00'],
  'Ballet': ['Ter/Qui 17:00-18:00'],
  'Zumba': ['Ter/Qui 18:00-19:00']
};

function atualizarHorarios() {
  var sel = document.getElementById('horarioModalidade');
  if (!sel) return;
  var checked = document.querySelector('input[name="modalidade"]:checked');
  if (!checked) { sel.innerHTML = '<option value="">Selecione uma modalidade</option>'; return; }
  var mod = checked.value;
  // Detecta se é ficha adulto ou criança
  var isCrianca = window.location.pathname.indexOf('crianca') !== -1;
  var horarios = isCrianca ? (HORARIOS_CRIANCA[mod] || []) : (HORARIOS_ADULTO[mod] || []);
  sel.innerHTML = '<option value="">Selecione o horário</option>';
  horarios.forEach(function(h) { sel.innerHTML += '<option value="' + h + '">' + h + '</option>'; });
  if (horarios.length === 0) sel.innerHTML = '<option value="">Sem horário disponível</option>';
}

// ==================== MASKS ====================
function maskCPF(input) {
  var v = input.value.replace(/\D/g, '').substring(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  input.value = v;
}

function maskFone(input) {
  var v = input.value.replace(/\D/g, '').substring(0, 11);
  v = (v.length <= 10) ? v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3') : v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
  input.value = v;
}

function maskCEP(input) {
  var v = input.value.replace(/\D/g, '').substring(0, 8);
  input.value = v.replace(/(\d{5})(\d{0,3})/, '$1-$2');
}

// ==================== CEP AUTO-FILL ====================
function buscarCEP(cepRaw) {
  var cep = cepRaw.replace(/\D/g, '');
  if (cep.length !== 8) return;
  fetch('https://viacep.com.br/ws/' + cep + '/json/')
    .then(function(r){ return r.json(); })
    .then(function(data){
      if (data.erro) return;
      var end = document.querySelector('[name="endereco"]');
      var bai = document.querySelector('[name="bairro"]');
      var cid = document.querySelector('[name="cidade"]');
      if (end && !end.value) end.value = data.logradouro || '';
      if (bai && !bai.value) bai.value = data.bairro || '';
      if (cid && !cid.value) cid.value = (data.localidade || '') + (data.uf ? '/' + data.uf : '');
    }).catch(function(){});
}

// ==================== CALC IDADE ====================
function calcIdade(input) {
  var ds = input.value;
  if (!ds) return;
  var parts = ds.split('-');
  if (parts.length < 3) return;
  var birth = new Date(Number(parts[0]), Number(parts[1])-1, Number(parts[2]));
  var today = new Date();
  var age = today.getFullYear() - birth.getFullYear();
  var m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  if (isNaN(age)) return;
  var a = document.getElementById('idadeAdulto');
  var c = document.getElementById('idadeCrianca');
  if (a) a.value = age + ' anos';
  if (c) c.value = age + ' anos';
}

// ==================== CONDITIONAL ====================
function toggleCond(radioEl, targetId) {
  var t = document.getElementById(targetId);
  if (!t) return;
  t.classList.toggle('active', radioEl.value === 'Sim');
}

// Init conditionals that are pre-checked
document.addEventListener('DOMContentLoaded', function(){
  var radios = document.querySelectorAll('input[type="radio"][value="Sim"]:checked');
  for (var i=0; i<radios.length; i++) {
    var r = radios[i];
    var onch = r.getAttribute('onchange');
    if (onch) {
      var m = onch.match(/toggleCond\(this,\s*'([^']+)'\)/);
      if (m) {
        var el = document.getElementById(m[1]);
        if (el) el.classList.add('active');
      }
    }
  }
});

// ==================== FORM UTILS ====================
function getFormType() {
  var p = window.location.pathname;
  if (p.indexOf('crianca') !== -1) return 'crianca';
  if (p.indexOf('adulto') !== -1) return 'adulto';
  return 'crianca';
}

function limparFormulario() {
  var form = document.querySelector('form');
  if (form) form.reset();
  removePhoto();
  clearSignature();
  var conds = document.querySelectorAll('.conditional-field');
  for (var i=0; i<conds.length; i++) conds[i].classList.remove('active');
  var ab = document.getElementById('alertBox');
  if (ab) { ab.className = 'alert'; ab.style.display = 'none'; }
  window.scrollTo(0, 0);
}

// ==================== FORM SUBMIT (FIXED) ====================
document.addEventListener('DOMContentLoaded', function() {
  var form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var alertBox = document.getElementById('alertBox');
    var btnSalvar = document.getElementById('btnSalvar');
    var spinner = document.getElementById('loadingSpinner');
    if (alertBox) { alertBox.className = 'alert'; alertBox.style.display = 'none'; }

    var formType = getFormType();
    var fd = new FormData(form);

    // CORREÇÃO: agrupar checkboxes com mesmo nome em string separada por vírgula
    var dados = {};
    var multiValues = {}; // acumula checkboxes múltiplos

    var entries = [];
    for (var pair of fd.entries()) entries.push(pair);

    for (var i = 0; i < entries.length; i++) {
      var key = entries[i][0];
      var val = entries[i][1];

      // Pular campos vazios
      if (val === '' || val === null || val === undefined) continue;

      // Se já existe esta chave, é um checkbox múltiplo
      if (key in dados) {
        if (!multiValues[key]) multiValues[key] = [dados[key]];
        multiValues[key].push(val);
      } else {
        dados[key] = val;
      }
    }

    // Juntar checkboxes múltiplos
    for (var mk in multiValues) {
      dados[mk] = multiValues[mk].join(', ');
    }

    // Validar obrigatórios
    if (!dados.nome || !dados.data_nascimento) {
      if (alertBox) {
        alertBox.className = 'alert error'; alertBox.style.display = 'block';
        alertBox.textContent = 'Preencha os campos obrigatórios (Nome e Data de Nascimento).';
      }
      window.scrollTo(0, 0);
      return;
    }

    // Validar modalidade escolhida
    if (!dados.modalidade) {
      if (alertBox) {
        alertBox.className = 'alert error'; alertBox.style.display = 'block';
        alertBox.textContent = 'Escolha uma modalidade.';
      }
      window.scrollTo(0, 300);
      return;
    }

    // Validar horário escolhido
    if (!dados.horario) {
      if (alertBox) {
        alertBox.className = 'alert error'; alertBox.style.display = 'block';
        alertBox.textContent = 'Escolha um horário para a modalidade.';
      }
      window.scrollTo(0, 300);
      return;
    }

    // Validar termo (aparece como 'termo_compromisso: on' quando marcado)
    if (!dados.termo_compromisso) {
      if (alertBox) {
        alertBox.className = 'alert error'; alertBox.style.display = 'block';
        alertBox.textContent = 'Você precisa aceitar o termo de compromisso.';
      }
      document.getElementById(formType === 'crianca' ? 'termoCheckCrianca' : 'termoCheckAdulto')?.scrollIntoView({behavior:'smooth'});
      return;
    }

    // Remover foto se for muito grande (> 500KB base64)
    if (dados.foto_base64 && dados.foto_base64.length > 500000) {
      console.warn('Foto muito grande, reduzindo qualidade...');
      // Tenta comprimir ainda mais
      try {
        var img = new Image();
        img.onload = function() {
          var c = document.createElement('canvas');
          c.width = 300; c.height = 300 * img.height / img.width;
          var ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0, c.width, c.height);
          dados.foto_base64 = c.toDataURL('image/jpeg', 0.3);
          doSubmit(formType, dados, alertBox, btnSalvar, spinner);
        };
        img.src = dados.foto_base64;
        return; // vai chamar doSubmit dentro do onload
      } catch(e) {
        // Se falhar compressão, remove a foto mas salva o resto
        delete dados.foto_base64;
      }
    }

    doSubmit(formType, dados, alertBox, btnSalvar, spinner);
  });
});

function doSubmit(formType, dados, alertBox, btnSalvar, spinner) {
  if (btnSalvar) btnSalvar.disabled = true;
  if (spinner) spinner.classList.add('active');

  var endpoint = formType === 'crianca' ? '/api/inscricao/crianca' : '/api/inscricao/adulto';

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  })
  .then(function(resp) { return resp.json().then(function(d) { return { ok: resp.ok, data: d }; }); })
  .then(function(result) {
    if (btnSalvar) btnSalvar.disabled = false;
    if (spinner) spinner.classList.remove('active');

    if (result.ok) {
      var mm = document.getElementById('modalMatricula');
      if (mm) mm.textContent = 'Matrícula: ' + (result.data.matricula || 'PSI-' + result.data.id);
      var modal = document.getElementById('modalSucesso');
      if (modal) modal.classList.add('active');
    } else {
      if (alertBox) {
        alertBox.className = 'alert error'; alertBox.style.display = 'block';
        alertBox.textContent = result.data.error || 'Erro ao salvar. Tente novamente.';
      }
    }
  })
  .catch(function(err) {
    console.error('Erro:', err);
    if (btnSalvar) btnSalvar.disabled = false;
    if (spinner) spinner.classList.remove('active');
    if (alertBox) {
      alertBox.className = 'alert error'; alertBox.style.display = 'block';
      alertBox.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
    }
  });
}
