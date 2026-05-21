import { useState } from 'react';

export default function MisRutinas() {
  // Estados para el formulario
  const [nombreRutina, setNombreRutina] = useState("");
  const [enfoque, setEnfoque] = useState("Hipertrofia");
  const [descripcion, setDescripcion] = useState("");
  
  // Estados para la respuesta de la API
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });

  const elSubmit = (e) => {
    e.preventDefault();
    
    if (!nombreRutina.trim()) {
      setMensaje({ texto: "⚠️ Por favor, ponle un nombre a tu rutina.", tipo: "error" });
      return;
    }

    setEnviando(true);
    setMensaje({ texto: "", tipo: "" });

    // Objeto con la estructura limpia para C#
    const nuevaRutina = {
      nombre: nombreRutina,
      enfoqueMuscular: enfoque,
      descripcion: descripcion,
      fechaCreacion: new Date().toISOString()
    };

    // Petición POST real a la API en el puerto 5050
    fetch('http://localhost:5050/api/rutinas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaRutina)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('El servidor de la API rechazó la petición (revisa CORS)');
      }
      return response.json();
    })
    .then(data => {
      setMensaje({ texto: "✅ ¡Rutina guardada con éxito en la base de datos!", tipo: "exito" });
      // Limpiar formulario
      setNombreRutina("");
      setDescripcion("");
      setEnviando(false);
    })
    .catch(err => {
      console.error(err);
      // Respaldo visual simulado inteligente para que puedas testear la UI de inmediato
      setMensaje({ 
        texto: `⚙️ FrontEnd Listo: Simulación local completada. (API en puerto 5050 no procesó por CORS u offline).`, 
        tipo: "simulado" 
      });
      setEnviando(false);
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb' }}>
        
        <h2 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>📝 Crear Nueva Rutina Personalizada</h2>
        <p style={{ margin: '0 0 25px 0', color: '#666', fontSize: '0.95rem' }}>
          Diseña tu estructura de entrenamiento. Al guardar, se enviará directo al endpoint de .NET.
        </p>

        {/* Alertas dinámicas */}
        {mensaje.texto && (
          <div style={{ 
            padding: '12px 16px', 
            borderRadius: '8px', 
            marginBottom: '20px', 
            fontSize: '0.9rem',
            fontWeight: '500',
            background: mensaje.tipo === 'exito' ? '#d1fae5' : mensaje.tipo === 'error' ? '#fee2e2' : '#fef3c7',
            color: mensaje.tipo === 'exito' ? '#065f46' : mensaje.tipo === 'error' ? '#991b1b' : '#92400e',
            border: `1px solid ${mensaje.tipo === 'exito' ? '#a7f3d0' : mensaje.tipo === 'error' ? '#fca5a5' : '#fde68a'}`
          }}>
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={elSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444', fontSize: '0.9rem' }}>Nombre de la Rutina:</label>
            <input 
              type="text"
              placeholder="Ej. Empuje - Pecho/Hombro/Tríceps"
              value={nombreRutina}
              onChange={(e) => setNombreRutina(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444', fontSize: '0.9rem' }}>Enfoque u Objetivo:</label>
            <select
              value={enfoque}
              onChange={(e) => setEnfoque(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1rem', background: '#fff' }}
            >
              <option value="Hipertrofia">🔥 Hipertrofia (Ganancia muscular)</option>
              <option value="Fuerza">💪 Fuerza Maxima (RPT)</option>
              <option value="Resistencia">🏃‍♂️ Resistencia / Cardio</option>
              <option value="Definición">✂️ Definición / Tonificación</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444', fontSize: '0.9rem' }}>Notas o Descripción (Opcional):</label>
            <textarea 
              rows="3"
              placeholder="Anota los días de descanso o indicaciones especiales..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '1rem', fontFamily: 'sans-serif', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            style={{ 
              background: enviando ? '#93c5fd' : '#2563eb', 
              color: '#fff', 
              border: 'none', 
              padding: '14px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              fontSize: '1rem', 
              cursor: enviando ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {enviando ? "💾 Guardando..." : "💾 Guardar Rutina en API"}
          </button>

        </form>

      </div>
    </div>
  );
}