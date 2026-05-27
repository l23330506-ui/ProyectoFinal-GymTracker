import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MisRutinas from "./pages/MisRutinas";
import EntrenamientoActivo from "./pages/EntrenamientoActivo";
import Historial from "./pages/Historial";
import Login from "./pages/Login";

function Layout() {
    const location = useLocation();
    const esLogin = location.pathname === "/login";
    const esEntrenamiento = location.pathname.startsWith("/entrenar");

    return (
        <div
            style={{
                fontFamily: "sans-serif",
                minHeight: "100vh",
                width: "100%",
                background: "#f3f4f6",
            }}
        >
            {!esLogin && !esEntrenamiento && (
                <nav
                    style={{
                        padding: "15px 20px",
                        background: "#111827",
                        color: "#fff",
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                    }}
                >
                    <span
                        style={{
                            fontWeight: "bold",
                            fontSize: "1.2rem",
                            marginRight: "10px",
                        }}
                    >
                        🏋️‍♂️ GymTrack
                    </span>
                    <Link
                        to="/"
                        style={{
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: "500",
                        }}
                    >
                        📊 Dashboard
                    </Link>
                    <Link
                        to="/rutinas"
                        style={{
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: "500",
                        }}
                    >
                        📝 Mis Rutinas
                    </Link>
                    <Link
                        to="/historial"
                        style={{
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: "500",
                        }}
                    >
                        📅 Historial
                    </Link>
                    <button
                        onClick={() => {
                            localStorage.removeItem("usuario");
                            window.location.href = "/login";
                        }}
                        style={{
                            marginLeft: "auto",
                            background: "#ef4444",
                            color: "#fff",
                            border: "none",
                            padding: "8px 14px",
                            borderRadius: "6px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            fontSize: "0.85rem",
                        }}
                    >
                        Cerrar sesión
                    </button>
                </nav>
            )}
            <main
                style={{ padding: esLogin || esEntrenamiento ? "0" : "30px" }}
            >
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/rutinas" element={<MisRutinas />} />
                    <Route
                        path="/entrenar/:rutinaId"
                        element={<EntrenamientoActivo />}
                    />
                    <Route path="/historial" element={<Historial />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Layout />
        </Router>
    );
}
