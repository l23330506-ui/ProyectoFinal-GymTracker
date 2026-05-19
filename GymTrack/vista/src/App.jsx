import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CatalogoEjercicios from './pages/CatalogoEjercicios';
import MisRutinas from './pages/MisRutinas';
import EntrenamientoActivo from './pages/EntrenamientoActivo';
import Historial from './pages/Historial';

export default function App() {
  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f4f6f9', margin: 0 }}>
        
        {/* Menú de navegación temporal y scannable */}
        <nav style={{ 
          padding: '15px 20px', 
          background: '#1a1a1a', 
          color: '#fff', 
          display: 'flex', 
          gap: '20px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
        }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>🏋️‍♂️ Dashboard</Link>
          <Link to="/ejercicios" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>📚 Catálogo</Link>
          <Link to="/rutinas" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>📝 Mis Rutinas</Link>
          <Link to="/entrenar" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>⚡ Entrenar (Módulo 1)</Link>
          <Link to="/historial" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>📅 Historial (Módulo 2)</Link>
        </nav>

        {/* Contenedor principal donde se renderizarán tus 5 pantallas */}
        <main style={{ padding: '30px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ejercicios" element={<CatalogoEjercicios />} />
            <Route path="/rutinas" element={<MisRutinas />} />
            <Route path="/entrenar" element={<EntrenamientoActivo />} />
            <Route path="/historial" element={<Historial />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}