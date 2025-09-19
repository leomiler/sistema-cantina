import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Vendas } from './pages/Vendas';
import { Produtos } from './pages/Produtos';
import { Resumo } from './pages/Resumo';
import { Reimpressao } from './pages/Reimpressao';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Vendas />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/resumo" element={<Resumo />} />
            <Route path="/reimpressao" element={<Reimpressao />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;