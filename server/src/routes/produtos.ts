import { Router } from 'express';

const router = Router();

// GET /api/produtos - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const produtos = await req.prisma.produto.findMany({
      orderBy: { nome: 'asc' }
    });
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/produtos - Criar novo produto
router.post('/', async (req, res) => {
  try {
    const { nome, preco, estoqueInicial } = req.body;

    const produto = await req.prisma.produto.create({
      data: {
        nome,
        preco: parseFloat(preco),
        estoqueInicial: parseInt(estoqueInicial),
        estoqueAtual: parseInt(estoqueInicial)
      }
    });

    res.status(201).json(produto);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PATCH /api/produtos/:id/estoque - Ajustar estoque
router.patch('/:id/estoque', async (req, res) => {
  try {
    const { id } = req.params;
    const { estoqueAtual } = req.body;

    const produto = await req.prisma.produto.update({
      where: { id: parseInt(id) },
      data: { estoqueAtual: parseInt(estoqueAtual) }
    });

    res.json(produto);
  } catch (error) {
    console.error('Erro ao ajustar estoque:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/produtos/:id - Atualizar produto
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, preco, ativo } = req.body;

    const produto = await req.prisma.produto.update({
      where: { id: parseInt(id) },
      data: {
        nome,
        preco: parseFloat(preco),
        ativo
      }
    });

    res.json(produto);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export { router as produtosRouter };