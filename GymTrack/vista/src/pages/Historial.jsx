import { useState, useEffect } from "react";

export default function Historial() {
    const [sesiones, setSesiones] = useState([]);
    const [sesionDetalle, setSesionDetalle] = useState(null);
    const [cargando, setCargando] = useState(true);

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        if (!usuario) return;
        fetch(`http://localhost:5050/api/sesiones/usuario/${usuario.id}`)
            .then((res) => res.json())
            .then((data) => {
                setSesiones(data.filter((s) => s.fechaFin !== null));
                setCargando(false);
            })
            .catch(() => setCargando(false));
    }, []);

    const calcularDuracion = (inicio, fin) => {
        const diff = Math.floor((new Date(fin) - new Date(inicio)) / 1000);
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        if (h > 0) return `${h}h ${m}m`;
        if (m > 0) return `${m}m ${s}s`;
        return `${s}s`;
    };

    const verDetalle = (sesion) => {
        setSesionDetalle(
            sesionDetalle?.sesionId === sesion.sesionId ? null : sesion,
        );
    };

    if (cargando)
        return (
            <div
                style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
                ⏳ Cargando historial...
            </div>
        );

    return (
        <div
            style={{
                maxWidth: "700px",
                margin: "0 auto",
                fontFamily: "sans-serif",
            }}
        >
            <h2 style={{ color: "#1a1a1a", marginBottom: "20px" }}>
                📅 Historial de Entrenamientos
            </h2>

            {sesiones.length === 0 ? (
                <div
                    style={{
                        background: "#fff",
                        padding: "40px",
                        borderRadius: "12px",
                        textAlign: "center",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    }}
                >
                    <p style={{ color: "#9ca3af" }}>
                        No tienes entrenamientos completados aún.
                    </p>
                </div>
            ) : (
                sesiones.map((sesion) => (
                    <div
                        key={sesion.sesionId}
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
                                padding: "16px 20px",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                }}
                            >
                                <div>
                                    <h4
                                        style={{
                                            margin: "0 0 4px 0",
                                            color: "#fff",
                                            fontSize: "1.1rem",
                                        }}
                                    >
                                        {sesion.rutina?.nombre ||
                                            "Rutina eliminada"}
                                    </h4>
                                    <p
                                        style={{
                                            margin: 0,
                                            color: "rgba(255,255,255,0.75)",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {new Date(
                                            sesion.fechaInicio,
                                        ).toLocaleDateString("es-MX", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <span
                                        style={{
                                            background: "rgba(255,255,255,0.2)",
                                            color: "#fff",
                                            padding: "4px 10px",
                                            borderRadius: "20px",
                                            fontSize: "0.8rem",
                                            fontWeight: "500",
                                            display: "block",
                                            marginBottom: "4px",
                                        }}
                                    >
                                        ✅ Completado
                                    </span>
                                    <span
                                        style={{
                                            color: "rgba(255,255,255,0.75)",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        ⏱️{" "}
                                        {calcularDuracion(
                                            sesion.fechaInicio,
                                            sesion.fechaFin,
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                padding: "12px 20px",
                                background: "#f9fafb",
                                borderBottom: "1px solid #f3f4f6",
                                display: "flex",
                                gap: "20px",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <span
                                style={{
                                    color: "#6b7280",
                                    fontSize: "0.85rem",
                                }}
                            >
                                🏋️ {sesion.detalles?.length || 0} series
                                registradas
                            </span>
                            <button
                                onClick={() => verDetalle(sesion)}
                                style={{
                                    background: "#eff6ff",
                                    color: "#2563eb",
                                    border: "none",
                                    padding: "6px 14px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                    fontSize: "0.85rem",
                                }}
                            >
                                {sesionDetalle?.sesionId === sesion.sesionId
                                    ? "🔼 Ocultar"
                                    : "🔍 Ver detalle"}
                            </button>
                        </div>

                        {sesionDetalle?.sesionId === sesion.sesionId &&
                            sesion.detalles?.length > 0 && (
                                <div style={{ padding: "16px 20px" }}>
                                    {Object.entries(
                                        sesion.detalles.reduce((acc, d) => {
                                            const nombre =
                                                d.ejercicio?.nombre ||
                                                "Ejercicio";
                                            if (!acc[nombre]) acc[nombre] = [];
                                            acc[nombre].push(d);
                                            return acc;
                                        }, {}),
                                    ).map(([nombreEj, detalles]) => (
                                        <div
                                            key={nombreEj}
                                            style={{
                                                marginBottom: "16px",
                                                background: "#f9fafb",
                                                borderRadius: "10px",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    background: "#eff6ff",
                                                    padding: "10px 14px",
                                                    borderBottom:
                                                        "1px solid #dbeafe",
                                                }}
                                            >
                                                <h5
                                                    style={{
                                                        margin: 0,
                                                        color: "#1d4ed8",
                                                        fontSize: "0.95rem",
                                                    }}
                                                >
                                                    {nombreEj}
                                                </h5>
                                            </div>
                                            <div
                                                style={{ padding: "10px 14px" }}
                                            >
                                                {detalles.map((d, i) => (
                                                    <div
                                                        key={d.detalleId}
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "space-between",
                                                            padding: "6px 0",
                                                            borderBottom:
                                                                i <
                                                                detalles.length -
                                                                    1
                                                                    ? "1px solid #f3f4f6"
                                                                    : "none",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                color: "#6b7280",
                                                                fontSize:
                                                                    "0.85rem",
                                                            }}
                                                        >
                                                            Serie {i + 1}
                                                        </span>
                                                        <span
                                                            style={{
                                                                color: "#1f2937",
                                                                fontSize:
                                                                    "0.85rem",
                                                                fontWeight:
                                                                    "500",
                                                            }}
                                                        >
                                                            {d.pesoKg} kg ×{" "}
                                                            {d.repsHechas} reps
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>
                ))
            )}
        </div>
    );
}
