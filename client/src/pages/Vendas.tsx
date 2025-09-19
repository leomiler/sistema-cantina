import { useState, useEffect } from 'react';
import { Produto, CarrinhoItem } from '../types';

export function Vendas() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [formaPagamento, setFormaPagamento] = useState<'DINHEIRO' | 'PIX'>('DINHEIRO');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await fetch('/api/produtos');
      const data = await response.json();
      setProdutos(data.filter((p: Produto) => p.ativo));
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const adicionarAoCarrinho = (produto: Produto, quantidade: number) => {
    if (quantidade > produto.estoqueAtual) {
      alert(`Estoque insuficiente! Disponível: ${produto.estoqueAtual}`);
      return;
    }

    const itemExistente = carrinho.find(item => item.produto.id === produto.id);

    if (itemExistente) {
      const novaQuantidade = itemExistente.quantidade + quantidade;
      if (novaQuantidade > produto.estoqueAtual) {
        alert(`Estoque insuficiente! Disponível: ${produto.estoqueAtual}`);
        return;
      }

      setCarrinho(carrinho.map(item =>
        item.produto.id === produto.id
          ? { ...item, quantidade: novaQuantidade }
          : item
      ));
    } else {
      setCarrinho([...carrinho, { produto, quantidade }]);
    }
  };

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho(carrinho.filter(item => item.produto.id !== produtoId));
  };

  const total = carrinho.reduce(
    (sum, item) => sum + (Number(item.produto.preco) * item.quantidade),
    0
  );

  const finalizarVenda = async () => {
    if (carrinho.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    setLoading(true);

    try {
      const itens = carrinho.map(item => ({
        produtoId: item.produto.id,
        quantidade: item.quantidade,
        precoUnitario: Number(item.produto.preco)
      }));

      const response = await fetch('/api/vendas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          itens,
          formaPagamento
        })
      });

      if (response.ok) {
        const venda = await response.json();
        setCarrinho([]);
        carregarProdutos(); // Atualizar estoque

        // Aqui implementaremos a impressão do ticket
        imprimirTicket(venda);

        alert('Venda realizada com sucesso!');
      } else {
        const error = await response.json();
        alert(`Erro: ${error.error}`);
      }
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      alert('Erro ao processar venda');
    } finally {
      setLoading(false);
    }
  };

  const imprimirTicket = (venda: any) => {
    // Implementação simples de impressão
    const ticketWindow = window.open('', '_blank');
    if (ticketWindow) {
      ticketWindow.document.write(`
        <html>
          <head>
            <title>Ticket - ${venda.id}</title>
            <style>
              body {
                font-family: monospace;
                font-size: 12px;
                width: 58mm;
                margin: 0;
                padding: 5mm;
              }
              .center { text-align: center; }
              .separator { border-top: 1px dashed #000; margin: 5px 0; }
            </style>
          </head>
          <body>
            <div class="center">
              <strong>CANTINA</strong><br>
              Data/Hora: ${new Date(venda.criadoEm).toLocaleString('pt-BR')}<br>
              Cupom: ${String(venda.id).padStart(6, '0')}
            </div>
            <div class="separator"></div>
            ${venda.itens.map((item: any) => `
              ${item.quantidade}x ${item.produto.nome.padEnd(15)} ${item.subtotal.toFixed(2)}
            `).join('<br>')}
            <div class="separator"></div>
            <div class="center">
              <strong>TOTAL: R$ ${venda.total}</strong><br>
              Pgto: ${venda.formaPagamento}<br>
              Obrigado e volte sempre!
            </div>
          </body>
        </html>
      `);
      ticketWindow.document.close();
      ticketWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Vendas</h1>

      {/* Busca */}
      <div>
        <input
          type="text"
          placeholder="Buscar produto..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Produtos */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Produtos</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {produtosFiltrados.map(produto => (
              <div key={produto.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <span className="font-medium">{produto.nome}</span>
                  <div className="text-sm text-gray-600">
                    R$ {Number(produto.preco).toFixed(2)} | Estoque: {produto.estoqueAtual}
                  </div>
                </div>
                <button
                  onClick={() => adicionarAoCarrinho(produto, 1)}
                  disabled={produto.estoqueAtual === 0}
                  className={`px-3 py-1 rounded ${
                    produto.estoqueAtual > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {produto.estoqueAtual > 0 ? 'Adicionar' : 'Sem estoque'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Carrinho */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Carrinho</h2>

          {carrinho.length === 0 ? (
            <p className="text-gray-500">Carrinho vazio</p>
          ) : (
            <div className="space-y-2">
              {carrinho.map(item => (
                <div key={item.produto.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">{item.produto.nome}</span>
                    <div className="text-sm text-gray-600">
                      {item.quantidade}x R$ {Number(item.produto.preco).toFixed(2)} = R$ {(item.quantidade * Number(item.produto.preco)).toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => removerDoCarrinho(item.produto.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}

          {carrinho.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-xl font-bold mb-4">
                Total: R$ {total.toFixed(2)}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Forma de Pagamento:</label>
                <select
                  value={formaPagamento}
                  onChange={(e) => setFormaPagamento(e.target.value as 'DINHEIRO' | 'PIX')}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="DINHEIRO">Dinheiro</option>
                  <option value="PIX">PIX</option>
                </select>
              </div>

              <button
                onClick={finalizarVenda}
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Emitir Ticket'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}