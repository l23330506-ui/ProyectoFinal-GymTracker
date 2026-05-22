import { useState } from 'react';

export default function MisRutinas({ rutinas, setRutinas, onIniciarEntrenamiento }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  
  // Estado para alternar la vista del catálogo dentro del formulario
  const [verCatalogo, setVerCatalogo] = useState(false);

  // Catálogo estático interno que pidieron unificar
  const catalogoEjercicios = [
    "Press de Banca Inclinado",
    "Sentadilla Libre con Barra",
    "Dominadas Supinas",
    "Press Militar con Mancuernas",
    "Peso Muerto Rumano",
    "Curl de Bíceps en Polea"
  ];

  const alternarEjercicio = (ejercicio) => {
    if (ejerciciosSeleccionados.includes(ejercicio)) {
      setEjerciciosSeleccionados(ejerciciosSeleccionados.filter(e => e !== ejercicio));
    } else {
      setEjerciciosSeleccionados([...ejerciciosSeleccionados, ejercicio]);
    }
  };

  const guardarRutina = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

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

    // Limpiar campos
    setNombre('');
    setDescripcion('');
    setEjerciciosSeleccionados([]);
    setVerCatalogo(false);
  };

  const prepararModificacion = (rutina) => {
    setEditandoId(rutina.id);
    setNombre(rutina.nombre);
    setDescripcion(rutina.descripcion);
    setEjerciciosSeleccionados(rutina.ejercicios);
    setVerCatalogo(true);
  };

  const eliminarRutina = (id) => {
    setRutinas(rutinas.filter(r => r.id !== id));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* FORMULARIO DE CREACIÓN/EDICIÓN */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#111827' }}>
          {editandoId ? '✏️ Modificando Rutina' : '📝 Crear Nueva Rutina'}
        </h2>
        
        <form onSubmit={guardarRutina} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>Nombre de la Rutina:</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Rutina de Pierna - Cuádriceps" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '0.9rem' }}>Descripción:</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Notas adicionales..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'sans-serif' }} />
          </div>

          {/* BOTÓN PARA ABRIR EL CATÁLOGO DENTRO DEL FORMULARIO */}
          <div>
            <button type="button" onClick={() => setVerCatalogo(!verCatalogo)} style={{ background: '#4b5563', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
              {verCatalogo ? '🔼 Ocultar Catálogo' : '🔍 + Abrir Catálogo de Ejercicios'}
            </button>
            
            {verCatalogo && (
              <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '10px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#666', fontWeight: 'bold' }}>Selecciona los ejercicios que pertenecerán a esta rutina:</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {catalogoEjercicios.map((ej, idx) => (
                    <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input type="checkbox" checked={ejerciciosSeleccionados.includes(ej)} onChange={() => alternarEjercicio(ej)} />
                      {ej}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="submit" style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            {editandoId ? '💾 Guardar Cambios' : '💾 Crear Rutina'}
          </button>
        </form>
      </div>

      {/* LISTADO DE RUTINAS CON SUS 3 BOTONES */}
      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 20px 0' }}>📋 Mis Estructuras de Rutina</h3>
        
        {rutinas.length === 0 ? (
          <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>No tienes rutinas creadas todavía.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {rutinas.map((rutina) => (
              <div key={rutina.id} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ maxWidth: '60%' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#1f2937' }}>{rutina.nombre}</h4>
                  <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '0.85rem' }}>{rutina.descripcion}</p>
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                    {rutina.ejercicios.map((e, i) => (
                      <span key={i} style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', color: '#374151' }}>{e}</span>
                    ))}
                  </div>
                </div>

                {/* LOS TRES BOTONES PEDIDOS */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => onIniciarEntrenamiento(rutina)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
                    🚀 Iniciar
                  </button>
                  <button onClick={() => prepararModificacion(rutina)} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
                    ✏️ Modificar
                  </button>
                  <button onClick={() => eliminarRutina(rutina.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
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