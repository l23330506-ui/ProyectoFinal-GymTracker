import { useState } from 'react';

export default function EntrenamientoActivo() {
  const [ejercicio, setEjercicio] = useState("Press de Banca");
  const [series, setSeries] = useState([]);
  const [peso, setPeso] = useState("");
  const [reps, setReps] = useState("");

  const agregarSerie = (e) => {
    e.preventDefault();
    if (!peso || !reps) return;
    
    const nuevaSerie = {
      numero: series.length + 1,
      peso: peso,
      repeticiones: reps
    };
    setSeries([...series, nuevaSerie]);
    setPeso("");
    setReps("");
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        
        <h2 style={{ margin: '0 0 10px 0', color: '#1e3a8a' }}> Entrenamiento Activo</h2>
        <p style={{ color: '#666', margin: '0 0 20px 0' }}>Registra tus series de trabajo para la sesión actual.</p>

        <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Seleccionar Ejercicio:</label>
          <select value={ejercicio} onChange={(e) => setEjercicio(e.target.value)} style={{ padding: '6px', borderRadius: '4px' }}>
            <option value="Press de Banca">Press de Banca</option>
            <option value="Sentadillas">Sentadillas</option>
            <option value="Dominadas">Dominadas</option>
          </select>
        </div>

        <form onSubmit={agregarSerie} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input type="number" placeholder="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} style={{ width: '30%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <input type="number" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} style={{ width: '30%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', flexGrow: 1 }}>
            + Agregar Serie
          </button>
        </form>

        <h4 style={{ margin: '15px 0 10px 0' }}>Series Registradas:</h4>
        {series.length === 0 ? (
          <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Ninguna serie anotada en esta sesión todavía.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Serie</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Peso</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Repeticiones</th>
              </tr>
            </thead>
            <tbody>
              {series.map((s) => (
                <tr key={s.numero} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '8px' }}>#{s.numero}</td>
                  <td style={{ padding: '8px' }}>{s.peso} kg</td>
                  <td style={{ padding: '8px' }}>{s.repeticiones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}