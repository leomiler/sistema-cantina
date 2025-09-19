import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { produtosRouter } from './routes/produtos.js';
import { vendasRouter } from './routes/vendas.js';
import { resumoRouter } from './routes/resumo.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Middleware para adicionar prisma ao request
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Rotas
app.use('/api/produtos', produtosRouter);
app.use('/api/vendas', vendasRouter);
app.use('/api/resumo', resumoRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});