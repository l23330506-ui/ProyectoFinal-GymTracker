export default function Historial() {
  // Simulamos un historial limpio que luego consumirá los datos desde C#
  const entrenamientosPasados = [
    { fecha: "20 de Mayo, 2026", rutina: "Empuje (Pecho/Hombro)", duracion: "55 mins", estado: "Completado" },
    { fecha: "18 de Mayo, 2026", rutina: "Tracción (Espalda/Bíceps)", duracion: "65 mins", estado: "Completado" },
    { fecha: "15 de Mayo, 2026", rutina: "Pierna Completa", duracion: "50 mins", estado: "Completado" }
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        
        <h2 style={{ margin: '0 0 10px 0', color: '#dc2626' }}> Historial de Entrenamientos</h2>
        <p style={{ color: '#666', margin: '0 0 25px 0' }}>Línea de tiempo de tus sesiones completadas guardadas en el sistema.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {entrenamientosPasados.map((item, index) => (
            <div key={index} style={{ borderLeft: '4px solid #dc2626', paddingLeft: '15px', margin: '5px 0' }}>
              <span style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 'bold' }}>{item.fecha}</span>
              <h3 style={{ margin: '4px 0', color: '#1f2937', fontSize: '1.1rem' }}>{item.rutina}</h3>
              <p style={{ margin: '0', color: '#4b5563', fontSize: '0.9rem' }}>
                 Duración: {item.duracion} | <span style={{ color: '#059669', fontWeight: '500' }}>{item.estado}</span>
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}