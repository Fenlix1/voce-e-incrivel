-- 🏃‍♂️ COLE ISSO NO SQL EDITOR DO SUPABASE (https://zzsnltnxonttilruiloc.supabase.co)
-- Menu esquerdo → SQL Editor → New Query → Cole → Run

-- Tabela de administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin padrão
INSERT INTO admin_users (username, password)
VALUES ('admin', 'a17cd0b1c051e2bd224970a7f9d6dd9c81e2d4baa80fe25448fd9ac3bcc5f8f3')
ON CONFLICT (username) DO NOTHING;

-- Tabela de inscrições adulto
CREATE TABLE IF NOT EXISTS adultos (
  id SERIAL PRIMARY KEY,
  nome TEXT,
  matricula TEXT,
  profissao TEXT,
  data_nascimento TEXT,
  idade TEXT,
  sexo TEXT,
  cpf TEXT,
  rg TEXT,
  orgao_emissor TEXT,
  filiacao_pai TEXT,
  filiacao_mae TEXT,
  composicao_familiar TEXT,
  telefone TEXT,
  email TEXT,
  peso TEXT,
  altura TEXT,
  cep TEXT,
  endereco TEXT,
  numero TEXT,
  bairro TEXT,
  cidade TEXT,
  uf TEXT,
  modalidade TEXT,
  turno_desejado TEXT,
  objetivo TEXT,
  possui_deficiencia TEXT,
  possui_deficiencia_descricao TEXT,
  ja_frequentou_modalidade TEXT,
  ja_frequentou_tempo TEXT,
  pratica_atividade_fisica TEXT,
  pratica_atividade_qual TEXT,
  pratica_atividade_frequencia TEXT,
  condicao_fisica_saude TEXT,
  problema_muscular_etc TEXT,
  problema_muscular_qual TEXT,
  antecedentes_familiares TEXT,
  usa_medicamento TEXT,
  usa_medicamento_qual TEXT,
  usa_medicamento_motivo TEXT,
  faz_tratamento TEXT,
  faz_tratamento_fono BOOLEAN DEFAULT false,
  faz_tratamento_fisio BOOLEAN DEFAULT false,
  faz_tratamento_psico BOOLEAN DEFAULT false,
  faz_tratamento_outros_qual TEXT,
  horas_sono TEXT,
  etilismo TEXT,
  tabagismo TEXT,
  refeicoes_por_dia TEXT,
  objetivo_peso TEXT,
  obs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de inscrições criança
CREATE TABLE IF NOT EXISTS criancas (
  id SERIAL PRIMARY KEY,
  nome TEXT,
  matricula TEXT,
  data_nascimento TEXT,
  idade TEXT,
  peso_aproximado TEXT,
  estatura_aproximada TEXT,
  data_ultima_avaliacao_medica TEXT,
  responsavel_nome TEXT,
  responsavel_parentesco TEXT,
  responsavel_cpf TEXT,
  responsavel_telefone TEXT,
  responsavel_email TEXT,
  cep TEXT,
  endereco TEXT,
  numero TEXT,
  bairro TEXT,
  cidade TEXT,
  uf TEXT,
  situacao_escolar TEXT,
  serie TEXT,
  turno TEXT,
  nome_unidade_escolar TEXT,
  modalidade TEXT,
  turno_desejado TEXT,
  intervencao_cirurgica TEXT,
  situacao_vacinal TEXT,
  situacao_vacinal_irregular_especifique TEXT,
  medicamentos_ultimos_tempos TEXT,
  tem_alergia TEXT,
  tratamento_saude TEXT,
  tratamento_saude_especifique TEXT,
  uso_medicamento_constante TEXT,
  uso_medicamento_especifique TEXT,
  problema_tipo TEXT,
  problema_especifique TEXT,
  condicao_saude TEXT,
  condicoes_saude_especifique TEXT,
  responsavel_acompanhamento TEXT,
  responsavel_acompanhamento_outros TEXT,
  problema_impossibilita_atividade_fisica TEXT,
  problema_impossibilita_especifique TEXT,
  teve_hepatite TEXT,
  possui_convenio_medico TEXT,
  convenio_medico_qual TEXT,
  obs TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_adultos_nome ON adultos (nome);
CREATE INDEX IF NOT EXISTS idx_criancas_nome ON criancas (nome);
CREATE INDEX IF NOT EXISTS idx_adultos_matricula ON adultos (matricula);
CREATE INDEX IF NOT EXISTS idx_criancas_matricula ON criancas (matricula);
