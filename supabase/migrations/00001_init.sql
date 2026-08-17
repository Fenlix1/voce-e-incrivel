CREATE TABLE admin_users(id SERIAL PRIMARY KEY,username TEXT UNIQUE,password TEXT,created_at TIMESTAMPTZ DEFAULT NOW());
INSERT INTO admin_users(username,password)VALUES('admin','a17cd0b1c051e2bd224970a7f9d6dd9c81e2d4baa80fe25448fd9ac3bcc5f8f3');
CREATE TABLE adultos(id SERIAL PRIMARY KEY,nome TEXT,matricula TEXT,data_nascimento TEXT,telefone TEXT,cidade TEXT,uf TEXT,profissao TEXT,sexo TEXT,cpf TEXT,email TEXT,modalidade TEXT,turno_desejado TEXT,condicao_fisica_saude TEXT,objetivo_peso TEXT,horas_sono TEXT,etilismo TEXT,tabagismo TEXT,created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE criancas(id SERIAL PRIMARY KEY,nome TEXT,matricula TEXT,data_nascimento TEXT,responsavel_nome TEXT,responsavel_telefone TEXT,serie TEXT,turno TEXT,situacao_vacinal TEXT,cidade TEXT,uf TEXT,created_at TIMESTAMPTZ DEFAULT NOW(),updated_at TIMESTAMPTZ DEFAULT NOW());
ALTER TABLE adultos DISABLE ROW LEVEL SECURITY;
ALTER TABLE criancas DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
