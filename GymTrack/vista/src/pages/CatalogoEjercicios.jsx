import { useState, useEffect } from "react";

export default function CatalogoEjercicios() {
    const [busqueda, setBusqueda] = useState("");
    const [ejercicios, setEjercicios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5050/api/ejercicios")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Error al recuperar el catálogo de ejercicios",
                    );
                }
                return response.json();
            })
            .then((data) => {
                setEjercicios(data);
                setCargando(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setCargando(false);
            });
    }, []);

    const ejerciciosFiltrados = ejercicios.filter(
        (ejercicio) =>
            ejercicio.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
            ejercicio.grupoMuscular
                ?.toLowerCase()
                .includes(busqueda.toLowerCase()),
    );

    if (cargando) {
        return (
            <div
                style={{
                    textAlign: "center",
                    padding: "40px",
                    fontSize: "1.2rem",
                    color: "#666",
                }}
            >
                ⏳ Extrayendo catálogo desde la API...
            </div>
        );
    }

    return (
        <div
            style={{
                maxWidth: "1000px",
                margin: "0 auto",
                fontFamily: "sans-serif",
            }}
        >
            <div style={{ marginBottom: "30px" }}>
                <h2 style={{ margin: "0 0 10px 0", color: "#1a1a1a" }}>
                    📚 Catálogo Global de Ejercicios
                </h2>
                <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                    Sincronizado en tiempo real con la API del servidor en el
                    puerto 5050.
                </p>

                <input
                    type="text"
                    placeholder=" Buscar por nombre o grupo muscular (ej. Pecho)..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        fontSize: "1rem",
                        boxSizing: "border-box",
                    }}
                />
            </div>

            {error && (
                <div
                    style={{
                        background: "#fef2f2",
                        border: "1px solid #fee2e2",
                        color: "#dc2626",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px",
                    }}
                >
                    <strong>Error de comunicación:</strong> No se pudo conectar
                    a la base de datos a través de http://localhost:5050.
                    Verifica que el Backend esté encendido.
                </div>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                }}
            >
                {ejerciciosFiltrados.length > 0 ? (
                    ejerciciosFiltrados.map((ejercicio) => (
                        <div
                            key={ejercicio.ejercicioId}
                            style={{
                                background: "#fff",
                                padding: "20px",
                                borderRadius: "12px",
                                border: "1px solid #e5e7eb",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                            }}
                        >
                            <span
                                style={{
                                    background: "#eff6ff",
                                    color: "#2563eb",
                                    padding: "4px 10px",
                                    borderRadius: "20px",
                                    fontSize: "0.85rem",
                                    fontWeight: "bold",
                                    display: "inline-block",
                                    marginBottom: "12px",
                                }}
                            >
                                {ejercicio.grupoMuscular || "General"}
                            </span>
                            <h3
                                style={{
                                    margin: "0 0 10px 0",
                                    color: "#1a1a1a",
                                }}
                            >
                                {ejercicio.nombre}
                            </h3>
                            <p
                                style={{
                                    margin: 0,
                                    color: "#555",
                                    fontSize: "0.95rem",
                                    lineHeight: "1.4",
                                }}
                            >
                                {ejercicio.descripcion}
                            </p>
                        </div>
                    ))
                ) : (
                    <p
                        style={{
                            gridColumn: "1 / -1",
                            textAlign: "center",
                            color: "#999",
                            padding: "40px",
                        }}
                    >
                        {error
                            ? "No hay datos disponibles por error de red."
                            : "No se encontraron ejercicios que coincidan con la búsqueda."}
                    </p>
                )}
            </div>
        </div>
    );
}
