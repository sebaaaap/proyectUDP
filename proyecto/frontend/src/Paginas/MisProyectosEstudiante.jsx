import { useEffect, useState } from "react";
import { ProyectoDetalle } from "./ProyectoDetalle";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

console.log("Montando MisProyectosEstudiante");

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Función para obtener estilos de color según el estado
function getEstadoColor(estado) {
    switch ((estado || '').toLowerCase()) {
        case 'aprobado':
            return { background: 'rgba(76, 175, 80, 0.15)', color: '#4caf50', border: '1px solid #4caf50' };
        case 'rechazado':
            return { background: 'rgba(244, 67, 54, 0.15)', color: '#f44336', border: '1px solid #f44336' };
        case 'propuesto':
            return { background: 'rgba(255, 193, 7, 0.15)', color: '#ffc107', border: '1px solid #ffc107' };
        case 'en desarrollo':
            return { background: 'rgba(33, 150, 243, 0.15)', color: '#2196f3', border: '1px solid #2196f3' };
        default:
            return { background: '#888', color: '#fff', border: '1px solid #888' };
    }
}

// Estilos para la grilla y animación
const gridStyles = `
  .proyectos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 24px;
    margin: 0;
    padding: 0;
  }
  .proyecto-card {
    border: 1px solid #444;
    border-radius: 16px;
    background: #333;
    color: #fff;
    min-height: 240px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    opacity: 0;
    transform: translateY(32px);
    animation: fadeInUp 0.6s forwards;
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 600px) {
    .proyectos-grid {
      grid-template-columns: 1fr;
    }
  }
`;

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
                
                let endpoint = `${API_BASE_URL}/proyectos/usuario`;
                if (usuario.rol === 'profesor') {
                    endpoint = `${API_BASE_URL}/proyectos/usuario/profesor`;
                }
                
                const response = await fetch(endpoint, {
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
            <style>{gridStyles}</style>
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
                <ul className="proyectos-grid">
                    {proyectos.map((proyecto, idx) => (
                        <li
                            key={proyecto.id}
                            className="proyecto-card"
                            style={{
                                animationDelay: `${idx * 0.13 + 0.1}s`,
                                listStyle: 'none',
                                padding: '20px',
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'stretch',
                                minHeight: '240px',
                                minWidth: 0
                            }}
                            onClick={() => setSeleccionado(proyecto)}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <h2 style={{ fontSize: "1.15rem", fontWeight: 600, margin: 0, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {proyecto.titulo}
                                </h2>
                                <p style={{ color: "#bbb", margin: "8px 0 0 0", fontSize: '0.98rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                    {proyecto.descripcion}
                                </p>
                                {proyecto.creador_id === usuario?.id && (
                                    <span style={{ fontSize: "0.875rem", color: "#4caf50" }}>
                                        Creador
                                    </span>
                                )}
                            </div>
                            <span
                                style={{
                                    ...getEstadoColor(proyecto.estado),
                                    padding: "6px 18px",
                                    borderRadius: "16px",
                                    fontWeight: 600,
                                    fontSize: "0.95rem",
                                    marginTop: "18px",
                                    minWidth: 100,
                                    textAlign: 'center',
                                    textTransform: 'capitalize',
                                    letterSpacing: '0.5px',
                                    alignSelf: 'flex-end',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                                }}
                            >
                                {proyecto.estado || 'Sin estado'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}