#!/bin/bash

# Script de Deploy para Hostinger
echo "🚀 Iniciando deploy do Sistema Cantina..."

# 1. Fazer backup do .env se existir
if [ -f "server/.env" ]; then
    echo "📁 Fazendo backup do .env..."
    cp server/.env server/.env.backup
fi

# 2. Atualizar código
echo "📦 Atualizando código..."
git pull origin main

# 3. Instalar dependências
echo "📋 Instalando dependências..."
npm run deploy:setup

# 4. Executar migrações (se necessário)
echo "🗄️ Verificando migrações do banco..."
npm run deploy:migrate

# 5. Build do projeto
echo "🔨 Fazendo build..."
npm run deploy:build

# 6. Reiniciar aplicação com PM2
echo "🔄 Reiniciando aplicação..."
pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js

echo "✅ Deploy concluído!"
echo "🌐 Aplicação rodando em: http://seu-dominio.com"