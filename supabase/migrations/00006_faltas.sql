CREATE TABLE IF NOT EXISTS faltas (
  id SERIAL PRIMARY KEY,
  matricula TEXT NOT NULL,
  aluno_nome TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('adulto','crianca')) NOT NULL,
  modalidade TEXT,
  data_falta DATE NOT NULL DEFAULT CURRENT_DATE,
  motivo TEXT,
  registrado_por TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_faltas_matricula ON faltas(matricula);
CREATE INDEX IF NOT EXISTS idx_faltas_data ON faltas(data_falta);
CREATE INDEX IF NOT EXISTS idx_faltas_modalidade ON faltas(modalidade);
ALTER TABLE faltas DISABLE ROW LEVEL SECURITY;
