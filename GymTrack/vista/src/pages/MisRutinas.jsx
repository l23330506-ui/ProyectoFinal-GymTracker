import { useState } from 'react';

export default function MisRutinas({ rutinas, setRutinas, onIniciarEntrenamiento }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [verCatalogo, setVerCatalogo] = useState(false);

  // Catálogo estático unificado para construir las rutinas
  const catalogoEjercicios = [
    "Press de Banca Inclinado",
    "Sentadilla Libre con Barra",
    "Dominadas Supinas",
    "Press Militar con Mancuernas",
    "Peso Muerto Rumano",
    "Curl de Bíceps en Polea"
  ];

  // Alternar la selección de ejercicios mediante los checkboxes del catálogo
  const alternarEjercicio = (ejercicio) => {
    if (ejerciciosSeleccionados.includes(ejercicio)) {
      setEjerciciosSeleccionados(ejerciciosSeleccionados.filter(e => e !== ejercicio));
    } else {
      setEjerciciosSeleccionados([...ejerciciosSeleccionados, ejercicio]);
    }
  };

  // Guardar la rutina (creación o modificación)
  const guardarRutina = (e) => {
    e.preventDefault();
    if (!nombre.trim() || ejerciciosSeleccionados.length === 0) {
      alert("⚠️ Asigna un nombre y selecciona al menos un ejercicio del catálogo.");
      return;
    }

    if (editandoId) {
      // Modo Edición / Modificar
      setRutinas(rutinas.map(r => r.id === editandoId ? { ...r, nombre, descripcion, ejercicios: ejerciciosSeleccionados } : r));
      setEditandoId(null);
    } else {
      // Modo Crear Nueva Rutina
      const nueva = {
        id: Date.now(),
        nombre,
        descripcion,
        ejercicios: ejerciciosSeleccionados
      };
      setRutinas([...rutinas, nueva]);
    }

    // Resetear el formulario tras guardar
    setNombre('');
    setDescripcion('');
    setEjerciciosSeleccionados([]);
    setVerCatalogo(false);
  };

  // Cargar los datos de la rutina seleccionada en el formulario para editarla
  const prepararModificacion = (rutina) => {
    setEditandoId(rutina.id);
    setNombre(rutina.nombre);
    setDescripcion(rutina.descripcion);
    setEjerciciosSeleccionados(rutina.ejercicios);
    setVerCatalogo(true); // Abre el catálogo automáticamente para ver qué tenía marcado
  };

  // Eliminar rutina del estado global
  const eliminarRutina = (id) => {
    setRutinas(rutinas.filter(r => r.id !== id));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px', fontFamily: 'sans-serif' }}>
      
      {/* CARD 1: FORMULARIO DE CREACIÓN / EDICIÓN */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#111827' }}>
          {editandoId ? '✏️ Modificando Rutina' : '📝 Crear Nueva Rutina'}
        </h2>
        
        <form onSubmit={guardarRutina} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>Nombre de la Rutina:</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ej. Tirón - Hipertrofia" 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>Descripción / Notas:</label>
            <textarea 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              placeholder="Notas adicionales (enfoque, RPE, descansos)..." 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'sans-serif' }} 
            />
          </div>

          {/* DESPLEGABLE DEL CATÁLOGO DE EJERCICIOS */}
          <div>
            <button 
              type="button" 
              onClick={() => setVerCatalogo(!verCatalogo)} 
              style={{ background: '#4b5563', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
            >
              {verCatalogo ? '🔼 Ocultar Catálogo' : '🔍 + Seleccionar Múltiples Ejercicios'}
            </button>
            
            {verCatalogo && (
              <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '10px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#666', fontWeight: 'bold' }}>Marca todos los ejercicios que harás en esta rutina:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {catalogoEjercicios.map((ej, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox" 
                        checked={ejerciciosSeleccionados.includes(ej)} 
                        onChange={() => alternarEjercicio(ej)} 
                      />
                      {ej}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CONTENEDOR DE BOTONES (GUARDAR Y REGRESAR) */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <button 
              type="submit" 
              style={{ 
                background: '#2563eb', 
                color: '#fff', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '6px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                flexGrow: 2 
              }}
            >
              {editandoId ? '💾 Guardar Cambios' : '💾 Crear Rutina'}
            </button>

            <button 
              type="button" 
              onClick={() => {
                // Limpia y restablece el formulario por completo al retroceder
                setNombre('');
                setDescripcion('');
                setEjerciciosSeleccionados([]);
                setVerCatalogo(false);
                setEditandoId(null);
              }} 
              style={{ 
                background: '#9ca3af', 
                color: '#fff', 
                border: 'none', 
                padding: '12px', 
                borderRadius: '6px', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                flexGrow: 1 
              }}
            >
              ❌ Regresar / Cancelar
            </button>
          </div>

        </form>
      </div>

      {/* CARD 2: LISTADO DE ESTRUCTURAS DE RUTINAS COMPAÑERA */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#111827' }}>📋 Mis Estructuras de Rutina</h3>
        
        {rutinas.length === 0 ? (
          <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No tienes rutinas creadas todavía.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {rutinas.map((rutina) => (
              <div key={rutina.id} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ maxWidth: '65%' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#1f2937', fontSize: '1.1rem' }}>{rutina.nombre}</h4>
                  <p style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: '0.85rem' }}>{rutina.descripcion}</p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {rutina.ejercicios.map((e, i) => (
                      <span key={i} style={{ background: '#3b82f6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#fff', fontWeight: '500' }}>{e}</span>
                    ))}
                  </div>
                </div>

                {/* LOS 3 BOTONES COMPAÑERA (INICIAR, MODIFICAR, BORRAR) */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => onIniciarEntrenamiento(rutina)} 
                    style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    🚀 Iniciar
                  </button>
                  <button 
                    onClick={() => prepararModificacion(rutina)} 
                    style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    ✏️ Modificar
                  </button>
                  <button 
                    onClick={() => eliminarRutina(rutina.id)} 
                    style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    🗑️ Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}