import { useEffect, useState } from "react";
import { ProyectoDetalle } from "./ProyectoDetalle";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export function MisProyectosEstudiante() {
    const [proyectos, setProyectos] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const { usuario, loading } = useAuth({ redirectTo: '/' });
    const navigate = useNavigate();

    function parseFecha(fecha) {
        if (!fecha) return "";
        try {
            const date = new Date(fecha);
            if (isNaN(date.getTime())) {
                throw new Error("Fecha inválida");
            }
            const dia = String(date.getDate()).padStart(2, "0");
            const mes = String(date.getMonth() + 1).padStart(2, "0");
            const año = date.getFullYear();
            return `${dia}-${mes}-${año}`;
        } catch (e) {
            console.error("Error parseando fecha:", e);
            return "Fecha inválida";
        }
    }

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                setCargando(true);
                setError(null);
                
                if (!usuario) {
                    throw new Error("Debes iniciar sesión para ver tus proyectos");
                }
                
                console.log("Obteniendo proyectos para usuario:", usuario);
                
                const response = await fetch(`${API_BASE_URL}/proyectos/usuario`, {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                    }
                });
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.detail || `Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("Proyectos recibidos:", data);
                
                if (!Array.isArray(data)) {
                    throw new Error("La respuesta no es un array");
                }
                
                setProyectos(data);
            } catch (err) {
                console.error("Error al obtener proyectos:", err);
                setError(err.message || "Error al cargar los proyectos. Por favor, intenta nuevamente.");
            } finally {
                setCargando(false);
            }
        };

        if (!loading && usuario) {
            obtenerProyectos();
        }
    }, [usuario, loading]);

    if (loading) {
        return (
            <div style={{ 
                padding: "24px", 
                minHeight: "100vh", 
                backgroundColor: "#222", 
                color: "#fff" 
            }}>
                Cargando...
            </div>
        );
    }

    if (seleccionado) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#222' }}>
                <ProyectoDetalle
                    proyecto={seleccionado}
                    volver={() => setSeleccionado(null)}
                />
            </div>
        );
    }

    return (
        <div style={{ 
            padding: "24px", 
            minHeight: "100vh", 
            backgroundColor: "#222", 
            color: "#fff" 
        }}>
            <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
                Mis Proyectos
            </h1>
            
            {cargando ? (
                <div style={{ color: "#fff" }}>Cargando proyectos...</div>
            ) : error ? (
                <div style={{ color: "#ff6b6b" }}>
                    Error: {error}
                    <button 
                        onClick={() => window.location.reload()}
                        style={{
                            marginLeft: "1rem",
                            background: "#4f0000",
                            color: "#fff",
                            border: "none",
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Reintentar
                    </button>
                </div>
            ) : proyectos.length === 0 ? (
                <div style={{ color: "#fff" }}>No hay proyectos asociados.</div>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {proyectos.map((proyecto) => (
                        <li
                            key={proyecto.id}
                            style={{
                                border: "1px solid #444",
                                borderRadius: "12px",
                                padding: "16px",
                                marginBottom: "16px",
                                cursor: "pointer",
                                transition: "background-color 0.3s",
                                backgroundColor: "#333",
                                color: "#fff"
                            }}
                            onClick={() => setSeleccionado(proyecto)}
                        >
                            <h2 style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                                {proyecto.titulo}
                            </h2>
                            <p style={{ color: "#bbb", margin: "8px 0" }}>
                                {proyecto.descripcion}
                            </p>
                            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                                <span style={{ fontSize: "0.875rem", color: "#999" }}>
                                    Estado: {proyecto.estado}
                                </span>
                                {proyecto.creador_id === usuario?.id && (
                                    <span style={{ fontSize: "0.875rem", color: "#4caf50" }}>
                                        Creador
                                    </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}