import { Router } from 'express';

const router = Router();

// POST /api/vendas - Criar nova venda
router.post('/', async (req, res) => {
  try {
    const { itens, formaPagamento } = req.body;

    // Validar estoque antes de processar venda
    for (const item of itens) {
      const produto = await req.prisma.produto.findUnique({
        where: { id: item.produtoId }
      });

      if (!produto) {
        return res.status(400).json({
          error: `Produto ${item.produtoId} não encontrado`
        });
      }

      if (produto.estoqueAtual < item.quantidade) {
        return res.status(400).json({
          error: `Estoque insuficiente para ${produto.nome}. Disponível: ${produto.estoqueAtual}`
        });
      }
    }

    // Calcular total
    const total = itens.reduce((sum: number, item: any) =>
      sum + (item.quantidade * item.precoUnitario), 0
    );

    // Criar venda
    const venda = await req.prisma.venda.create({
      data: {
        formaPagamento,
        total,
        itens: {
          create: itens.map((item: any) => ({
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            subtotal: item.quantidade * item.precoUnitario
          }))
        }
      },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    });

    // Atualizar estoque
    for (const item of itens) {
      await req.prisma.produto.update({
        where: { id: item.produtoId },
        data: {
          estoqueAtual: {
            decrement: item.quantidade
          }
        }
      });
    }

    // Converter BigInt para string para JSON
    const vendaResponse = {
      ...venda,
      id: venda.id.toString(),
      itens: venda.itens.map(item => ({
        ...item,
        id: item.id.toString(),
        vendaId: item.vendaId.toString()
      }))
    };

    res.status(201).json(vendaResponse);
  } catch (error) {
    console.error('Erro ao criar venda:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/vendas - Listar vendas do dia
router.get('/', async (req, res) => {
  try {
    const { data } = req.query;
    const hoje = data ? new Date(data as string) : new Date();

    const inicioDia = new Date(hoje);
    inicioDia.setHours(0, 0, 0, 0);

    const fimDia = new Date(hoje);
    fimDia.setHours(23, 59, 59, 999);

    const vendas = await req.prisma.venda.findMany({
      where: {
        criadoEm: {
          gte: inicioDia,
          lte: fimDia
        }
      },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });

    // Converter BigInt para string
    const vendasResponse = vendas.map(venda => ({
      ...venda,
      id: venda.id.toString(),
      itens: venda.itens.map(item => ({
        ...item,
        id: item.id.toString(),
        vendaId: item.vendaId.toString()
      }))
    }));

    res.json(vendasResponse);
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/vendas/:id - Buscar venda específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const venda = await req.prisma.venda.findUnique({
      where: { id: BigInt(id) },
      include: {
        itens: {
          include: {
            produto: true
          }
        }
      }
    });

    if (!venda) {
      return res.status(404).json({ error: 'Venda não encontrada' });
    }

    // Converter BigInt para string
    const vendaResponse = {
      ...venda,
      id: venda.id.toString(),
      itens: venda.itens.map(item => ({
        ...item,
        id: item.id.toString(),
        vendaId: item.vendaId.toString()
      }))
    };

    res.json(vendaResponse);
  } catch (error) {
    console.error('Erro ao buscar venda:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export { router as vendasRouter };