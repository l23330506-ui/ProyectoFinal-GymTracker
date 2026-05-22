import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import MisRutinas from './pages/MisRutinas';
import EntrenamientoActivo from './pages/EntrenamientoActivo';
import Historial from './pages/Historial';

export default function App() {
  // Pestaña actual activa
  const [pestanaActual, setPestanaActual] = useState('dashboard');

  // Estado global de Rutinas (con datos semilla iniciales)
  const [rutinas, setRutinas] = useState([
    { 
      id: 1, 
      nombre: "Rutina de Empuje (Pecho/Hombro)", 
      descripcion: "Enfoque en ganancias de fuerza y masa muscular en el tren superior.",
      ejercicios: ["Press de Banca Inclinado", "Press Militar con Mancuernas"]
    },
    { 
      id: 2, 
      nombre: "Rutina de Pierna Completa", 
      descripcion: "Enfoque en cuádriceps, femorales y pantorrillas.",
      ejercicios: ["Sentadilla Libre con Barra"]
    }
  ]);

  // Estado para saber cuál rutina seleccionó el usuario para entrenar hoy
  const [rutinaParaEntrenar, setRutinaParaEntrenar] = useState(null);

  // Estado global para el Historial
  const [historial, setHistorial] = useState([
    { fecha: "20 de Mayo, 2026", rutina: "Rutina de Empuje (Pecho/Hombro)", duracion: "55 mins", estado: "Completado", seriesTotales: 8 }
  ]);

  // Función para redirigir e iniciar entrenamiento desde 'Mis Rutinas'
  const iniciarEntrenamientoGlobal = (rutina) => {
    setRutinaParaEntrenar(rutina);
    setPestanaActual('entrenar'); // Redirige automáticamente a la pestaña de entrenar
  };

  // Función para finalizar entrenamiento y mandarlo al historial
  const finalizarEntrenamientoGlobal = (nuevoHistorialItem) => {
    setHistorial([nuevoHistorialItem, ...historial]);
    setRutinaParaEntrenar(null); // Limpia la rutina activa
    setPestanaActual('historial'); // Redirige automáticamente al historial
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6', fontFamily: 'sans-serif' }}>
      
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav style={{ background: '#111827', padding: '15px 20px', display: 'flex', gap: '15px', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <span style={{ color: '#fff', fontWeight: 'bold', marginRight: '20px', fontSize: '1.2rem' }}>🏋️‍♂️ GymTrack</span>
        <button onClick={() => setPestanaActual('dashboard')} style={{ background: pestanaActual === 'dashboard' ? '#374151' : 'transparent', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>📊 Dashboard</button>
        <button onClick={() => setPestanaActual('rutinas')} style={{ background: pestanaActual === 'rutinas' ? '#374151' : 'transparent', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>📝 Mis Rutinas</button>
        <button onClick={() => setPestanaActual('entrenar')} style={{ background: pestanaActual === 'entrenar' ? '#374151' : 'transparent', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>⚡ Entrenar {rutinaParaEntrenar ? '🔴' : ''}</button>
        <button onClick={() => setPestanaActual('historial')} style={{ background: pestanaActual === 'historial' ? '#374151' : 'transparent', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>📅 Historial</button>
      </nav>

      {/* RENDERIZADO DINÁMICO DE PÁGINAS */}
      <div style={{ padding: '30px 20px' }}>
        {pestanaActual === 'dashboard' && (
          <Dashboard alIniciarEntrenamiento={() => setPestanaActual('rutinas')} />
        )}
        
        {pestanaActual === 'rutinas' && (
          <MisRutinas 
            rutinas={rutinas} 
            setRutinas={setRutinas} 
            onIniciarEntrenamiento={iniciarEntrenamientoGlobal} 
          />
        )}
        
        {pestanaActual === 'entrenar' && (
          <EntrenamientoActivo 
            rutinaActiva={rutinaParaEntrenar} 
            onFinalizarEntrenamiento={finalizarEntrenamientoGlobal} 
          />
        )}
        
        {pestanaActual === 'historial' && (
          <Historial registros={historial} />
        )}
      </div>

    </div>
  );
}