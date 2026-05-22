import { useState, useEffect } from "react";

export default function MisRutinas() {
    const [rutinas, setRutinas] = useState([]);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);

    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const cargarRutinas = () => {
        fetch("http://localhost:5050/api/rutinas")
            .then((res) => res.json())
            .then((data) => {
                const misRutinas = data.filter(
                    (r) => r.usuarioId === usuario?.id,
                );
                setRutinas(misRutinas);
                setCargando(false);
            })
            .catch(() => setCargando(false));
    };

    useEffect(() => {
        cargarRutinas();
    }, []);

    const crearRutina = () => {
        if (!nombre.trim()) {
            setMensaje("⚠️ Ponle un nombre a la rutina.");
            return;
        }
        const nuevaRutina = { nombre, descripcion, usuarioId: usuario?.id };
        fetch("http://localhost:5050/api/rutinas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaRutina),
        })
            .then((res) => res.json())
            .then(() => {
                setMensaje("✅ Rutina creada correctamente.");
                setNombre("");
                setDescripcion("");
                cargarRutinas();
            })
            .catch(() => setMensaje("❌ Error al crear la rutina."));
    };

    const eliminarRutina = (id) => {
        fetch(`http://localhost:5050/api/rutinas/${id}`, { method: "DELETE" })
            .then(() => cargarRutinas())
            .catch(() => setMensaje("❌ Error al eliminar."));
    };

    if (cargando)
        return (
            <div
                style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
                ⏳ Cargando rutinas...
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
                📝 Mis Rutinas
            </h2>

            <div
                style={{
                    background: "#fff",
                    padding: "24px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    marginBottom: "24px",
                }}
            >
                <h3 style={{ margin: "0 0 16px 0", color: "#444" }}>
                    Crear nueva rutina
                </h3>
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
                <input
                    type="text"
                    placeholder="Nombre de la rutina"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        marginBottom: "12px",
                        fontSize: "1rem",
                    }}
                />
                <textarea
                    rows="3"
                    placeholder="Descripción (opcional)"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        marginBottom: "12px",
                        fontSize: "1rem",
                        fontFamily: "sans-serif",
                    }}
                />
                <button
                    onClick={crearRutina}
                    style={{
                        background: "#2563eb",
                        color: "#fff",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        fontSize: "1rem",
                    }}
                >
                    💾 Guardar Rutina
                </button>
            </div>

            <div>
                <h3 style={{ color: "#444", marginBottom: "16px" }}>
                    Mis rutinas guardadas
                </h3>
                {rutinas.length === 0 ? (
                    <p
                        style={{
                            color: "#999",
                            textAlign: "center",
                            padding: "20px",
                        }}
                    >
                        No tienes rutinas aún. ¡Crea una arriba!
                    </p>
                ) : (
                    rutinas.map((rutina) => (
                        <div
                            key={rutina.rutinaId}
                            style={{
                                background: "#fff",
                                padding: "20px",
                                borderRadius: "12px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                marginBottom: "12px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <h4
                                    style={{
                                        margin: "0 0 4px 0",
                                        color: "#1a1a1a",
                                    }}
                                >
                                    {rutina.nombre}
                                </h4>
                                <p
                                    style={{
                                        margin: 0,
                                        color: "#666",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    {rutina.descripcion || "Sin descripción"}
                                </p>
                            </div>
                            <button
                                onClick={() => eliminarRutina(rutina.rutinaId)}
                                style={{
                                    background: "#fee2e2",
                                    color: "#dc2626",
                                    border: "none",
                                    padding: "8px 14px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                🗑️ Eliminar
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
