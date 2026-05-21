import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Estados para guardar los datos de la API, carga y errores
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Llamada a la API en el puerto 5050
    fetch('http://localhost:5050/api/usuario/resumen') // Ajusta el endpoint (/api/...) según el controlador de tu compañero
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo conectar con el servidor de la API');
        }
        return response.json();
      })
      .then((data) => {
        setUsuario(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setCargando(false);
      });
  }, []);

  // Pantalla de carga estética temporal
  if (cargando) {
    return <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.2rem', color: '#666' }}>⏳ Cargando tu progreso...</div>;
  }

  // Respaldo en caso de que la API esté apagada (evita datos quemados permanentes)
  const datosFinales = error || !usuario ? {
    nombre: "Usuario GymTrack",
    entrenamientosSemanales: 0,
    ultimaRutina: "Sin registros recientes (API Desconectada)"
  } : usuario;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Alerta sutil si la API no está respondiendo */}
      {error && (
        <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '500' }}>
          ⚠️ Nota: Mostrando modo desconectado. Servidor API ({error}) no disponible en localhost:5050.
        </div>
      )}

      {/* Mensaje de Bienvenida */}
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>¡Hola de nuevo, {datosFinales.nombre}! 👋</h1>
        <p style={{ margin: 0, color: '#666', fontSize: '1.1rem' }}>¿Listo para superar tus límites el día de hoy?</p>
      </div>

      {/* Tarjeta de Acción Principal */}
      <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(37,99,235,0.3)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: '0 0 10px 0' }}>¿Entrenamos hoy?</h2>
          <p style={{ margin: 0, opacity: 0.9 }}>Registra tus series, repeticiones y pesos en tiempo real.</p>
        </div>
        <button 
          onClick={() => navigate('/entrenar')} 
          style={{ background: '#fff', color: '#2563eb', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
        >
          🚀 Iniciar Entrenamiento
        </button>
      </div>

      {/* Resumen de Actividad Dinámico */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#444' }}>Progreso Semanal</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 5px 0', color: '#10b981' }}>{datosFinales.entrenamientosSemanales} Días</p>
          <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>¡Construyendo disciplina día a día!</p>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#444' }}>Último Entrenamiento</h3>
          <p style={{ fontSize: '1.05rem', fontWeight: '500', margin: '0 0 5px 0', color: '#1a1a1a' }}>{datosFinales.ultimaRutina}</p>
          <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>Registro traído de la base de datos</p>
        </div>
      </div>
    </div>
  );
}