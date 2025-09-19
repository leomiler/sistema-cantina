# Sistema Cantina - Tickets com Controle de Estoque

Sistema simples para emissão de tickets de venda e controle de estoque, otimizado para impressoras térmicas 58mm.

## 🚀 Funcionalidades

- **Cadastro de Produtos**: Nome, preço, estoque inicial/atual, status ativo/inativo
- **Vendas**: Interface única com busca rápida, validação de estoque, totalizador
- **Formas de Pagamento**: Dinheiro ou PIX
- **Impressão Térmica**: Tickets e relatórios otimizados para 58mm
- **Resumo Diário**: Totais, ranking de produtos, saldo de estoque
- **Reimpressão**: Lista de vendas do dia com busca por ID

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Banco**: MySQL + Prisma ORM
- **PWA**: Mobile-first, instalável

## 📱 Configuração

### 1. Instalar dependências
```bash
npm run setup
```

### 2. Configurar banco de dados
```bash
# Copie o arquivo de exemplo
cp server/.env.example server/.env

# Edite server/.env com suas configurações MySQL
DATABASE_URL="mysql://usuario:senha@localhost:3306/cantina"
```

### 3. Executar migrações
```bash
cd server
npm run db:migrate
npm run db:generate
```

### 4. Iniciar desenvolvimento
```bash
npm run dev
```

## 🖨️ Impressão 58mm

O sistema utiliza CSS otimizado para impressoras térmicas 58mm:
- Tickets de venda com dados da transação
- Relatórios diários com totais e ranking
- Modo de impressão ativado automaticamente

## 📊 Estrutura do Banco

- **produtos**: Cadastro com controle de estoque
- **vendas**: Transações com forma de pagamento
- **venda_itens**: Itens detalhados de cada venda

## 🔧 Scripts Disponíveis

- `npm run dev`: Desenvolvimento (frontend + backend)
- `npm run build`: Build de produção
- `npm run setup`: Instalar todas as dependências

## 🎯 Foco

Sistema **extremamente simples** focado em cantinas pequenas que precisam de controle básico de estoque e emissão de tickets.