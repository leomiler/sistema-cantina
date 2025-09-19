import { Router } from 'express';

const router = Router();

// GET /api/resumo - Resumo do dia
router.get('/', async (req, res) => {
  try {
    const { data } = req.query;
    const hoje = data ? new Date(data as string) : new Date();

    const inicioDia = new Date(hoje);
    inicioDia.setHours(0, 0, 0, 0);

    const fimDia = new Date(hoje);
    fimDia.setHours(23, 59, 59, 999);

    // Buscar vendas do dia
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
      }
    });

    // Calcular totais
    const totalVendas = vendas.reduce((sum, venda) => sum + Number(venda.total), 0);
    const totalCupons = vendas.length;
    const totalDinheiro = vendas
      .filter(v => v.formaPagamento === 'DINHEIRO')
      .reduce((sum, venda) => sum + Number(venda.total), 0);
    const totalPix = vendas
      .filter(v => v.formaPagamento === 'PIX')
      .reduce((sum, venda) => sum + Number(venda.total), 0);

    // Ranking de produtos
    const produtosVendidos: { [key: string]: { quantidade: number; valor: number; nome: string } } = {};

    vendas.forEach(venda => {
      venda.itens.forEach(item => {
        const key = item.produto.nome;
        if (!produtosVendidos[key]) {
          produtosVendidos[key] = { quantidade: 0, valor: 0, nome: item.produto.nome };
        }
        produtosVendidos[key].quantidade += item.quantidade;
        produtosVendidos[key].valor += Number(item.subtotal);
      });
    });

    const ranking = Object.values(produtosVendidos)
      .sort((a, b) => b.quantidade - a.quantidade)
      .map(item => ({
        produto: item.nome,
        quantidade: item.quantidade,
        valor: item.valor
      }));

    // Estoque atual
    const produtos = await req.prisma.produto.findMany({
      where: { ativo: true },
      select: {
        nome: true,
        estoqueAtual: true
      },
      orderBy: { nome: 'asc' }
    });

    const estoques = produtos.map(produto => ({
      produto: produto.nome,
      estoque: produto.estoqueAtual
    }));

    const resumo = {
      data: hoje.toISOString().split('T')[0],
      totalVendas,
      totalCupons,
      totalDinheiro,
      totalPix,
      ranking,
      estoques
    };

    res.json(resumo);
  } catch (error) {
    console.error('Erro ao gerar resumo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export { router as resumoRouter };