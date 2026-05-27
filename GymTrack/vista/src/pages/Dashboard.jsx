import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [sesiones, setSesiones] = useState([]);
    const [rutinas, setRutinas] = useState([]);
    const [rutinaSeleccionada, setRutinaSeleccionada] = useState("");
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

        fetch("http://localhost:5050/api/rutinas")
            .then((res) => res.json())
            .then((data) => {
                const misRutinas = data.filter(
                    (r) => r.usuarioId === usuario?.id,
                );
                setRutinas(misRutinas);
                if (misRutinas.length > 0)
                    setRutinaSeleccionada(misRutinas[0].rutinaId);
            })
            .catch(() => {});
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
                maxWidth: "1000px",
                margin: "0 auto",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "35px 30px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    marginBottom: "25px",
                    textAlign: "center",
                }}
            >
                <h1
                    style={{
                        margin: "0 0 12px 0",
                        color: "#1a1a1a",
                        fontSize: "2rem",
                        fontWeight: "bold",
                    }}
                >
                    ¡Hola de nuevo, {usuario?.nombre}! 👋
                </h1>
                <p style={{ margin: 0, color: "#666", fontSize: "1.1rem" }}>
                    ¿Listo para superar tus límites hoy?
                </p>
            </div>

            <div
                style={{
                    background: "#1d4ed8",
                    padding: "25px",
                    borderRadius: "12px",
                    marginBottom: "25px",
                    boxShadow: "0 4px 10px rgba(29,78,216,0.3)",
                }}
            >
                <h3
                    style={{
                        margin: "0 0 16px 0",
                        color: "#fff",
                        fontSize: "1.4rem",
                    }}
                >
                    ¿Entrenamos hoy?
                </h3>

                {rutinas.length === 0 ? (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color: "rgba(255,255,255,0.85)",
                            }}
                        >
                            No tienes rutinas creadas aún.
                        </p>
                        <button
                            onClick={() => navigate("/rutinas")}
                            style={{
                                background: "#fff",
                                color: "#1d4ed8",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "8px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            + Crear rutina
                        </button>
                    </div>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                        }}
                    >
                        <select
                            value={rutinaSeleccionada}
                            onChange={(e) =>
                                setRutinaSeleccionada(e.target.value)
                            }
                            style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "8px",
                                border: "none",
                                fontSize: "1rem",
                                background: "rgba(255,255,255,0.15)",
                                color: "#fff",
                            }}
                        >
                            {rutinas.map((r) => (
                                <option
                                    key={r.rutinaId}
                                    value={r.rutinaId}
                                    style={{ color: "#000" }}
                                >
                                    {r.nombre}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() =>
                                navigate(`/entrenar/${rutinaSeleccionada}`)
                            }
                            style={{
                                background: "#fff",
                                color: "#1d4ed8",
                                border: "none",
                                padding: "12px 20px",
                                borderRadius: "8px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                            }}
                        >
                            🚀 Iniciar
                        </button>
                    </div>
                )}
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
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                        textAlign: "center",
                    }}
                >
                    <h4 style={{ margin: "0 0 10px 0", color: "#4b5563" }}>
                        Total de entrenamientos
                    </h4>
                    <span
                        style={{
                            fontSize: "2rem",
                            fontWeight: "bold",
                            color: "#10b981",
                            display: "block",
                            marginBottom: "5px",
                        }}
                    >
                        {sesiones.length} sesiones
                    </span>
                    <p
                        style={{
                            margin: 0,
                            color: "#9ca3af",
                            fontSize: "0.85rem",
                        }}
                    >
                        ¡Construyendo disciplina día a día!
                    </p>
                </div>

                <div
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                        textAlign: "center",
                    }}
                >
                    <h4 style={{ margin: "0 0 10px 0", color: "#4b5563" }}>
                        Último Entrenamiento
                    </h4>
                    <span
                        style={{
                            fontSize: "1.1rem",
                            fontWeight: "600",
                            color: "#1f2937",
                            display: "block",
                            margin: "10px 0",
                        }}
                    >
                        {ultimaSesion
                            ? ultimaSesion.rutina?.nombre
                            : "Sin entrenamientos aún"}
                    </span>
                    <p
                        style={{
                            margin: 0,
                            color: "#9ca3af",
                            fontSize: "0.85rem",
                        }}
                    >
                        {ultimaSesion
                            ? new Date(
                                  ultimaSesion.fechaInicio,
                              ).toLocaleDateString("es-MX")
                            : "—"}
                    </p>
                </div>
            </div>
        </div>
    );
}
