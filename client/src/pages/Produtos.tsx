import { useState, useEffect } from 'react';
import { Produto } from '../types';

export function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    preco: '',
    estoqueInicial: '',
    ativo: true
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const response = await fetch('/api/produtos');
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProduct ? `/api/produtos/${editingProduct.id}` : '/api/produtos';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        carregarProdutos();
        resetForm();
        alert(editingProduct ? 'Produto atualizado!' : 'Produto criado!');
      } else {
        alert('Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto');
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      preco: '',
      estoqueInicial: '',
      ativo: true
    });
    setShowForm(false);
    setEditingProduct(null);
  };

  const editProduct = (produto: Produto) => {
    setFormData({
      nome: produto.nome,
      preco: produto.preco.toString(),
      estoqueInicial: produto.estoqueInicial.toString(),
      ativo: produto.ativo
    });
    setEditingProduct(produto);
    setShowForm(true);
  };

  const adjustStock = async (produto: Produto) => {
    const novoEstoque = prompt(
      `Ajustar estoque de ${produto.nome}\nEstoque atual: ${produto.estoqueAtual}`,
      produto.estoqueAtual.toString()
    );

    if (novoEstoque === null) return;

    const estoque = parseInt(novoEstoque);
    if (isNaN(estoque) || estoque < 0) {
      alert('Valor inválido');
      return;
    }

    try {
      const response = await fetch(`/api/produtos/${produto.id}/estoque`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estoqueAtual: estoque })
      });

      if (response.ok) {
        carregarProdutos();
        alert('Estoque atualizado!');
      } else {
        alert('Erro ao atualizar estoque');
      }
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      alert('Erro ao atualizar estoque');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          Novo Produto
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preço (R$)</label>
              <input
                type="number"
                step="0.01"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {!editingProduct && (
              <div>
                <label className="block text-sm font-medium mb-1">Estoque Inicial</label>
                <input
                  type="number"
                  value={formData.estoqueInicial}
                  onChange={(e) => setFormData({ ...formData, estoqueInicial: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="ativo"
                checked={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="ativo" className="text-sm font-medium">Produto ativo</label>
            </div>

            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">
                {editingProduct ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Produtos */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Lista de Produtos</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Nome</th>
                <th className="text-left p-2">Preço</th>
                <th className="text-left p-2">Estoque Atual</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto.id} className="border-b">
                  <td className="p-2 font-medium">{produto.nome}</td>
                  <td className="p-2">R$ {Number(produto.preco).toFixed(2)}</td>
                  <td className="p-2">
                    <span className={`font-medium ${
                      produto.estoqueAtual === 0 ? 'text-red-600' :
                      produto.estoqueAtual <= 5 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {produto.estoqueAtual}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      produto.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editProduct(produto)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => adjustStock(produto)}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Ajustar Estoque
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {produtos.length === 0 && (
            <p className="text-center text-gray-500 py-8">Nenhum produto cadastrado</p>
          )}
        </div>
      </div>
    </div>
  );
}