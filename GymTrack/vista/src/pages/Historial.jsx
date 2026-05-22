import { useState, useEffect } from "react";

export default function Historial() {
    const [sesiones, setSesiones] = useState([]);
    const [cargando, setCargando] = useState(true);

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        if (!usuario) return;
        fetch(`http://localhost:5050/api/sesiones/usuario/${usuario.id}`)
            .then((res) => res.json())
            .then((data) => {
                setSesiones(data);
                setCargando(false);
            })
            .catch(() => setCargando(false));
    }, []);

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
                <h2 style={{ margin: "0 0 10px 0", color: "#dc2626" }}>
                    📅 Historial de Entrenamientos
                </h2>
                <p style={{ color: "#666", margin: "0 0 25px 0" }}>
                    Todas tus sesiones completadas guardadas en la base de
                    datos.
                </p>

                {sesiones.length === 0 ? (
                    <p
                        style={{
                            color: "#999",
                            textAlign: "center",
                            padding: "20px",
                        }}
                    >
                        No tienes entrenamientos registrados aún.
                    </p>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                        }}
                    >
                        {sesiones.map((sesion) => (
                            <div
                                key={sesion.sesionId}
                                style={{
                                    borderLeft: "4px solid #dc2626",
                                    paddingLeft: "15px",
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "0.85rem",
                                        color: "#9ca3af",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {new Date(
                                        sesion.fechaInicio,
                                    ).toLocaleDateString("es-MX", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                                <h3
                                    style={{
                                        margin: "4px 0",
                                        color: "#1f2937",
                                        fontSize: "1.1rem",
                                    }}
                                >
                                    {sesion.rutina?.nombre ||
                                        "Rutina eliminada"}
                                </h3>
                                <p
                                    style={{
                                        margin: 0,
                                        color: "#4b5563",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {sesion.fechaFin ? (
                                        <span
                                            style={{
                                                color: "#059669",
                                                fontWeight: "500",
                                            }}
                                        >
                                            ✅ Completado
                                        </span>
                                    ) : (
                                        <span
                                            style={{
                                                color: "#d97706",
                                                fontWeight: "500",
                                            }}
                                        >
                                            ⏳ En progreso
                                        </span>
                                    )}
                                    {sesion.detalles?.length > 0 &&
                                        ` | ${sesion.detalles.length} ejercicios registrados`}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
