import { useState, useEffect } from 'react';
import { Venda } from '../types';

export function Reimpressao() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [busca, setBusca] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarVendas();
  }, [data]);

  const carregarVendas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/vendas?data=${data}`);
      const dados = await response.json();
      setVendas(dados);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const vendasFiltradas = vendas.filter(venda =>
    venda.id.toString().includes(busca) ||
    venda.itens.some(item =>
      item.produto?.nome.toLowerCase().includes(busca.toLowerCase())
    )
  );

  const reimprimir = (venda: Venda) => {
    const ticketWindow = window.open('', '_blank');
    if (ticketWindow) {
      ticketWindow.document.write(`
        <html>
          <head>
            <title>Reimpressão Ticket - ${venda.id}</title>
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
              <strong>CANTINA - REIMPRESSÃO</strong><br>
              Data/Hora: ${new Date(venda.criadoEm).toLocaleString('pt-BR')}<br>
              Cupom: ${String(venda.id).padStart(6, '0')}
            </div>
            <div class="separator"></div>
            ${venda.itens.map((item) => `
              ${item.quantidade}x ${item.produto?.nome || 'Produto'} R$ ${Number(item.subtotal).toFixed(2)}
            `).join('<br>')}
            <div class="separator"></div>
            <div class="center">
              <strong>TOTAL: R$ ${Number(venda.total).toFixed(2)}</strong><br>
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
      <h1 className="text-2xl font-bold">Reimpressão de Tickets</h1>

      {/* Filtros */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Data:</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Buscar por ID ou Produto:</label>
            <input
              type="text"
              placeholder="Digite o ID do cupom ou nome do produto..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Lista de Vendas */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">
          Vendas do dia - {new Date(data).toLocaleDateString('pt-BR')}
        </h2>

        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {vendasFiltradas.map(venda => (
              <div key={venda.id.toString()} className="flex items-center justify-between p-4 border rounded hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="font-bold text-lg">
                        #{String(venda.id).padStart(6, '0')}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">
                        {new Date(venda.criadoEm).toLocaleTimeString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {venda.formaPagamento}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-green-600">
                        R$ {Number(venda.total).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-600">
                    <strong>Itens:</strong>{' '}
                    {venda.itens.map(item =>
                      `${item.quantidade}x ${item.produto?.nome || 'Produto'}`
                    ).join(', ')}
                  </div>
                </div>

                <button
                  onClick={() => reimprimir(venda)}
                  className="btn-primary ml-4"
                >
                  Reimprimir
                </button>
              </div>
            ))}

            {vendasFiltradas.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                {busca ? 'Nenhuma venda encontrada com essa busca' : 'Nenhuma venda registrada hoje'}
              </div>
            )}
          </div>
        )}

        {vendas.length > 0 && (
          <div className="mt-4 pt-4 border-t text-sm text-gray-600">
            <strong>Total de vendas do dia:</strong> {vendas.length} cupons |
            <strong> Total em vendas:</strong> R$ {vendas.reduce((sum, venda) => sum + Number(venda.total), 0).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}