import { useState, useEffect } from 'react';
import { ResumoDia } from '../types';

export function Resumo() {
  const [resumo, setResumo] = useState<ResumoDia | null>(null);
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarResumo();
  }, [data]);

  const carregarResumo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/resumo?data=${data}`);
      const dados = await response.json();
      setResumo(dados);
    } catch (error) {
      console.error('Erro ao carregar resumo:', error);
    } finally {
      setLoading(false);
    }
  };

  const imprimirRelatorio = () => {
    if (!resumo) return;

    const relatorioWindow = window.open('', '_blank');
    if (relatorioWindow) {
      relatorioWindow.document.write(`
        <html>
          <head>
            <title>Relatório Diário - ${data}</title>
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
              .right { text-align: right; }
            </style>
          </head>
          <body>
            <div class="center">
              <strong>RELATÓRIO DIÁRIO</strong><br>
              ${new Date(data).toLocaleDateString('pt-BR')}
            </div>
            <div class="separator"></div>

            <div>
              Vendas: ${resumo.totalCupons} cupons<br>
              Total R$: ${resumo.totalVendas.toFixed(2)}<br>
              Dinheiro R$: ${resumo.totalDinheiro.toFixed(2)}<br>
              PIX R$: ${resumo.totalPix.toFixed(2)}
            </div>

            <div class="separator"></div>
            <div class="center"><strong>TOP PRODUTOS (Qtd / R$)</strong></div>

            ${resumo.ranking.slice(0, 10).map((item, index) => `
              ${index + 1}) ${item.produto} ${item.quantidade} ${item.valor.toFixed(2)}
            `).join('<br>')}

            <div class="separator"></div>
            <div class="center"><strong>ESTOQUE FINAL</strong></div>

            ${resumo.estoques.map(item => `
              ${item.produto} ${item.estoque} unid
            `).join('<br>')}

          </body>
        </html>
      `);
      relatorioWindow.document.close();
      relatorioWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Resumo do Dia</h1>
        <button
          onClick={imprimirRelatorio}
          disabled={!resumo}
          className="btn-primary disabled:opacity-50"
        >
          Imprimir Relatório
        </button>
      </div>

      {/* Seletor de Data */}
      <div className="card">
        <label className="block text-sm font-medium mb-2">Data:</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
      </div>

      {resumo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cards de Totais */}
          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-600">Total de Vendas</h3>
            <p className="text-3xl font-bold text-green-600">
              R$ {resumo.totalVendas.toFixed(2)}
            </p>
          </div>

          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-600">Cupons Emitidos</h3>
            <p className="text-3xl font-bold text-blue-600">{resumo.totalCupons}</p>
          </div>

          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-600">Dinheiro</h3>
            <p className="text-3xl font-bold text-green-500">
              R$ {resumo.totalDinheiro.toFixed(2)}
            </p>
          </div>

          <div className="card text-center">
            <h3 className="text-lg font-semibold text-gray-600">PIX</h3>
            <p className="text-3xl font-bold text-purple-600">
              R$ {resumo.totalPix.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {resumo && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ranking de Produtos */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Top Produtos</h2>
            <div className="space-y-2">
              {resumo.ranking.slice(0, 10).map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <span className="font-medium">{index + 1}. {item.produto}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{item.quantidade} unid</div>
                    <div className="font-semibold">R$ {item.valor.toFixed(2)}</div>
                  </div>
                </div>
              ))}
              {resumo.ranking.length === 0 && (
                <p className="text-gray-500 text-center py-4">Nenhuma venda hoje</p>
              )}
            </div>
          </div>

          {/* Estoque Final */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Estoque Final</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {resumo.estoques.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b">
                  <span className="font-medium">{item.produto}</span>
                  <span className={`font-semibold ${
                    item.estoque === 0 ? 'text-red-600' :
                    item.estoque <= 5 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {item.estoque} unid
                  </span>
                </div>
              ))}
              {resumo.estoques.length === 0 && (
                <p className="text-gray-500 text-center py-4">Nenhum produto cadastrado</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}