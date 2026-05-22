import { useState, useEffect } from "react";

export default function EntrenamientoActivo() {
    const [ejercicios, setEjercicios] = useState([]);
    const [ejercicioId, setEjercicioId] = useState("");
    const [series, setSeries] = useState([]);
    const [peso, setPeso] = useState("");
    const [reps, setReps] = useState("");
    const [sesionId, setSesionId] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [finalizado, setFinalizado] = useState(false);

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        fetch("http://localhost:5050/api/ejercicios")
            .then((res) => res.json())
            .then((data) => {
                setEjercicios(data);
                if (data.length > 0) setEjercicioId(data[0].ejercicioId);
            });

        fetch("http://localhost:5050/api/sesiones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuarioId: usuario?.id, rutinaId: 1 }),
        })
            .then((res) => res.json())
            .then((data) => setSesionId(data.sesionId))
            .catch(() => setMensaje("⚠️ No se pudo iniciar la sesión."));
    }, []);

    const agregarSerie = () => {
        if (!peso || !reps || !sesionId) return;
        const detalle = {
            ejercicioId: parseInt(ejercicioId),
            seriesHechas: 1,
            repsHechas: parseInt(reps),
            pesoKg: parseFloat(peso),
        };
        fetch(`http://localhost:5050/api/sesiones/${sesionId}/detalle`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(detalle),
        })
            .then((res) => res.json())
            .then(() => {
                setSeries([
                    ...series,
                    { numero: series.length + 1, peso, reps, ejercicioId },
                ]);
                setPeso("");
                setReps("");
            })
            .catch(() => setMensaje("❌ Error al guardar la serie."));
    };

    const finalizarEntrenamiento = () => {
        if (!sesionId) return;
        fetch(`http://localhost:5050/api/sesiones/${sesionId}/finalizar`, {
            method: "PUT",
        })
            .then(() => {
                setFinalizado(true);
                setMensaje("✅ ¡Entrenamiento finalizado y guardado!");
            })
            .catch(() => setMensaje("❌ Error al finalizar."));
    };

    const nombreEjercicio = (id) =>
        ejercicios.find((e) => e.ejercicioId === parseInt(id))?.nombre || id;

    if (finalizado)
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "60px",
                    fontFamily: "sans-serif",
                }}
            >
                <h2 style={{ color: "#10b981" }}>
                    🎉 ¡Entrenamiento completado!
                </h2>
                <p style={{ color: "#666" }}>
                    Tu sesión fue guardada en la base de datos.
                </p>
            </div>
        );

    return (
        <div
            style={{
                maxWidth: "600px",
                margin: "0 auto",
                fontFamily: "sans-serif",
                padding: "20px",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}
            >
                <h2 style={{ margin: "0 0 10px 0", color: "#1e3a8a" }}>
                    ⚡ Entrenamiento Activo
                </h2>
                <p style={{ color: "#666", margin: "0 0 20px 0" }}>
                    Registra tus series en tiempo real.
                </p>

                {mensaje && (
                    <p
                        style={{
                            color: mensaje.includes("✅")
                                ? "#065f46"
                                : "#991b1b",
                            marginBottom: "12px",
                        }}
                    >
                        {mensaje}
                    </p>
                )}

                <div
                    style={{
                        background: "#f3f4f6",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                    }}
                >
                    <label
                        style={{
                            fontWeight: "bold",
                            display: "block",
                            marginBottom: "8px",
                        }}
                    >
                        Ejercicio:
                    </label>
                    <select
                        value={ejercicioId}
                        onChange={(e) => setEjercicioId(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                        }}
                    >
                        {ejercicios.map((e) => (
                            <option key={e.ejercicioId} value={e.ejercicioId}>
                                {e.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                    }}
                >
                    <input
                        type="number"
                        placeholder="Peso (kg)"
                        value={peso}
                        onChange={(e) => setPeso(e.target.value)}
                        style={{
                            width: "30%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Reps"
                        value={reps}
                        onChange={(e) => setReps(e.target.value)}
                        style={{
                            width: "30%",
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                        }}
                    />
                    <button
                        onClick={agregarSerie}
                        style={{
                            background: "#10b981",
                            color: "#fff",
                            border: "none",
                            padding: "8px 15px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            flexGrow: 1,
                        }}
                    >
                        + Agregar Serie
                    </button>
                </div>

                {series.length > 0 && (
                    <>
                        <h4 style={{ margin: "0 0 10px 0" }}>
                            Series registradas:
                        </h4>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                marginBottom: "20px",
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        background: "#f9fafb",
                                        borderBottom: "1px solid #e5e7eb",
                                    }}
                                >
                                    <th
                                        style={{
                                            padding: "8px",
                                            textAlign: "left",
                                        }}
                                    >
                                        Serie
                                    </th>
                                    <th
                                        style={{
                                            padding: "8px",
                                            textAlign: "left",
                                        }}
                                    >
                                        Ejercicio
                                    </th>
                                    <th
                                        style={{
                                            padding: "8px",
                                            textAlign: "left",
                                        }}
                                    >
                                        Peso
                                    </th>
                                    <th
                                        style={{
                                            padding: "8px",
                                            textAlign: "left",
                                        }}
                                    >
                                        Reps
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {series.map((s) => (
                                    <tr
                                        key={s.numero}
                                        style={{
                                            borderBottom: "1px solid #f3f4f6",
                                        }}
                                    >
                                        <td style={{ padding: "8px" }}>
                                            #{s.numero}
                                        </td>
                                        <td style={{ padding: "8px" }}>
                                            {nombreEjercicio(s.ejercicioId)}
                                        </td>
                                        <td style={{ padding: "8px" }}>
                                            {s.peso} kg
                                        </td>
                                        <td style={{ padding: "8px" }}>
                                            {s.reps}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                <button
                    onClick={finalizarEntrenamiento}
                    style={{
                        width: "100%",
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        padding: "14px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        fontSize: "1rem",
                        cursor: "pointer",
                    }}
                >
                    🏁 Finalizar Entrenamiento
                </button>
            </div>
        </div>
    );
}
