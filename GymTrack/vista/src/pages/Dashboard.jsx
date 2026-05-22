import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [sesiones, setSesiones] = useState([]);
    const [cargando, setCargando] = useState(true);

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        if (!usuario) {
            navigate("/login");
            return;
        }
        fetch(`http://localhost:5050/api/sesiones/usuario/${usuario.id}`)
            .then((res) => res.json())
            .then((data) => {
                setSesiones(data);
                setCargando(false);
            })
            .catch(() => setCargando(false));
    }, []);

    const ultimaSesion =
        sesiones.length > 0 ? sesiones[sesiones.length - 1] : null;

    if (cargando)
        return (
            <div
                style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
                ⏳ Cargando...
            </div>
        );

    return (
        <div
            style={{
                maxWidth: "800px",
                margin: "0 auto",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    marginBottom: "20px",
                }}
            >
                <h1 style={{ margin: "0 0 10px 0", color: "#1a1a1a" }}>
                    ¡Hola de nuevo, {usuario?.nombre}! 👋
                </h1>
                <p style={{ margin: 0, color: "#666", fontSize: "1.1rem" }}>
                    ¿Listo para superar tus límites hoy?
                </p>
            </div>

            <div
                style={{
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 15px rgba(37,99,235,0.3)",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div>
                    <h2 style={{ margin: "0 0 10px 0" }}>¿Entrenamos hoy?</h2>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                        Registra tus series, repeticiones y pesos en tiempo
                        real.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/entrenar")}
                    style={{
                        background: "#fff",
                        color: "#2563eb",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "1rem",
                    }}
                >
                    🚀 Iniciar Entrenamiento
                </button>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    }}
                >
                    <h3 style={{ margin: "0 0 10px 0", color: "#444" }}>
                        Total de entrenamientos
                    </h3>
                    <p
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            margin: "0 0 5px 0",
                            color: "#10b981",
                        }}
                    >
                        {sesiones.length} sesiones
                    </p>
                    <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                        ¡Construyendo disciplina día a día!
                    </p>
                </div>

                <div
                    style={{
                        background: "#fff",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    }}
                >
                    <h3 style={{ margin: "0 0 10px 0", color: "#444" }}>
                        Último Entrenamiento
                    </h3>
                    <p
                        style={{
                            fontSize: "1.05rem",
                            fontWeight: "500",
                            margin: "0 0 5px 0",
                            color: "#1a1a1a",
                        }}
                    >
                        {ultimaSesion
                            ? ultimaSesion.rutina?.nombre
                            : "Sin entrenamientos aún"}
                    </p>
                    <p style={{ margin: 0, color: "#888", fontSize: "0.9rem" }}>
                        {ultimaSesion
                            ? new Date(
                                  ultimaSesion.fechaInicio,
                              ).toLocaleDateString()
                            : "—"}
                    </p>
                </div>
            </div>
        </div>
    );
}
