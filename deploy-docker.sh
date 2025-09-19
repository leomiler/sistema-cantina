#!/bin/bash

# Deploy Docker para Hostinger
echo "🐳 Iniciando deploy Docker do Sistema Cantina..."

# 1. Verificar se está na rede traefik-public
echo "🔍 Verificando rede Traefik..."
if ! docker network ls | grep -q "traefik-public"; then
    echo "❌ Rede traefik-public não encontrada!"
    echo "Criando rede traefik-public..."
    docker network create traefik-public
fi

# 2. Parar containers antigos se existirem
echo "🛑 Parando containers antigos..."
docker-compose down --remove-orphans

# 3. Fazer backup do .env se existir
if [ -f ".env" ]; then
    echo "📁 Fazendo backup do .env..."
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
fi

# 4. Atualizar código
echo "📦 Atualizando código..."
git pull origin main

# 5. Build e start dos containers
echo "🔨 Fazendo build e iniciando containers..."
docker-compose up -d --build

# 6. Aguardar containers ficarem prontos
echo "⏳ Aguardando containers ficarem saudáveis..."
sleep 30

# 7. Executar migrações
echo "🗄️ Executando migrações do banco..."
docker-compose exec cantina-backend npx prisma migrate deploy

# 8. Verificar status
echo "📊 Verificando status dos containers..."
docker-compose ps

# 9. Mostrar logs recentes
echo "📋 Logs recentes:"
docker-compose logs --tail=20

echo ""
echo "✅ Deploy concluído!"
echo "🌐 Aplicação disponível em: https://cantina.srv920656.hstgr.cloud"
echo ""
echo "💡 Comandos úteis:"
echo "  - Ver logs: docker-compose logs -f"
echo "  - Restart: docker-compose restart"
echo "  - Stop: docker-compose down"
echo "  - Status: docker-compose ps"