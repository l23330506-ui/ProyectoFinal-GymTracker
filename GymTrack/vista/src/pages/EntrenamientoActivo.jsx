import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EntrenamientoActivo() {
    const { rutinaId } = useParams();
    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const [rutina, setRutina] = useState(null);
    const [sesionId, setSesionId] = useState(null);
    const [sesionIniciada, setSesionIniciada] = useState(false);
    const [finalizado, setFinalizado] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [segundos, setSegundos] = useState(0);
    const [timerActivo, setTimerActivo] = useState(false);
    const [mostrarConfirm, setMostrarConfirm] = useState(false);

    const [registros, setRegistros] = useState({});

    useEffect(() => {
        fetch(`http://localhost:5050/api/rutinas/${rutinaId}`)
            .then((res) => res.json())
            .then((data) => {
                setRutina(data);
                const init = {};
                data.rutinaEjercicios?.forEach((re) => {
                    init[re.ejercicioId] = Array.from(
                        { length: re.series },
                        (_, i) => ({
                            serie: i + 1,
                            reps: re.repeticiones,
                            peso: "",
                        }),
                    );
                });
                setRegistros(init);
            });

        fetch("http://localhost:5050/api/sesiones", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuarioId: usuario?.id,
                rutinaId: parseInt(rutinaId),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setSesionId(data.sesionId);
                setSesionIniciada(true);
                setTimerActivo(true);
                setMensaje("✅ Sesión iniciada. ¡A entrenar!");
            })
            .catch(() => setMensaje("❌ Error al iniciar la sesión."));
    }, []);

    useEffect(() => {
        let intervalo;
        if (timerActivo) {
            intervalo = setInterval(() => {
                setSegundos((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(intervalo);
    }, [timerActivo]);

    const formatearTiempo = (segs) => {
        const h = Math.floor(segs / 3600);
        const m = Math.floor((segs % 3600) / 60);
        const s = segs % 60;
        if (h > 0) return `${h}h ${m}m ${s}s`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    const actualizarRegistro = (ejercicioId, serieIndex, campo, valor) => {
        setRegistros((prev) => ({
            ...prev,
            [ejercicioId]: prev[ejercicioId].map((s, i) =>
                i === serieIndex ? { ...s, [campo]: valor } : s,
            ),
        }));
    };

    const finalizarEntrenamiento = async () => {
        if (!sesionId) return;

        const haySeriesDone = Object.values(registros).some((series) =>
            series.some((s) => s.done && s.peso && parseFloat(s.peso) > 0),
        );

        if (!haySeriesDone) {
            setMensaje(
                "⚠️ Marca al menos una serie como completada antes de finalizar.",
            );
            return;
        }

        for (const ejercicioId of Object.keys(registros)) {
            for (const serie of registros[ejercicioId]) {
                if (serie.done && serie.peso && parseFloat(serie.peso) > 0) {
                    await fetch(
                        `http://localhost:5050/api/sesiones/${sesionId}/detalle`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                ejercicioId: parseInt(ejercicioId),
                                seriesHechas: 1,
                                repsHechas: parseInt(serie.reps),
                                pesoKg: parseFloat(serie.peso),
                            }),
                        },
                    );
                }
            }
        }

        await fetch(
            `http://localhost:5050/api/sesiones/${sesionId}/finalizar`,
            { method: "PUT" },
        );
        setTimerActivo(false);
        setFinalizado(true);
    };

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
                <button
                    onClick={() => navigate("/historial")}
                    style={{
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginTop: "20px",
                    }}
                >
                    📅 Ver Historial
                </button>
            </div>
        );

    if (!rutina)
        return (
            <div
                style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
                ⏳ Cargando entrenamiento...
            </div>
        );

    return (
        <div
            style={{
                maxWidth: "700px",
                padding: "20px",
                margin: "0 auto",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h2 style={{ margin: 0, color: "#1e3a8a" }}>
                    ⚡ {rutina.nombre}
                </h2>
                {sesionIniciada && (
                    <div
                        style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: "8px",
                            padding: "10px 16px",
                            marginBottom: "20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <span style={{ fontSize: "1.2rem" }}>⏱️</span>
                        <span
                            style={{
                                fontSize: "1.3rem",
                                fontWeight: "bold",
                                color: "#15803d",
                                fontFamily: "monospace",
                            }}
                        >
                            {formatearTiempo(segundos)}
                        </span>
                        <span style={{ color: "#166534", fontSize: "0.85rem" }}>
                            tiempo de entrenamiento
                        </span>
                    </div>
                )}
                {sesionIniciada && (
                    <span
                        style={{
                            background: "#fee2e2",
                            color: "#ef4444",
                            padding: "4px 10px",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                        }}
                    >
                        EN VIVO
                    </span>
                )}
            </div>

            {mensaje && (
                <p
                    style={{
                        color: mensaje.includes("✅") ? "#065f46" : "#991b1b",
                        marginBottom: "16px",
                    }}
                >
                    {mensaje}
                </p>
            )}

            {rutina.rutinaEjercicios?.map((re) => (
                <div
                    key={re.ejercicioId}
                    style={{
                        background: "#fff",
                        borderRadius: "12px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        marginBottom: "16px",
                        overflow: "hidden",
                    }}
                >
                    <div
                        style={{
                            background:
                                "linear-gradient(135deg, #1e3a8a, #2563eb)",
                            padding: "14px 20px",
                        }}
                    >
                        <h4
                            style={{
                                margin: 0,
                                color: "#fff",
                                fontSize: "1rem",
                            }}
                        >
                            {re.ejercicio?.nombre}
                        </h4>
                        <p
                            style={{
                                margin: "4px 0 0 0",
                                color: "rgba(255,255,255,0.75)",
                                fontSize: "0.8rem",
                            }}
                        >
                            {re.series} series · {re.repeticiones} reps
                            sugeridas
                        </p>
                    </div>

                    <div style={{ padding: "16px 20px" }}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "40px 1fr 1fr 60px",
                                gap: "8px",
                                marginBottom: "8px",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.8rem",
                                    color: "#6b7280",
                                    fontWeight: "bold",
                                }}
                            >
                                Serie
                            </span>
                            <span
                                style={{
                                    fontSize: "0.8rem",
                                    color: "#6b7280",
                                    fontWeight: "bold",
                                }}
                            >
                                Peso (kg)
                            </span>
                            <span
                                style={{
                                    fontSize: "0.8rem",
                                    color: "#6b7280",
                                    fontWeight: "bold",
                                }}
                            >
                                Reps
                            </span>
                            <span
                                style={{
                                    fontSize: "0.8rem",
                                    color: "#6b7280",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                Done
                            </span>
                        </div>

                        {registros[re.ejercicioId]?.map((s, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "40px 1fr 1fr 60px",
                                    gap: "8px",
                                    marginBottom: "8px",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{
                                        background: "#eff6ff",
                                        color: "#1d4ed8",
                                        borderRadius: "50%",
                                        width: "28px",
                                        height: "28px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "0.85rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {s.serie}
                                </span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    min="0"
                                    value={s.peso}
                                    onChange={(e) =>
                                        actualizarRegistro(
                                            re.ejercicioId,
                                            i,
                                            "peso",
                                            e.target.value,
                                        )
                                    }
                                    style={{
                                        padding: "8px",
                                        borderRadius: "6px",
                                        border: "1px solid #ddd",
                                        fontSize: "0.95rem",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                />
                                <input
                                    type="number"
                                    min="0"
                                    value={s.reps}
                                    onChange={(e) =>
                                        actualizarRegistro(
                                            re.ejercicioId,
                                            i,
                                            "reps",
                                            e.target.value,
                                        )
                                    }
                                    style={{
                                        padding: "8px",
                                        borderRadius: "6px",
                                        border: "1px solid #ddd",
                                        fontSize: "0.95rem",
                                        width: "100%",
                                        boxSizing: "border-box",
                                    }}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={s.done || false}
                                        onChange={(e) =>
                                            actualizarRegistro(
                                                re.ejercicioId,
                                                i,
                                                "done",
                                                e.target.checked,
                                            )
                                        }
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            cursor: "pointer",
                                            accentColor: "#10b981",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <button
                onClick={finalizarEntrenamiento}
                style={{
                    width: "100%",
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    padding: "16px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    fontSize: "1.1rem",
                    cursor: "pointer",
                    marginTop: "8px",
                }}
            >
                🛑 Finalizar Entrenamiento
            </button>
            <button
                onClick={() => setMostrarConfirm(true)}
                style={{
                    width: "100%",
                    background: "#f3f4f6",
                    color: "#6b7280",
                    border: "none",
                    padding: "12px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    marginTop: "8px",
                }}
            >
                ❌ Descartar entrenamiento
            </button>

            {mostrarConfirm && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: "16px",
                            padding: "32px",
                            maxWidth: "400px",
                            width: "90%",
                            textAlign: "center",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        }}
                    >
                        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>
                            ⚠️
                        </div>
                        <h3
                            style={{
                                margin: "0 0 8px 0",
                                color: "#1f2937",
                                fontSize: "1.2rem",
                            }}
                        >
                            ¿Descartar entrenamiento?
                        </h3>
                        <p
                            style={{
                                margin: "0 0 24px 0",
                                color: "#6b7280",
                                fontSize: "0.95rem",
                            }}
                        >
                            No se guardará ningún progreso de esta sesión.
                        </p>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                onClick={() => setMostrarConfirm(false)}
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    background: "#fff",
                                    color: "#4b5563",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "0.95rem",
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={async () => {
                                    if (sesionId)
                                        await fetch(
                                            `http://localhost:5050/api/sesiones/${sesionId}`,
                                            { method: "DELETE" },
                                        );
                                    navigate("/rutinas");
                                }}
                                style={{
                                    flex: 1,
                                    padding: "12px",
                                    borderRadius: "8px",
                                    border: "none",
                                    background: "#ef4444",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    fontSize: "0.95rem",
                                }}
                            >
                                Sí, descartar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
