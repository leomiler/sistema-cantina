# 🐳 Deploy Docker + Traefik - Sistema Cantina

## 🎯 Configuração para seu ambiente:
- **Subdomínio:** `cantina.srv920656.hstgr.cloud`
- **MySQL Host:** `mysql` (rede Docker)
- **Traefik:** SSL automático via Let's Encrypt

## 📋 Pré-requisitos na VPS

### 1. Verificar se Traefik está rodando
```bash
docker ps | grep traefik
```

### 2. Verificar rede traefik-public
```bash
docker network ls | grep traefik-public
```

### 3. Verificar MySQL
```bash
docker ps | grep mysql
# ou
docker exec mysql mysql -u root -p -e "SHOW DATABASES;"
```

## 🚀 Passos do Deploy

### 1. Conectar na VPS
```bash
ssh usuario@srv920656.hstgr.cloud
```

### 2. Clonar o repositório
```bash
cd /caminho/desejado
git clone https://github.com/leomiler/sistema-cantina.git
cd sistema-cantina
```

### 3. Configurar variáveis de ambiente
```bash
# Copiar arquivo de exemplo
cp .env.production .env

# Editar com dados reais
nano .env
```

**Configuração do .env:**
```env
DATABASE_URL="mysql://USUARIO:SENHA@mysql:3306/NOME_BANCO"
```

### 4. Executar deploy
```bash
chmod +x deploy-docker.sh
./deploy-docker.sh
```

## 🔧 Configuração do Banco

### Criar banco e usuário MySQL:
```sql
-- Conectar no MySQL
docker exec -it mysql mysql -u root -p

-- Criar banco
CREATE DATABASE cantina CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Criar usuário
CREATE USER 'cantina_user'@'%' IDENTIFIED BY 'senha_segura_aqui';

-- Dar permissões
GRANT ALL PRIVILEGES ON cantina.* TO 'cantina_user'@'%';
FLUSH PRIVILEGES;

-- Verificar
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'cantina_user';
```

## 📊 Monitoramento

### Ver logs em tempo real
```bash
docker-compose logs -f
```

### Status dos containers
```bash
docker-compose ps
```

### Verificar saúde dos serviços
```bash
# Backend health check
curl -k https://cantina.srv920656.hstgr.cloud/api/health

# Frontend health check
curl -k https://cantina.srv920656.hstgr.cloud/health
```

## 🔄 Comandos de Manutenção

### Reiniciar serviços
```bash
docker-compose restart
```

### Atualizar aplicação
```bash
git pull origin main
docker-compose up -d --build
```

### Backup do banco
```bash
docker exec mysql mysqldump -u cantina_user -p cantina > backup_cantina_$(date +%Y%m%d).sql
```

### Executar migrações manualmente
```bash
docker-compose exec cantina-backend npx prisma migrate deploy
```

## 🌐 SSL/HTTPS

O Traefik automaticamente:
- ✅ Obtém certificado SSL via Let's Encrypt
- ✅ Redireciona HTTP → HTTPS
- ✅ Configura headers de segurança
- ✅ Gerencia renovação do certificado

## 🚨 Troubleshooting

### Container não inicia
```bash
docker-compose logs cantina-backend
docker-compose logs cantina-frontend
```

### Erro de banco
```bash
# Verificar conectividade
docker-compose exec cantina-backend ping mysql

# Testar conexão MySQL
docker exec mysql mysql -u cantina_user -p -h localhost cantina -e "SELECT 1;"
```

### Problema com Traefik
```bash
# Ver labels do Traefik
docker inspect cantina-frontend | grep -A 20 '"Labels"'

# Logs do Traefik
docker logs traefik
```

## 🎯 Após Deploy

1. ✅ Acessar: `https://cantina.srv920656.hstgr.cloud`
2. ✅ Cadastrar produtos de teste
3. ✅ Fazer venda teste
4. ✅ Verificar impressão de tickets