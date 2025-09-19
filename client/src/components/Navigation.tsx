import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-gray-900">Sistema Cantina</h1>

          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Vendas
            </Link>
            <Link
              to="/produtos"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/produtos')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Produtos
            </Link>
            <Link
              to="/resumo"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/resumo')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Resumo
            </Link>
            <Link
              to="/reimpressao"
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive('/reimpressao')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Reimprimir
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}