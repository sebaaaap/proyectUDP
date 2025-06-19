import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext'; // Ajusta la ruta según tu estructura

export function DashboardProfe() {
    const { user } = useAuth();
    const [proyectosAsignados, setProyectosAsignados] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [postulaciones, setPostulaciones] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [filtroCalificacion, setFiltroCalificacion] = useState("Todos");
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [mostrarModalCalificacion, setMostrarModalCalificacion] = useState(false);
    const [proyectoACalificar, setProyectoACalificar] = useState(null);
    const [calificacion, setCalificacion] = useState(4.0);
    const [calificando, setCalificando] = useState(false);
    
    // Verificar que el usuario sea profesor
    useEffect(() => {
        if (!user || user.rol !== 'profesor') {
            console.error('Acceso denegado: Usuario no es profesor');
            // Redirigir o mostrar error
            return;
        }
    }, [user]);

    useEffect(() => {
        cargarProyectosAsignados();
    }, []);

    const cargarProyectosAsignados = async () => {
    try {
        setCargando(true);
        setError(null);
        
        const response = await fetch("http://localhost:8000/proyectos/mis-proyectos-asignados", { 
            credentials: "include" 
        });
        
        if (!response.ok) {
            // Manejo específico de errores HTTP
            switch (response.status) {
                case 401:
                    throw new Error("No autorizado. Por favor, inicia sesión nuevamente.");
                case 403:
                    throw new Error("Acceso denegado. No tienes permisos de profesor.");
                case 404:
                    throw new Error("Endpoint no encontrado. Verifica la configuración del servidor.");
                case 500:
                    throw new Error("Error interno del servidor.");
                default:
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        }
        
        const data = await response.json();
        console.log("Proyectos cargados:", data); // Para debug
        setProyectosAsignados(Array.isArray(data) ? data : []);
        
    } catch (error) {
        console.error("Error al cargar proyectos asignados:", error);
        setError(error.message);
        setProyectosAsignados([]);
    } finally {
        setCargando(false);
    }
};

    const verPostulaciones = async (proyectoId) => {
    try {
        // Validar que el proyecto existe
        const proyecto = proyectosAsignados.find(p => p.id === proyectoId);
        if (!proyecto) {
            throw new Error("Proyecto no encontrado");
        }
        
        console.log(`Cargando postulaciones para proyecto ${proyectoId}`);
        
        const response = await fetch(`http://localhost:8000/proyectos/${proyectoId}/postulaciones`, { 
            credentials: "include" 
        });
        
        if (!response.ok) {
            switch (response.status) {
                case 404:
                    throw new Error("No se encontraron postulaciones para este proyecto");
                case 403:
                    throw new Error("No tienes permisos para ver estas postulaciones");
                default:
                    throw new Error(`Error ${response.status}: No se pudieron cargar las postulaciones`);
            }
        }
        
        const data = await response.json();
        console.log("Postulaciones cargadas:", data);
        
        // Validar estructura de datos
        const postulacionesValidas = Array.isArray(data) ? data.filter(p => 
            p.id && p.estudiante_nombre && p.estado
        ) : [];
        
        setSeleccionado(proyecto);
        setPostulaciones(postulacionesValidas);
        
    } catch (error) {
        console.error("Error al cargar postulaciones:", error);
        setMensaje(error.message);
        setTimeout(() => setMensaje(""), 3000);
        setSeleccionado(null);
        setPostulaciones([]);
    }
};


    const cambiarEstadoPostulacion = async (postulacionId, nuevoEstado) => {
        try {
            const response = await fetch(`http://localhost:8000/postulaciones/${postulacionId}/estado`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (response.ok) {
                setPostulaciones(postulaciones.map(p => 
                    p.id === postulacionId ? { ...p, estado: nuevoEstado } : p
                ));
                setMensaje(`Postulación ${nuevoEstado.toLowerCase()} correctamente`);
                setTimeout(() => setMensaje(""), 3000);
            } else {
                throw new Error("Error al cambiar el estado");
            }
        } catch (error) {
            console.error("Error:", error);
            setMensaje("Error al cambiar el estado de la postulación");
            setTimeout(() => setMensaje(""), 3000);
        }
    };

    const abrirModalCalificacion = (proyecto) => {
        setProyectoACalificar(proyecto);
        setCalificacion(proyecto.calificacion_final || 4.0);
        setMostrarModalCalificacion(true);
    };

    const cerrarModalCalificacion = () => {
        setMostrarModalCalificacion(false);
        setProyectoACalificar(null);
        setCalificacion(4.0);
    };

    const calificarProyecto = async () => {
        if (!proyectoACalificar) return;

        try {
            setCalificando(true);
            const response = await fetch(`http://localhost:8000/proyectos/${proyectoACalificar.id}/calificacion`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ calificacion })
            });

            if (!response.ok) {
                throw new Error('Error al calificar proyecto');
            }

            const result = await response.json();
            
            // Actualizar la lista de proyectos
            setProyectosAsignados(prev => prev.map(p => 
                p.id === proyectoACalificar.id 
                    ? { ...p, calificacion_final: calificacion }
                    : p
            ));

            setMensaje(`Proyecto calificado con ${calificacion.toFixed(1)}. ${result.en_ranking ? '¡Agregado al ranking!' : ''}`);
            setTimeout(() => setMensaje(""), 4000);
            
            cerrarModalCalificacion();
        } catch (error) {
            console.error("Error:", error);
            setMensaje("Error al calificar el proyecto");
            setTimeout(() => setMensaje(""), 3000);
        } finally {
            setCalificando(false);
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case "Aprobada":
            case "Aceptado":
                return { bg: "rgba(76, 175, 80, 0.2)", color: "#4caf50" };
            case "Rechazada":
            case "Rechazado":
                return { bg: "rgba(244, 67, 54, 0.2)", color: "#f44336" };
            default:
                return { bg: "rgba(255, 193, 7, 0.2)", color: "#ffc107" };
        }
    };

    const getEstadoProyecto = (estado) => {
        const estados = {
            'propuesto': { bg: '#6c757d', text: 'Propuesto' },
            'en_revision': { bg: '#ffc107', text: 'En Revisión' },
            'aprobado': { bg: '#28a745', text: 'Aprobado' },
            'rechazado': { bg: '#dc3545', text: 'Rechazado' }
        };
        return estados[estado] || { bg: '#6c757d', text: estado };
    };

    const renderEstrellas = (nota) => {
        const estrellas = [];
        const notaRedondeada = Math.round(nota * 2) / 2;
        
        for (let i = 1; i <= 7; i++) {
            if (i <= notaRedondeada) {
                estrellas.push(
                    <span key={i} style={{ color: '#ffc107', marginRight: '2px' }}>★</span>
                );
            } else {
                estrellas.push(
                    <span key={i} style={{ color: '#6c757d', marginRight: '2px' }}>☆</span>
                );
            }
        }
        return estrellas;
    };

    const postulacionesFiltradas = filtroEstado === "Todos" 
        ? postulaciones 
        : postulaciones.filter(p => p.estado === filtroEstado);

    const proyectosFiltrados = filtroCalificacion === "Todos"
        ? proyectosAsignados
        : filtroCalificacion === "Calificados"
        ? proyectosAsignados.filter(p => p.calificacion_final)
        : proyectosAsignados.filter(p => !p.calificacion_final);

    // Pantalla de carga
    if (cargando) {
        return (
            <div style={{ 
                padding: "40px", 
                background: "#222", 
                minHeight: "100vh", 
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column"
            }}>
                <div style={{
                    width: "50px",
                    height: "50px",
                    border: "5px solid #333",
                    borderTop: "5px solid #007bff",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    marginBottom: "20px"
                }}></div>
                <p>Cargando proyectos asignados...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px", background: "#222", minHeight: "100vh", color: "#fff" }}>
            <h1 style={{ marginBottom: "24px" }}>🎓 Panel del Profesor</h1>

            {/* Mostrar error si existe */}
            {error && (
                <div style={{
                    background: "#dc3545",
                    color: "#fff",
                    padding: "16px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div>
                        <strong>Error de conexión:</strong> {error}
                        <br />
                        <button 
                            onClick={() => window.location.reload()}
                            style={{
                                background: "rgba(255,255,255,0.2)",
                                border: "1px solid rgba(255,255,255,0.3)",
                                color: "#fff",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                marginTop: "8px"
                            }}
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            )}

            <div style={{
                background: "#403f3f",
                borderRadius: "16px",
                padding: "24px",
                marginBottom: "24px"
            }}>
                {!seleccionado ? (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h2>Proyectos Asignados ({proyectosAsignados.length})</h2>
                            
                            <select
                                value={filtroCalificacion}
                                onChange={(e) => setFiltroCalificacion(e.target.value)}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    background: "#444",
                                    color: "#fff",
                                    border: "1px solid #555"
                                }}
                            >
                                <option value="Todos">Todos</option>
                                <option value="Sin Calificar">Sin Calificar</option>
                                <option value="Calificados">Calificados</option>
                            </select>
                        </div>
                        
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "24px" }}>
                            {proyectosFiltrados.map(proyecto => (
                                <div key={proyecto.id} style={{ 
                                    background: "#333", 
                                    padding: "24px", 
                                    borderRadius: "12px", 
                                    width: "350px",
                                    border: "1px solid #444"
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                        <h3 style={{ margin: 0, flex: 1 }}>{proyecto.titulo}</h3>
                                        <span style={{
                                            background: getEstadoProyecto(proyecto.estado).bg,
                                            color: "#fff",
                                            padding: "4px 8px",
                                            borderRadius: "12px",
                                            fontSize: "0.8rem",
                                            marginLeft: "8px"
                                        }}>
                                            {getEstadoProyecto(proyecto.estado).text}
                                        </span>
                                    </div>
                                    
                                    <p style={{ color: "#bbb", marginBottom: "8px", fontSize: "0.9rem" }}>
                                        <strong>Creador:</strong> {proyecto.creador}
                                    </p>
                                    
                                    <p style={{ color: "#bbb", marginBottom: "16px" }}>
                                        {proyecto.descripcion}
                                    </p>

                                    {proyecto.calificacion_final && (
                                        <div style={{ marginBottom: "16px", padding: "12px", background: "#444", borderRadius: "8px" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <span style={{ color: "#28a745", fontWeight: "bold" }}>
                                                    Calificado: {proyecto.calificacion_final.toFixed(1)}
                                                </span>
                                                <div>{renderEstrellas(proyecto.calificacion_final).slice(0, 3)}</div>
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            onClick={() => verPostulaciones(proyecto.id)}
                                            style={{
                                                flex: 1,
                                                padding: "10px 16px",
                                                background: "#007bff",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "8px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Ver Postulaciones
                                        </button>
                                        
                                        <button
                                            onClick={() => abrirModalCalificacion(proyecto)}
                                            style={{
                                                flex: 1,
                                                padding: "10px 16px",
                                                background: proyecto.calificacion_final ? "#28a745" : "#ffc107",
                                                color: proyecto.calificacion_final ? "#fff" : "#000",
                                                border: "none",
                                                borderRadius: "8px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {proyecto.calificacion_final ? "✏️ Editar Nota" : "⭐ Calificar"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {proyectosFiltrados.length === 0 && !error && (
                            <div style={{
                                background: "#444",
                                padding: "32px",
                                borderRadius: "12px",
                                textAlign: "center",
                                color: "#bbb"
                            }}>
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ marginBottom: "16px" }}>
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>  
                                </svg>
                                <h3>
                                    {filtroCalificacion === "Todos" 
                                        ? "No tienes proyectos asignados" 
                                        : `No hay proyectos ${filtroCalificacion.toLowerCase()}`}
                                </h3>
                                <p>Los estudiantes deben agregarte como profesor supervisor en sus proyectos.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => {
                                setSeleccionado(null);
                                setPostulaciones([]);
                            }}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#007bff",
                                cursor: "pointer",
                                marginBottom: "24px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M19 12H5M12 19l-7-7 7-7"></path>
                            </svg>
                            Volver a proyectos asignados
                        </button>

                        <div style={{
                            background: "#444",
                            padding: "20px",
                            borderRadius: "12px",
                            marginBottom: "24px"
                        }}>
                            <h2>{seleccionado.titulo}</h2>
                            <p style={{ color: "#bbb", marginBottom: "8px" }}>
                                <strong>Creador:</strong> {seleccionado.creador}
                            </p>
                            <p style={{ color: "#bbb" }}>{seleccionado.descripcion}</p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h3>Postulaciones ({postulaciones.length})</h3>
                            
                            <select
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    background: "#444",
                                    color: "#fff",
                                    border: "1px solid #555"
                                }}
                            >
                                <option value="Todos">Todas</option>
                                <option value="Pendiente">Pendientes</option>
                                <option value="Aceptado">Aceptadas</option>
                                <option value="Rechazado">Rechazadas</option>
                            </select>
                        </div>

                        {postulacionesFiltradas.length === 0 ? (
                            <div style={{
                                background: "#444",
                                padding: "32px",
                                borderRadius: "12px",
                                textAlign: "center",
                                color: "#bbb"
                            }}>
                                {filtroEstado === "Todos" 
                                    ? "No hay postulaciones para este proyecto" 
                                    : `No hay postulaciones ${filtroEstado.toLowerCase()}`}
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {postulacionesFiltradas.map(post => (
                                    <div key={post.id} style={{ 
                                        background: "#444", 
                                        padding: "20px", 
                                        borderRadius: "12px"
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                            <div>
                                                <h4 style={{ margin: "0 0 8px 0" }}>{post.estudiante_nombre}</h4>
                                                <p style={{ color: "#bbb", margin: 0 }}>
                                                    <strong>Motivación:</strong> {post.motivacion}
                                                </p>
                                            </div>
                                            <span style={{
                                                padding: "6px 12px",
                                                borderRadius: "20px",
                                                fontSize: "0.85rem",
                                                marginLeft: "16px",
                                                ...getEstadoColor(post.estado)
                                            }}>
                                                {post.estado}
                                            </span>
                                        </div>

                                        {post.estado === "Pendiente" && (
                                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                                <button
                                                    onClick={() => cambiarEstadoPostulacion(post.id, "Rechazado")}
                                                    style={{
                                                        padding: "8px 16px",
                                                        background: "#dc3545",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: "8px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Rechazar
                                                </button>
                                                <button
                                                    onClick={() => cambiarEstadoPostulacion(post.id, "Aceptado")}
                                                    style={{
                                                        padding: "8px 16px",
                                                        background: "#28a745",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: "8px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    Aceptar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal de Calificación */}
            {mostrarModalCalificacion && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.8)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        background: "#333",
                        padding: "32px",
                        borderRadius: "16px",
                        width: "500px",
                        maxWidth: "90vw"
                    }}>
                        <h2 style={{ marginBottom: "24px" }}>Calificar Proyecto</h2>
                        
                        {proyectoACalificar && (
                            <>
                                <h3 style={{ color: "#007bff", marginBottom: "8px" }}>
                                    {proyectoACalificar.titulo}
                                </h3>
                                <p style={{ color: "#bbb", marginBottom: "24px" }}>
                                    Creador: {proyectoACalificar.creador}
                                </p>
                                
                                <div style={{ marginBottom: "24px" }}>
                                    <label style={{ display: "block", marginBottom: "12px", fontWeight: "bold" }}>
                                        Calificación (1.0 - 7.0)
                                    </label>
                                    <input
                                        type="range"
                                        min="1.0"
                                        max="7.0"
                                        step="0.1"
                                        value={calificacion}
                                        onChange={(e) => setCalificacion(parseFloat(e.target.value))}
                                        style={{
                                            width: "100%",
                                            marginBottom: "16px"
                                        }}
                                    />
                                    <div style={{ 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "center",
                                        marginBottom: "16px"
                                    }}>
                                        <span>1.0</span>
                                        <div style={{ textAlign: "center" }}>
                                            <div style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "8px" }}>
                                                {calificacion.toFixed(1)}
                                            </div>
                                            <div>{renderEstrellas(calificacion)}</div>
                                        </div>
                                        <span>7.0</span>
                                    </div>
                                </div>

                                {calificacion >= 6.0 && (
                                    <div style={{
                                        background: "#28a745",
                                        color: "#fff",
                                        padding: "12px",
                                        borderRadius: "8px",
                                        marginBottom: "24px",
                                        textAlign: "center"
                                    }}>
                                        🏆 ¡Este proyecto aparecerá en el ranking con esta calificación!
                                    </div>
                                )}
                            </>
                        )}
                        
                        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                            <button
                                onClick={cerrarModalCalificacion}
                                disabled={calificando}
                                style={{
                                    padding: "12px 24px",
                                    background: "#6c757d",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: calificando ? "not-allowed" : "pointer",
                                    opacity: calificando ? 0.6 : 1
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={calificarProyecto}
                                disabled={calificando}
                                style={{
                                    padding: "12px 24px",
                                    background: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: calificando ? "not-allowed" : "pointer",
                                    opacity: calificando ? 0.6 : 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                {calificando && (
                                    <div style={{
                                        width: "16px",
                                        height: "16px",
                                        border: "2px solid #ffffff40",
                                        borderTop: "2px solid #fff",
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite"
                                    }}></div>
                                )}
                                {calificando ? 'Calificando...' : 'Calificar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mensaje && (
                <div style={{
                    position: "fixed",
                    bottom: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#28a745",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    zIndex: 1000
                }}>
                    {mensaje}
                </div>
            )}
        </div>
    );
}