import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MisRutinas() {
    const [vista, setVista] = useState("lista");
    const [rutinas, setRutinas] = useState([]);
    const [ejercicios, setEjercicios] = useState([]);
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [ejerciciosSeleccionados, setEjerciciosSeleccionados] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [filtroMusculo, setFiltroMusculo] = useState("Todos");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);
    const [editandoId, setEditandoId] = useState(null);

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const navigate = useNavigate();

    const cargarRutinas = () => {
        return fetch("http://localhost:5050/api/rutinas")
            .then((res) => res.json())
            .then((data) => {
                setRutinas(data.filter((r) => r.usuarioId === usuario?.id));
                setCargando(false);
            })
            .catch(() => setCargando(false));
    };

    useEffect(() => {
        cargarRutinas();
        fetch("http://localhost:5050/api/ejercicios")
            .then((res) => res.json())
            .then((data) => setEjercicios(data))
            .catch(() => {});
    }, []);

    const gruposMusculares = [
        "Todos",
        ...new Set(ejercicios.map((e) => e.grupoMuscular)),
    ];

    const ejerciciosFiltrados = ejercicios.filter((e) => {
        const coincideBusqueda = e.nombre
            .toLowerCase()
            .includes(busqueda.toLowerCase());
        const coincideMusculo =
            filtroMusculo === "Todos" || e.grupoMuscular === filtroMusculo;
        return coincideBusqueda && coincideMusculo;
    });

    const alternarEjercicio = (ejercicio) => {
        const existe = ejerciciosSeleccionados.find(
            (e) => e.ejercicioId === ejercicio.ejercicioId,
        );
        if (existe) {
            setEjerciciosSeleccionados(
                ejerciciosSeleccionados.filter(
                    (e) => e.ejercicioId !== ejercicio.ejercicioId,
                ),
            );
        } else {
            setEjerciciosSeleccionados([
                ...ejerciciosSeleccionados,
                {
                    ejercicioId: ejercicio.ejercicioId,
                    nombre: ejercicio.nombre,
                    series: 3,
                    repeticiones: 10,
                },
            ]);
        }
    };

    const actualizarEjercicio = (ejercicioId, campo, valor) => {
        setEjerciciosSeleccionados(
            ejerciciosSeleccionados.map((e) =>
                e.ejercicioId === ejercicioId
                    ? { ...e, [campo]: parseInt(valor) || 0 }
                    : e,
            ),
        );
    };

    const limpiarFormulario = () => {
        setNombre("");
        setDescripcion("");
        setEjerciciosSeleccionados([]);
        setBusqueda("");
        setFiltroMusculo("Todos");
        setMensaje("");
        setEditandoId(null);
    };

    const abrirCrear = () => {
        limpiarFormulario();
        setVista("crear");
    };

    const abrirEditar = (rutina) => {
        setEditandoId(rutina.rutinaId);
        setNombre(rutina.nombre);
        setDescripcion(rutina.descripcion || "");
        setEjerciciosSeleccionados(
            rutina.rutinaEjercicios?.map((re) => ({
                ejercicioId: parseInt(re.ejercicioId),
                nombre: re.ejercicio?.nombre,
                series: parseInt(re.series),
                repeticiones: parseInt(re.repeticiones),
            })) || [],
        );
        setVista("editar");
    };

    const guardar = async () => {
        if (!nombre.trim()) {
            setMensaje("⚠️ Ponle un nombre a la rutina.");
            return;
        }

        try {
            let id = editandoId;

            if (vista === "crear") {
                const res = await fetch("http://localhost:5050/api/rutinas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombre,
                        descripcion,
                        usuarioId: usuario?.id,
                    }),
                });
                const rutina = await res.json();
                id = rutina.rutinaId;
            } else {
                await fetch(`http://localhost:5050/api/rutinas/${editandoId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        rutinaId: editandoId,
                        nombre,
                        descripcion,
                        usuarioId: usuario?.id,
                    }),
                });

                const rutinaActual = rutinas.find(
                    (r) => r.rutinaId === editandoId,
                );
                for (const re of rutinaActual?.rutinaEjercicios || []) {
                    await fetch(
                        `http://localhost:5050/api/rutinas/${editandoId}/ejercicios/${re.ejercicioId}`,
                        {
                            method: "DELETE",
                        },
                    );
                }
            }

            for (let i = 0; i < ejerciciosSeleccionados.length; i++) {
                const ej = ejerciciosSeleccionados[i];
                await fetch(
                    `http://localhost:5050/api/rutinas/${id}/ejercicios`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ejercicioId: ej.ejercicioId,
                            series: ej.series,
                            repeticiones: ej.repeticiones,
                            orden: i + 1,
                        }),
                    },
                );
            }

            limpiarFormulario();
            await cargarRutinas();
            setVista("lista");
        } catch {
            setMensaje("❌ Error al guardar.");
        }
    };

    const eliminarRutina = (id) => {
        fetch(`http://localhost:5050/api/rutinas/${id}`, { method: "DELETE" })
            .then(() => cargarRutinas())
            .catch(() => {});
    };

    if (cargando)
        return (
            <div
                style={{ textAlign: "center", padding: "40px", color: "#666" }}
            >
                ⏳ Cargando...
            </div>
        );

    if (vista === "lista")
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
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <h2 style={{ margin: 0, color: "#111827" }}>
                        📝 Mis Rutinas
                    </h2>
                    <button
                        onClick={abrirCrear}
                        style={{
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            padding: "10px 20px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "0.95rem",
                        }}
                    >
                        + Nueva Rutina
                    </button>
                </div>

                {rutinas.length === 0 ? (
                    <div
                        style={{
                            background: "#fff",
                            padding: "40px",
                            borderRadius: "12px",
                            textAlign: "center",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                        }}
                    >
                        <p style={{ color: "#9ca3af", marginBottom: "16px" }}>
                            No tienes rutinas aún.
                        </p>
                        <button
                            onClick={abrirCrear}
                            style={{
                                background: "#2563eb",
                                color: "#fff",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "8px",
                                fontWeight: "bold",
                                cursor: "pointer",
                            }}
                        >
                            Crear mi primera rutina
                        </button>
                    </div>
                ) : (
                    rutinas.map((rutina) => (
                        <div
                            key={rutina.rutinaId}
                            style={{
                                background: "#fff",
                                borderRadius: "12px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                marginBottom: "16px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    background:
                                        "linear-gradient(135deg, #1e3a8a, #2563eb)",
                                    padding: "20px 24px",
                                }}
                            >
                                <h4
                                    style={{
                                        margin: "0 0 4px 0",
                                        color: "#fff",
                                        fontSize: "1.2rem",
                                    }}
                                >
                                    {rutina.nombre}
                                </h4>
                                <p
                                    style={{
                                        margin: 0,
                                        color: "rgba(255,255,255,0.75)",
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    {rutina.descripcion || "Sin descripción"}
                                </p>
                            </div>

                            <div
                                style={{
                                    padding: "16px 24px",
                                    borderBottom: "1px solid #f3f4f6",
                                }}
                            >
                                {rutina.rutinaEjercicios?.length > 0 ? (
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        {rutina.rutinaEjercicios.map(
                                            (re, i) => (
                                                <span
                                                    key={i}
                                                    style={{
                                                        background: "#eff6ff",
                                                        color: "#1d4ed8",
                                                        padding: "4px 10px",
                                                        borderRadius: "20px",
                                                        fontSize: "0.8rem",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    {re.ejercicio?.nombre} ·{" "}
                                                    {re.series}×
                                                    {re.repeticiones}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    <p
                                        style={{
                                            margin: 0,
                                            color: "#9ca3af",
                                            fontSize: "0.85rem",
                                            fontStyle: "italic",
                                        }}
                                    >
                                        Sin ejercicios asignados
                                    </p>
                                )}
                            </div>

                            <div
                                style={{
                                    padding: "12px 24px",
                                    display: "flex",
                                    gap: "10px",
                                    background: "#fafafa",
                                }}
                            >
                                <button
                                    onClick={() =>
                                        navigate(`/entrenar/${rutina.rutinaId}`)
                                    }
                                    style={{
                                        background: "#10b981",
                                        color: "#fff",
                                        border: "none",
                                        padding: "8px 18px",
                                        borderRadius: "6px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    🚀 Iniciar
                                </button>
                                <button
                                    onClick={() => abrirEditar(rutina)}
                                    style={{
                                        background: "#fef3c7",
                                        color: "#92400e",
                                        border: "none",
                                        padding: "8px 18px",
                                        borderRadius: "6px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    onClick={() =>
                                        eliminarRutina(rutina.rutinaId)
                                    }
                                    style={{
                                        background: "#fee2e2",
                                        color: "#dc2626",
                                        border: "none",
                                        padding: "8px 18px",
                                        borderRadius: "6px",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        fontSize: "0.9rem",
                                    }}
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        );

    return (
        <div
            style={{
                maxWidth: "900px",
                margin: "0 auto",
                fontFamily: "sans-serif",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "20px",
                }}
            >
                <button
                    onClick={() => {
                        limpiarFormulario();
                        setVista("lista");
                    }}
                    style={{
                        background: "#f3f4f6",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        color: "#4b5563",
                    }}
                >
                    ← Volver
                </button>
                <h2 style={{ margin: 0, color: "#111827" }}>
                    {vista === "editar"
                        ? "✏️ Editar Rutina"
                        : "📝 Nueva Rutina"}
                </h2>
            </div>

            <div
                style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                }}
            >
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
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        boxSizing: "border-box",
                        marginBottom: "12px",
                        fontSize: "1rem",
                    }}
                />

                <textarea
                    rows="2"
                    placeholder="Descripción (opcional)"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        boxSizing: "border-box",
                        marginBottom: "20px",
                        fontSize: "1rem",
                        fontFamily: "sans-serif",
                    }}
                />

                <h3 style={{ margin: "0 0 12px 0", color: "#374151" }}>
                    Selecciona los ejercicios
                </h3>

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "16px",
                    }}
                >
                    <input
                        type="text"
                        placeholder="🔍 Buscar ejercicio..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{
                            flex: 1,
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            fontSize: "0.95rem",
                        }}
                    />
                    <select
                        value={filtroMusculo}
                        onChange={(e) => setFiltroMusculo(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            fontSize: "0.95rem",
                            background: "#fff",
                        }}
                    >
                        {gruposMusculares.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(260px, 1fr))",
                        gap: "12px",
                        marginBottom: "24px",
                    }}
                >
                    {ejerciciosFiltrados.map((ej) => {
                        const seleccionado = ejerciciosSeleccionados.find(
                            (e) =>
                                parseInt(e.ejercicioId) ===
                                parseInt(ej.ejercicioId),
                        );
                        return (
                            <div
                                key={ej.ejercicioId}
                                style={{
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: `2px solid ${seleccionado ? "#2563eb" : "#e5e7eb"}`,
                                    background: seleccionado
                                        ? "#eff6ff"
                                        : "#f9fafb",
                                    transition: "all 0.15s",
                                }}
                            >
                                <div
                                    onClick={() => alternarEjercicio(ej)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            marginBottom: "6px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                background: "#e0e7ff",
                                                color: "#3730a3",
                                                padding: "3px 8px",
                                                borderRadius: "10px",
                                                fontSize: "0.75rem",
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {ej.grupoMuscular}
                                        </span>
                                        {seleccionado && (
                                            <span
                                                style={{
                                                    color: "#2563eb",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                ✓
                                            </span>
                                        )}
                                    </div>
                                    <h4
                                        style={{
                                            margin: "0 0 4px 0",
                                            color: "#1f2937",
                                            fontSize: "0.95rem",
                                        }}
                                    >
                                        {ej.nombre}
                                    </h4>
                                    <p
                                        style={{
                                            margin: 0,
                                            color: "#6b7280",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                        {ej.descripcion}
                                    </p>
                                </div>

                                {seleccionado && (
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "8px",
                                            marginTop: "10px",
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <label
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "#6b7280",
                                                    display: "block",
                                                    marginBottom: "2px",
                                                }}
                                            >
                                                Series
                                            </label>
                                            <input
                                                type="number"
                                                value={seleccionado.series}
                                                min="1"
                                                onChange={(e) =>
                                                    actualizarEjercicio(
                                                        ej.ejercicioId,
                                                        "series",
                                                        e.target.value,
                                                    )
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding: "6px",
                                                    borderRadius: "4px",
                                                    border: "1px solid #ccc",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label
                                                style={{
                                                    fontSize: "0.75rem",
                                                    color: "#6b7280",
                                                    display: "block",
                                                    marginBottom: "2px",
                                                }}
                                            >
                                                Reps
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    seleccionado.repeticiones
                                                }
                                                min="1"
                                                onChange={(e) =>
                                                    actualizarEjercicio(
                                                        ej.ejercicioId,
                                                        "repeticiones",
                                                        e.target.value,
                                                    )
                                                }
                                                style={{
                                                    width: "100%",
                                                    padding: "6px",
                                                    borderRadius: "4px",
                                                    border: "1px solid #ccc",
                                                    boxSizing: "border-box",
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        onClick={guardar}
                        style={{
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            padding: "12px 28px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}
                    >
                        💾{" "}
                        {vista === "editar"
                            ? "Guardar Cambios"
                            : "Crear Rutina"}
                    </button>
                    <button
                        onClick={() => {
                            limpiarFormulario();
                            setVista("lista");
                        }}
                        style={{
                            background: "#f3f4f6",
                            color: "#4b5563",
                            border: "none",
                            padding: "12px 20px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
