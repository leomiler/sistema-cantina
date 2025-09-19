# 🚀 Deploy - Sistema Cantina

## 📋 Pré-requisitos para Produção

### Servidor
- Node.js 18+
- MySQL 8.0+
- PM2 (para gerenciar processos)

### Configuração do Banco
1. Criar banco MySQL: `cantina`
2. Configurar usuário com permissões completas
3. Configurar as variáveis de ambiente

## 🔧 Configuração

### 1. Variáveis de Ambiente (.env)
```bash
# Servidor
DATABASE_URL="mysql://usuario:senha@localhost:3306/cantina"
PORT=3001
NODE_ENV=production

# Cliente (se necessário)
VITE_API_URL=http://seu-dominio.com/api
```

### 2. Instalação no Servidor
```bash
# Clonar repositório
git clone https://github.com/SEU_USUARIO/sistema-cantina.git
cd sistema-cantina

# Instalar dependências
npm run setup

# Configurar banco
cd server
cp .env.example .env
# Editar .env com dados reais

# Executar migrações
npm run db:generate
npm run db:migrate

# Build do projeto
npm run build
```

### 3. Iniciar com PM2
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração PM2
pm2 save
pm2 startup
```

## 🌐 Nginx (Recomendado)
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    # Frontend
    location / {
        root /caminho/para/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📱 SSL/HTTPS
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d seu-dominio.com
```