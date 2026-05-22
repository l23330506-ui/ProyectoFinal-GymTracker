import { useState } from 'react';

export default function EntrenamientoActivo({ rutinaActiva, onFinalizarEntrenamiento }) {
  const [series, setSeries] = useState([]);
  const [peso, setPeso] = useState('');
  const [reps, setReps] = useState('');
  
  // Por defecto toma el primer ejercicio de la rutina, o uno genérico si no hay rutina seleccionada
  const ejerciciosDisponibles = rutinaActiva && rutinaActiva.ejercicios.length > 0 
    ? rutinaActiva.ejercicios 
    : ["Ejercicio Libre"];

  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState(ejerciciosDisponibles[0]);

  const registrarSerie = (e) => {
    e.preventDefault();
    if (!peso || !reps) return;

    const nueva = {
      ejercicio: ejercicioSeleccionado,
      peso,
      reps
    };
    setSeries([...series, nueva]);
    setPeso('');
    setReps('');
  };

  const concluirSesion = () => {
    if (series.length === 0) {
      alert("⚠️ ¡Anota al menos una serie antes de terminar!");
      return;
    }

    const hoy = new Date();
    const formatoFecha = `${hoy.getDate()} de ${hoy.toLocaleString('es-ES', { month: 'Long' })}, ${hoy.getFullYear()}`;

    const registroHistorial = {
      fecha: formatoFecha,
      rutina: rutinaActiva ? rutinaActiva.nombre : "Sesión Libre Personalizada",
      duracion: `${Math.floor(Math.random() * (70 - 45 + 1)) + 45} mins`, // Simula duración real
      estado: "Completado",
      seriesTotales: series.length
    };

    onFinalizarEntrenamiento(registroHistorial);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0, color: '#1e3a8a' }}>⚡ Entrenamiento Activo</h2>
          {rutinaActiva && <span style={{ background: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>EN VIVO</span>}
        </div>

        <p style={{ color: '#4b5563', margin: '0 0 20px 0' }}>
          {rutinaActiva ? `Entrenando: ${rutinaActiva.nombre}` : "Iniciaste una sesión libre desde la pestaña. Elige tus ejercicios abajo:"}
        </p>

        {/* Formulario de registro de series */}
        <form onSubmit={registrarSerie} style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.85rem' }}>Ejercicio Actual:</label>
            <select value={ejercicioSeleccionado} onChange={(e) => setEjercicioSeleccionado(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', background: '#fff', border: '1px solid #ccc' }}>
              {ejerciciosDisponibles.map((ej, index) => <option key={index} value={ej}>{ej}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="number" placeholder="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} style={{ width: '50%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
            <input type="number" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} style={{ width: '50%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>

          <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Anotar Serie de Trabajo
          </button>
        </form>

        {/* Panel de visualización de series registradas */}
        <h3 style={{ fontSize: '1rem', margin: '20px 0 10px 0' }}>Series de esta sesión:</h3>
        {series.length === 0 ? (
          <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.9rem' }}>Aún no has guardado levantamientos.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '25px' }}>
            {series.map((s, idx) => (
              <div key={idx} style={{ background: '#f9fafb', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ fontWeight: '500' }}>{s.ejercicio}</span>
                <span style={{ color: '#6b7280' }}>Serie {idx + 1}: <b>{s.peso} kg</b> x {s.reps} reps</span>
              </div>
            ))}
          </div>
        )}

        <button onClick={concluirSesion} style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(239,68,68,0.2)' }}>
          🛑 Finalizar Entrenamiento y Archivar
        </button>

      </div>
    </div>
  );
}