import { useState } from 'react';

export default function CatalogoEjercicios() {
  const [busqueda, setBusqueda] = useState("");

  const ejerciciosBase = [
    { id: 1, nombre: "Press de Banca", grupoMuscular: "Pecho", descripcion: "Ejercicio compuesto para desarrollar fuerza y masa muscular en el pectoral." },
    { id: 2, nombre: "Sentadilla Libre", grupoMuscular: "Pierna", descripcion: "El rey de los ejercicios de pierna, enfocado en cuádriceps y glúteos." },
    { id: 3, nombre: "Dominadas", grupoMuscular: "Espalda", descripcion: "Ejercicio de peso corporal excelente para el desarrollo del dorsal ancho." },
    { id: 4, nombre: "Curl de Bíceps con Barra", grupoMuscular: "Brazos", descripcion: "Movimiento de aislamiento para enfocar el esfuerzo en los bíceps." },
    { id: 5, nombre: "Press Militar", grupoMuscular: "Hombros", descripcion: "Empuje vertical para construir hombros fuertes y estables." }
  ];

  const ejerciciosFiltrados = ejerciciosBase.filter(ejercicio =>
    ejercicio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    ejercicio.grupoMuscular.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>📚 Catálogo Global de Ejercicios</h2>
        <p style={{ margin: '0 0 20px 0', color: '#666' }}>Explora los movimientos disponibles para estructurar tus entrenamientos.</p>
        
        <input 
          type="text" 
          placeholder="🔍 Buscar por nombre o grupo muscular (ej. Pecho)..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: '100%', padding: '12px 20px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {ejerciciosFiltrados.length > 0 ? (
          ejerciciosFiltrados.map(ejercicio => (
            <div key={ejercicio.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <span style={{ background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '12px' }}>
                🏷️ {ejercicio.grupoMuscular}
              </span>
              <h3 style={{ margin: '0 0 10px 0', color: '#1a1a1a' }}>{ejercicio.nombre}</h3>
              <p style={{ margin: 0, color: '#555', fontSize: '0.95rem', lineHeight: '1.4' }}>{ejercicio.descripcion}</p>
            </div>
          ))
        ) : (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#999', padding: '40px' }}>No se encontraron ejercicios.</p>
        )}
      </div>
    </div>
  );
}