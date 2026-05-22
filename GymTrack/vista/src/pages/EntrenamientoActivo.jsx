import { useState } from 'react';

export default function EntrenamientoActivo({ rutinaActiva, onFinalizarEntrenamiento, onCancelarEntrenamiento }) {
  // Tomamos los ejercicios asignados a la rutina o uno genérico si entró directo
  const listaEjercicios = rutinaActiva && rutinaActiva.ejercicios.length > 0 
    ? rutinaActiva.ejercicios 
    : ["Ejercicio Libre General"];

  // Índice para saber qué ejercicio está respondiendo el usuario en este momento
  const [indiceEjercicioActual, setIndiceEjercicioActual] = useState(0);
  const ejercicioActual = listaEjercicios[indiceEjercicioActual];

  // Estado para capturar los campos numéricos
  const [peso, setPeso] = useState('');
  const [reps, setReps] = useState('');

  // Aquí se guardan todas las series acumuladas
  const [todasLasSeries, setTodasLasSeries] = useState([]);

  // Añadir una serie al ejercicio que está en pantalla
  const guardarSerie = (e) => {
    e.preventDefault();
    if (!peso || !reps) return;

    const seriesDelMismoEjercicio = todasLasSeries.filter(s => s.ejercicio === ejercicioActual);
    
    const nuevaSerie = {
      ejercicio: ejercicioActual,
      numero: seriesDelMismoEjercicio.length + 1,
      peso: peso,
      reps: reps
    };

    setTodasLasSeries([...todasLasSeries, nuevaSerie]);
    setPeso('');
    setReps('');
  };

  const avanzarSiguienteEjercicio = () => {
    if (indiceEjercicioActual < listaEjercicios.length - 1) {
      setIndiceEjercicioActual(indiceEjercicioActual + 1);
    }
  };

  const regresarEjercicioAnterior = () => {
    if (indiceEjercicioActual > 0) {
      setIndiceEjercicioActual(indiceEjercicioActual - 1);
    }
  };

  // Terminar todo el entrenamiento y mandarlo al historial unificado
  const concluirSesionCompleta = () => {
    if (todasLasSeries.length === 0) {
      alert("⚠️ Debes anotar al menos una serie en todo tu entrenamiento antes de archivar.");
      return;
    }

    const hoy = new Date();
    const nombreMes = hoy.toLocaleString('es-ES', { month: 'long' });
    const formatoFecha = `${hoy.getDate()} de ${nombreMes}, ${hoy.getFullYear()}`;

    const registroHistorial = {
      fecha: formatoFecha,
      rutina: rutinaActiva ? rutinaActiva.nombre : "Sesión Libre Personalizada",
      duracion: `${Math.floor(Math.random() * (75 - 50 + 1)) + 50} mins`,
      estado: "Completado",
      seriesTotales: todasLasSeries.length
    };

    onFinalizarEntrenamiento(registroHistorial);
  };

  // Filtrar las series del ejercicio actual en pantalla para listarlas ordenadamente
  const seriesVisibles = todasLasSeries.filter(s => s.ejercicio === ejercicioActual);

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        
        {/* ENCABEZADO */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0, color: '#1e3a8a' }}>⚡ Módulo de Entrenamiento Activo</h2>
          <span style={{ background: '#fee2e2', color: '#ef4444', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>EN VIVO</span>
        </div>

        <p style={{ color: '#4b5563', margin: '0 0 20px 0', fontSize: '0.95rem' }}>
          <b>Rutina:</b> {rutinaActiva ? rutinaActiva.nombre : "Sesión Libre"} | <b>Progreso:</b> Ejercicio {indiceEjercicioActual + 1} de {listaEjercicios.length}
        </p>

        {/* TARJETA DEL EJERCICIO EN CURSO */}
        <div style={{ background: '#f3f4f6', padding: '20px', borderRadius: '10px', border: '1px solid #e5e7eb', marginBottom: '25px' }}>
          <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 'bold', color: '#2563eb', display: 'block', marginBottom: '4px' }}>Ejecutando Ejercicio Actual:</span>
          <h3 style={{ margin: '0 0 15px 0', color: '#1f2937', fontSize: '1.4rem' }}>{ejercicioActual}</h3>

          {/* Formulario para registrar múltiples series en este ejercicio */}
          <form onSubmit={guardarSerie} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input type="number" placeholder="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} style={{ width: '30%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }} />
            <input type="number" placeholder="Repeticiones" value={reps} onChange={(e) => setReps(e.target.value)} style={{ width: '30%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff' }} />
            <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', flexGrow: 1 }}>
              + Anotar Serie
            </button>
          </form>

          {/* Listado de series de ESTE ejercicio */}
          <h4 style={{ margin: '20px 0 10px 0', fontSize: '0.9rem', color: '#4b5563' }}>Series de este ejercicio:</h4>
          {seriesVisibles.length === 0 ? (
            <p style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.85rem', margin: 0 }}>Ninguna serie guardada para este ejercicio todavía.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {seriesVisibles.map((s, idx) => (
                <div key={idx} style={{ background: '#fff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#2563eb' }}>Serie #{s.numero}</span>
                  <span><b>{s.peso} kg</b> × {s.reps} repeticiones</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CONTROLES DE NAVEGACIÓN ENTRE EJERCICIOS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '20px' }}>
          <button type="button" onClick={regresarEjercicioAnterior} disabled={indiceEjercicioActual === 0} style={{ background: '#9ca3af', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: indiceEjercicioActual === 0 ? 'not-allowed' : 'pointer', opacity: indiceEjercicioActual === 0 ? 0.5 : 1, flexGrow: 1 }}>
            ⬅️ Ejercicio Anterior
          </button>
          
          <button type="button" onClick={avanzarSiguienteEjercicio} disabled={indiceEjercicioActual === listaEjercicios.length - 1} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: indiceEjercicioActual === listaEjercicios.length - 1 ? 'not-allowed' : 'pointer', opacity: indiceEjercicioActual === listaEjercicios.length - 1 ? 0.5 : 1, flexGrow: 1 }}>
            Siguiente Ejercicio ➡️
          </button>
        </div>

        {/* CONTENEDOR DE SALIDA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Botón de Finalizar Exitoso */}
          <button type="button" onClick={concluirSesionCompleta} style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 4px 6px rgba(239,68,68,0.2)' }}>
            🛑 Finalizar Todo el Entrenamiento y Archivar
          </button>

          {/* 🟢 NUEVO BOTÓN: REGRESAR / ELIMINAR PROGRESO ACTUAL */}
          <button 
            type="button" 
            onClick={() => {
              if (confirm("⚠️ ¿Estás seguro de que quieres salir? Se borrará el progreso de esta sesión actual y no se guardará en el historial.")) {
                onCancelarEntrenamiento();
              }
            }} 
            style={{ width: '100%', background: '#4b5563', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            ❌ Cancelar Sesión / Regresar a Mis Rutinas
          </button>
        </div>

      </div>
    </div>
  );
}