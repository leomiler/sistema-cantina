export interface Produto {
  id: number;
  nome: string;
  preco: number;
  estoqueInicial: number;
  estoqueAtual: number;
  ativo: boolean;
  criadoEm: string;
}

export interface VendaItem {
  id?: number;
  vendaId?: number;
  produtoId: number;
  produto?: Produto;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

export interface Venda {
  id: number;
  criadoEm: string;
  formaPagamento: 'DINHEIRO' | 'PIX';
  total: number;
  itens: VendaItem[];
}

export interface CarrinhoItem {
  produto: Produto;
  quantidade: number;
}

export interface ResumoDia {
  data: string;
  totalVendas: number;
  totalCupons: number;
  totalDinheiro: number;
  totalPix: number;
  ranking: {
    produto: string;
    quantidade: number;
    valor: number;
  }[];
  estoques: {
    produto: string;
    estoque: number;
  }[];
}