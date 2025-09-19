# 🏗️ Setup Hostinger - Sistema Cantina

## 📋 Informações Necessárias
Antes de começar, preciso das seguintes informações do seu servidor Hostinger:

### 🔑 Acesso SSH
- **IP do servidor:** _____________
- **Usuário SSH:** _____________
- **Senha SSH:** _____________
- **Porta SSH:** _____________ (geralmente 22)

### 🗄️ Banco de Dados MySQL
- **Host MySQL:** _____________ (geralmente localhost)
- **Nome do banco:** _____________
- **Usuário MySQL:** _____________
- **Senha MySQL:** _____________
- **Porta MySQL:** _____________ (geralmente 3306)

### 🌐 Domínio
- **Domínio principal:** _____________ (ex: meusite.com)
- **Subdomínio (opcional):** _____________ (ex: cantina.meusite.com)

---

## 🚀 Passos do Deploy

### 1. Conectar via SSH
```bash
ssh usuario@ip-do-servidor
```

### 2. Instalar Node.js (se não tiver)
```bash
# Verificar se já tem Node.js
node --version

# Se não tiver, instalar:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Instalar PM2 globalmente
```bash
npm install -g pm2
```

### 4. Clonar repositório
```bash
cd /home/usuario  # ou diretório escolhido
git clone https://github.com/leomiler/sistema-cantina.git
cd sistema-cantina
```

### 5. Configurar variáveis de ambiente
```bash
cp server/.env.example server/.env
nano server/.env  # editar com dados reais
```

### 6. Executar setup completo
```bash
chmod +x deploy.sh
./deploy.sh
```

### 7. Configurar Nginx (se necessário)
Arquivo: `/etc/nginx/sites-available/cantina`

---

## 🔧 Troubleshooting

### Problema: Porta 3001 em uso
```bash
sudo lsof -i :3001
sudo kill -9 PID_DO_PROCESSO
```

### Problema: Permissões
```bash
sudo chown -R usuario:usuario /caminho/para/projeto
chmod +x deploy.sh
```

### Problema: Banco não conecta
- Verificar credenciais no .env
- Verificar se MySQL está rodando: `sudo systemctl status mysql`
- Verificar firewall: `sudo ufw status`

---

## 📱 Após Deploy

1. ✅ Testar API: `http://seu-dominio.com/api/health`
2. ✅ Testar frontend: `http://seu-dominio.com`
3. ✅ Cadastrar produto de teste
4. ✅ Fazer venda de teste
5. ✅ Testar impressão

---

**📞 Suporte:** Quando tiver as informações, podemos continuar o deploy!