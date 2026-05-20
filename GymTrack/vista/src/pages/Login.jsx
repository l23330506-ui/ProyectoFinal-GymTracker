import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [modo, setModo] = useState("login"); // 'login' o 'registro'
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        passwordHash: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setError("");
        if (modo === "registro") {
            const res = await fetch(
                "http://localhost:5000/api/usuarios/registro",
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
                "http://localhost:5000/api/usuarios/login",
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
    };

    return (
        <div
            style={{
                maxWidth: "420px",
                margin: "60px auto",
                background: "#fff",
                borderRadius: "12px",
                padding: "40px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    marginBottom: "8px",
                    color: "#1a1a1a",
                }}
            >
                🏋️‍♂️ GymTrack
            </h2>
            <p
                style={{
                    textAlign: "center",
                    color: "#666",
                    marginBottom: "30px",
                }}
            >
                {modo === "login"
                    ? "Inicia sesión para continuar"
                    : "Crea tu cuenta gratis"}
            </p>

            {modo === "registro" && (
                <input
                    name="nombre"
                    placeholder="Nombre completo"
                    value={form.nombre}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginBottom: "12px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        fontSize: "1rem",
                        boxSizing: "border-box",
                    }}
                />
            )}

            <input
                name="email"
                placeholder="Correo electrónico"
                value={form.email}
                onChange={handleChange}
                style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                }}
            />

            <input
                name="passwordHash"
                type="password"
                placeholder="Contraseña"
                value={form.passwordHash}
                onChange={handleChange}
                style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "20px",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                }}
            />

            {error && (
                <p
                    style={{
                        color: "red",
                        marginBottom: "12px",
                        fontSize: "0.9rem",
                    }}
                >
                    {error}
                </p>
            )}

            <button
                onClick={handleSubmit}
                style={{
                    width: "100%",
                    padding: "12px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                }}
            >
                {modo === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>

            <p
                style={{
                    textAlign: "center",
                    marginTop: "20px",
                    color: "#666",
                    fontSize: "0.9rem",
                }}
            >
                {modo === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
                <span
                    onClick={() =>
                        setModo(modo === "login" ? "registro" : "login")
                    }
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
    );
}
