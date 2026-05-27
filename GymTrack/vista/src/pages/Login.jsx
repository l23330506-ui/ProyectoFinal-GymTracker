import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [modo, setModo] = useState("login");
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        passwordHash: "",
    });
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError("");
        setCargando(true);
        try {
            if (modo === "registro") {
                const res = await fetch(
                    "http://localhost:5050/api/usuarios/registro",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(form),
                    },
                );
                if (res.ok) {
                    alert("Registro exitoso, ahora inicia sesión");
                    setModo("login");
                } else {
                    const msg = await res.text();
                    setError(msg);
                }
            } else {
                const res = await fetch(
                    "http://localhost:5050/api/usuarios/login",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: form.email,
                            passwordHash: form.passwordHash,
                        }),
                    },
                );
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem("usuario", JSON.stringify(data));
                    navigate("/");
                } else {
                    setError("Email o contraseña incorrectos");
                }
            }
        } catch {
            setError("Error de conexión con el servidor.");
        }
        setCargando(false);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "420px",
                    background: "#fff",
                    borderRadius: "16px",
                    padding: "40px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                    margin: "20px",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>
                        🏋️‍♂️
                    </div>
                    <h2
                        style={{
                            margin: "0 0 4px 0",
                            color: "#111827",
                            fontSize: "1.6rem",
                            fontWeight: "bold",
                        }}
                    >
                        GymTrack
                    </h2>
                    <p
                        style={{
                            margin: 0,
                            color: "#6b7280",
                            fontSize: "0.95rem",
                        }}
                    >
                        {modo === "login"
                            ? "Inicia sesión para continuar"
                            : "Crea tu cuenta gratis"}
                    </p>
                </div>

                {modo === "registro" && (
                    <div style={{ marginBottom: "16px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "6px",
                                fontWeight: "500",
                                color: "#374151",
                                fontSize: "0.9rem",
                            }}
                        >
                            Nombre completo
                        </label>
                        <input
                            name="nombre"
                            placeholder="Tu nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                fontSize: "1rem",
                                boxSizing: "border-box",
                                outline: "none",
                            }}
                        />
                    </div>
                )}

                <div style={{ marginBottom: "16px" }}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "500",
                            color: "#374151",
                            fontSize: "0.9rem",
                        }}
                    >
                        Correo electrónico
                    </label>
                    <input
                        name="email"
                        placeholder="correo@ejemplo.com"
                        value={form.email}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            fontSize: "1rem",
                            boxSizing: "border-box",
                            outline: "none",
                        }}
                    />
                </div>

                <div style={{ marginBottom: "24px" }}>
                    <label
                        style={{
                            display: "block",
                            marginBottom: "6px",
                            fontWeight: "500",
                            color: "#374151",
                            fontSize: "0.9rem",
                        }}
                    >
                        Contraseña
                    </label>
                    <input
                        name="passwordHash"
                        type="password"
                        placeholder="••••••••"
                        value={form.passwordHash}
                        onChange={handleChange}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            fontSize: "1rem",
                            boxSizing: "border-box",
                            outline: "none",
                        }}
                    />
                </div>

                {error && (
                    <div
                        style={{
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                            color: "#dc2626",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            marginBottom: "16px",
                            fontSize: "0.9rem",
                        }}
                    >
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={cargando}
                    style={{
                        width: "100%",
                        padding: "13px",
                        background: cargando ? "#93c5fd" : "#2563eb",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        cursor: cargando ? "not-allowed" : "pointer",
                    }}
                >
                    {cargando
                        ? "⏳ Cargando..."
                        : modo === "login"
                          ? "Iniciar sesión"
                          : "Registrarse"}
                </button>

                <p
                    style={{
                        textAlign: "center",
                        marginTop: "20px",
                        color: "#6b7280",
                        fontSize: "0.9rem",
                    }}
                >
                    {modo === "login"
                        ? "¿No tienes cuenta?"
                        : "¿Ya tienes cuenta?"}{" "}
                    <span
                        onClick={() => {
                            setModo(modo === "login" ? "registro" : "login");
                            setError("");
                        }}
                        style={{
                            color: "#2563eb",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }}
                    >
                        {modo === "login" ? "Regístrate" : "Inicia sesión"}
                    </span>
                </p>
            </div>
        </div>
    );
}
