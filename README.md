# Projeto Social: Você é Incrível! 🌟

Sistema completo de fichas de inscrição — deploy pronto para **Netlify**.

## 🚀 Deploy no Netlify

### Método 1 — Git + Netlify (Recomendado)

1. **Faça push do projeto para um repositório Git** (GitHub, GitLab ou Bitbucket):
   ```bash
   cd ProjetoSocial
   git init
   git add .
   git commit -m "Projeto Social: Você é Incrível!"
   git remote add origin https://github.com/SEU-USUARIO/projeto-social.git
   git branch -M main
   git push -u origin main
   ```

2. **Conecte ao Netlify:**
   - Acesse [netlify.com](https://netlify.com) e faça login
   - Clique em **"Add new site"** → **"Import an existing project"**
   - Conecte seu provedor Git e selecione o repositório
   - O Netlify detecta automaticamente o `netlify.toml` — **não precisa configurar nada!**
   - Clique **"Deploy site"**

3. **Pronto!** Seu site estará no ar em `https://SEU-SITE.netlify.app`

### Método 2 — Deploy Manual (Arrastar e Soltar)

1. Execute localmente para gerar os arquivos:
   ```bash
   npm install
   npm start
   ```

2. No Netlify, vá em **"Deploy manually"** e arraste a pasta `public/`

> ⚠️ **Atenção:** No deploy manual, as Netlify Functions **não funcionam**. Use o Método 1 para ter o backend completo.

---

## 🔧 Rodar Localmente

### Requisitos
- **Node.js 18+** — [Baixar Node.js](https://nodejs.org/)

### Instalação

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor
npm start
```

### Acessar

| Página | URL |
|--------|-----|
| 🏠 Inicial | http://localhost:3000 |
| 🧒 Criança | http://localhost:3000/crianca |
| 👤 Adulto | http://localhost:3000/adulto |
| 🔐 Admin | http://localhost:3000/admin |

**Login Admin:** `admin` / `admin123`

> ⚠️ Altere a senha no primeiro acesso. Edite `storage.js` na função `ensureDefaultAdmin()`.

---

## 📋 Funcionalidades

### Usuário (Cliente)
- ✅ Ficha de inscrição para **Crianças** — todos os campos do PDF original
- ✅ Ficha de inscrição para **Adultos** — todos os campos do PDF original
- ✅ Botão **Salvar** grava tudo no banco de dados
- ✅ Opção de **Novo Cadastro** após concluir inscrição
- ✅ Preenchimento automático de endereço pelo CEP
- ✅ Validação de campos obrigatórios
- ❌ **Sem botão WhatsApp** (conforme solicitado)

### Administrador
- 🔐 Login com token seguro (HMAC)
- 👁️ Visualizar todas as inscrições
- ✏️ Editar qualquer inscrição
- 🗑️ Excluir inscrições
- ➕ Adicionar novas inscrições
- 🔍 Buscar por nome
- 📊 Dashboard com estatísticas
- 📑 Abas Crianças / Adultos

---

## 🏗️ Arquitetura

```
ProjetoSocial/
├── server.js              # Servidor Express + serverless handler
├── storage.js             # Camada de dados (Netlify Blobs / JSON local)
├── package.json           # Dependências
├── netlify.toml           # Config do Netlify (redirects, build)
├── netlify/functions/
│   └── api.js             # Netlify Function (entry point)
├── public/                # Site estático
│   ├── index.html         # Página inicial
│   ├── crianca.html       # Ficha Criança
│   ├── adulto.html        # Ficha Adulto
│   ├── admin.html         # Painel Admin
│   ├── css/style.css      # Estilos
│   └── js/
│       ├── form.js         # Lógica dos formulários
│       └── admin.js        # Lógica do painel admin
├── .gitignore
└── README.md
```

### Como funciona

- **Frontend:** HTML/CSS/JS estático servido pelo Netlify CDN
- **Backend:** Express.js empacotado como **Netlify Function**
- **Dados:** No Netlify → **Netlify Blobs** (persistente). Local → **JSON files** na pasta `data/`
- **Autenticação:** Tokens HMAC auto-contidos (funciona sem estado no serverless)

---

## 🔒 Segurança

- Senhas hash com HMAC-SHA256
- Tokens de sessão assinados e com expiração de 4h
- API admin requer token em todas as requisições
- Headers de segurança configurados (X-Frame-Options, etc.)

---

**Projeto Social: Você é Incrível!** — Transformando vidas através do esporte e da comunidade.
