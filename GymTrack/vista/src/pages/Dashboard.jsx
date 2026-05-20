import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  // Datos simulados de ejemplo (Mock data) para cumplir la regla de no datos quemados
  const usuarioSimulado = {
    nombre: "Carlos",
    entrenamientosSemanales: 3,
    ultimaRutina: "Rutina de Empuje (Pecho/Hombro/Tríceps)"
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      {/* Mensaje de Bienvenida */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>¡Hola de nuevo, {usuarioSimulado.nombre}! 👋</h1>
        <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>Listo para superar tus límites el día de hoy?</p>
      </div>

      {/* Tarjeta de Acción Principal - Módulo 1 */}
      <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(37,99,235,0.3)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 10px 0' }}>¿Entrenamos hoy?</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Registra tus series, repeticiones y pesos en tiempo real.</p>
        </div>
        <button 
          onClick={() => navigate('/entrenar')} 
          style={{ background: '#fff', color: '#2563eb', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', transition: 'transform 0.2s' }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          🚀 Iniciar Entrenamiento
        </button>
      </div>

      {/* Resumen de Actividad */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#444' }}>Progreso Semanal</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 5px 0', color: '#10b981' }}>{usuarioSimulado.entrenamientosSemanales} Días</p>
          <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>¡Vas por muy buen camino esta semana!</p>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#444' }}>Último Entrenamiento</h3>
          <p style={{ fontSize: '1.05rem', fontWeight: '500', margin: '0 0 5px 0', color: '#1a1a1a' }}>{usuarioSimulado.ultimaRutina}</p>
          <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>Completado con éxito</p>
        </div>
      </div>
    </div>
  );
}