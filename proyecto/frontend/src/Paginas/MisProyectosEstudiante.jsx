import { useEffect, useState } from "react";
import { ProyectoDetalle } from "./ProyectoDetalle";

export function MisProyectosEstudiante() {
    const [proyectos, setProyectos] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    
    const estudianteId = 1; // Debería venir de autenticación

    function parseFecha(fecha) {
        if (!fecha) return "";
        try {
            const date = new Date(fecha);
            const dia = String(date.getDate()).padStart(2, "0");
            const mes = String(date.getMonth() + 1).padStart(2, "0");
            const año = date.getFullYear();
            return `${dia}-${mes}-${año}`;
        } catch (e) {
            console.error("Error parseando fecha:", e);
            return fecha; // Devuelve la fecha original si falla el parseo
        }
    }

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                setCargando(true);
                setError(null);
                
                const response = await fetch(`http://localhost:8000/proyectos/estudiante/${estudianteId}`);
                
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (!Array.isArray(data)) {
                    throw new Error("La respuesta no es un array");
                }
                
                setProyectos(data);
            } catch (err) {
                console.error("Error al obtener proyectos:", err);
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        obtenerProyectos();
    }, []);

    if (seleccionado) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#222' }}>
                <ProyectoDetalle
                    proyecto={seleccionado}
                    estudianteId={estudianteId}
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
                                {proyecto.nombre}
                            </h2>
                            <p style={{ color: "#bbb", margin: "8px 0" }}>
                                {proyecto.descripcion}
                            </p>
                            <p style={{ fontSize: "0.875rem", color: "#999" }}>
                                Desde {parseFecha(proyecto.fecha_inicio)} hasta {parseFecha(proyecto.fecha_termino)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}