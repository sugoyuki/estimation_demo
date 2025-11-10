import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Estimates from './pages/Estimates';
import EstimateDetail from './pages/EstimateDetail';
import EstimateNew from './pages/EstimateNew';
import Services from './pages/Services';
import RulesGeneral from './pages/RulesGeneral';
import RulesForce from './pages/RulesForce';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">校正料金算出システム</Link>
          </div>
          <ul className="nav-menu">
            <li><Link to="/">ホーム</Link></li>
            <li><Link to="/estimates">見積管理</Link></li>
            <li><Link to="/services">サービスマスタ</Link></li>
            <li><Link to="/rules/general">一般分野ルール</Link></li>
            <li><Link to="/rules/force">力学分野ルール</Link></li>
          </ul>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/estimates" element={<Estimates />} />
            <Route path="/estimates/new" element={<EstimateNew />} />
            <Route path="/estimates/:id" element={<EstimateDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/rules/general" element={<RulesGeneral />} />
            <Route path="/rules/force" element={<RulesForce />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 校正料金自動算出システム</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
