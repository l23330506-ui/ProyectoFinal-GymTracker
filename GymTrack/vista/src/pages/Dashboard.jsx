import { useState, useEffect } from 'react';

export default function Dashboard({ alIniciarEntrenamiento }) {
  // Estado para guardar la información que viene de la API de C#
  const [datosFinales, setDatosFinales] = useState({
    nombre: "Usuario GymTrack",
    entrenamientosSemanales: 0,
    ultimaRutina: "Sin entrenamientos aún"
  });

  const [errorApi, setErrorApi] = useState(false);

  // Llamada real al backend local en el puerto 5050
  useEffect(() => {
    fetch('http://localhost:5050/api/usuario/resumen')
      .then(response => {
        if (!response.ok) throw new Error('Error en servidor');
        return response.json();
      })
      .then(data => {
        setDatosFinales(data);
        setErrorApi(false);
      })
      .catch(err => {
        console.log("Servidor desconectado o sin ruta válida:", err);
        setErrorApi(true);
      });
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* Alerta de modo desconectado (solo aparece si la API falla o está vacía) */}
      {errorApi && (
        <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px 20px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '500', border: '1px solid #fca5a5' }}>
          ⚠️ Nota: Mostrando modo desconectado local. Servidor API no disponible o ruta inválida en localhost:5050.
        </div>
      )}

      {/* 🟢 MENSAJE DE BIENVENIDA CORREGIDO (Sin encimarse) */}
      <div style={{ background: '#fff', padding: '35px 30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '25px', textAlign: 'center' }}>
        <h1 style={{ 
          margin: '0 0 20px 0',      // Empuja el subtítulo hacia abajo con suficiente aire
          color: '#1a1a1a', 
          lineHeight: '1.4',         // Da espacio extra por si el nombre ocupa dos renglones
          fontSize: '2.4rem',
          fontWeight: 'bold'
        }}>
          ¡Hola de nuevo, {datosFinales.nombre}! 👋
        </h1>
        <p style={{ margin: 0, color: '#666', fontSize: '1.15rem' }}>
          ¿Listo para superar tus límites el día de hoy?
        </p>
      </div>

      {/* BANNER INTERACTIVO CONECTADO A MIS RUTINAS */}
      <div style={{ background: '#1d4ed8', color: '#fff', padding: '25px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', boxShadow: '0 4px 10px rgba(29,78,216,0.3)' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>¿Entrenamos hoy?</h3>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>Visualiza tus estructuras, modifica tus cargas o arranca una sesión en vivo.</p>
        </div>
        <button onClick={alIniciarEntrenamiento} style={{ background: '#fff', color: '#1d4ed8', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          🚀 Ir a Mis Rutinas
        </button>
      </div>

      {/* TARJETAS DE INDICADORES (ESTADÍSTICAS) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#4b5563', fontSize: '1.1rem' }}>Total de entrenamientos</h4>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', display: 'block', marginBottom: '5px' }}>
            {datosFinales.entrenamientosSemanales} sesiones
          </span>
          <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.85rem' }}>¡Construyendo disciplina día a día!</p>
        </div>

        <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center', border: '1px solid #e5e7eb' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#4b5563', fontSize: '1.1rem' }}>Último Entrenamiento</h4>
          <span style={{ fontSize: '1.15rem', fontWeight: '600', color: '#1f2937', display: 'block', margin: '10px 0' }}>
            {datosFinales.ultimaRutina}
          </span>
          <div style={{ width: '40px', height: '2px', background: '#e5e7eb', margin: '0 auto' }}></div>
        </div>
      </div>

    </div>
  );
}