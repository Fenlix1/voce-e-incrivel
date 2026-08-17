ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS nivel TEXT DEFAULT 'admin' CHECK (nivel IN ('admin','coordenador','professor'));
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS modalidade TEXT;

-- Atualiza admin existente
UPDATE admin_users SET nivel = 'admin' WHERE nivel IS NULL;

-- Cria usuários padrão
INSERT INTO admin_users (username, password, nivel, modalidade) VALUES ('coordenador', '236ae44b7ed7f311c2c3dec837e1fc131f56f0a17b664b8110144d9a04cb0234', 'coordenador', NULL) ON CONFLICT (username) DO NOTHING;
INSERT INTO admin_users (username, password, nivel, modalidade) VALUES ('prof.boxe', '236ae44b7ed7f311c2c3dec837e1fc131f56f0a17b664b8110144d9a04cb0234', 'professor', 'Boxe') ON CONFLICT (username) DO NOTHING;
INSERT INTO admin_users (username, password, nivel, modalidade) VALUES ('prof.ballet', '236ae44b7ed7f311c2c3dec837e1fc131f56f0a17b664b8110144d9a04cb0234', 'professor', 'Ballet') ON CONFLICT (username) DO NOTHING;
INSERT INTO admin_users (username, password, nivel, modalidade) VALUES ('prof.natacao', '236ae44b7ed7f311c2c3dec837e1fc131f56f0a17b664b8110144d9a04cb0234', 'professor', 'Natação') ON CONFLICT (username) DO NOTHING;
