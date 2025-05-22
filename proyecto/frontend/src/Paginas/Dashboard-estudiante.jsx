import { useEffect, useState } from "react";

export function DashboardEstudiante() {
    const [proyectos, setProyectos] = useState([]);
    const [postulaciones, setPostulaciones] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [mostrarFormularioPostulacion, setMostrarFormularioPostulacion] = useState(false);
    const [motivacion, setMotivacion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [proyectoAPostular, setProyectoAPostular] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState("Todos");

    useEffect(() => {
        // Datos de ejemplo enriquecidos
        const proyectosEjemplo = [
            {
                id: 1,
                titulo: "Sistema de Gestión Académica",
                fechaPublicacion: "2025-05-18",
                descripcion: "Desarrollo de un sistema integral para gestionar toda la información académica de la universidad, incluyendo matrículas, calificaciones y asistencia.",
                cuposDisponibles: 3,
                requisitos: "Conocimientos en React, Node.js, MongoDB",
                profesor: "Dr. Carlos Martínez",
                departamento: "Informática",
                fechaLimite: "2025-06-15"
            },
            {
                id: 2,
                titulo: "App de Tutorías UDP",
                fechaPublicacion: "2025-05-17",
                descripcion: "Aplicación móvil para conectar estudiantes con tutores académicos, con sistema de agenda y seguimiento de progreso.",
                cuposDisponibles: 2,
                requisitos: "Experiencia en Flutter, Firebase, diseño UX/UI",
                profesor: "Dra. Ana López",
                departamento: "Ingeniería",
                fechaLimite: "2025-06-10"
            },
            {
                id: 3,
                titulo: "Plataforma de Laboratorios Virtuales",
                fechaPublicacion: "2025-05-16",
                descripcion: "Desarrollo de simuladores virtuales para laboratorios de física, química y biología con realidad aumentada.",
                cuposDisponibles: 5,
                requisitos: "Conocimientos en Unity, Three.js, WebGL",
                profesor: "Dr. Javier Rodríguez",
                departamento: "Ciencias",
                fechaLimite: "2025-06-20"
            }
        ];

        const postulacionesEjemplo = [
            {
                id: 1,
                proyectoId: 1,
                estado: "Postulado",
                fechaPostulacion: "2025-05-19",
                estadoPostulacion: "En revisión",
                comentario: "Tengo experiencia previa con React en proyectos académicos.",
                motivacion: "He trabajado en dos proyectos similares durante mis cursos y estoy interesado en aplicar mis conocimientos en un entorno profesional. Como miembro del equipo de desarrollo, contribuí con el frontend utilizando React y la integración con APIs REST."
            }
        ];

        setProyectos(proyectosEjemplo);
        setPostulaciones(postulacionesEjemplo);
    }, []);

    const iniciarPostulacion = (proyecto) => {
        const estaPostulado = postulaciones.some(p => p.proyectoId === proyecto.id && p.estado === "Postulado");
        
        if (estaPostulado) {
            handleDespostular(proyecto.id);
        } else {
            setProyectoAPostular(proyecto);
            setMostrarFormularioPostulacion(true);
        }
    };

    const handleDespostular = (proyectoId) => {
        setPostulaciones(postulaciones.filter(p => p.proyectoId !== proyectoId));
        setMensaje(`Has cancelado tu postulación correctamente.`);
        setTimeout(() => setMensaje(""), 3000);
    };

    const cancelarPostulacion = () => {
        setMostrarFormularioPostulacion(false);
        setMotivacion("");
        setProyectoAPostular(null);
    };

    const confirmarPostulacion = () => {
        if (!motivacion.trim()) {
            setMensaje("Debes ingresar una motivación para postularte");
            setTimeout(() => setMensaje(""), 2500);
            return;
        }

        const nuevaPostulacion = {
            id: postulaciones.length + 1,
            proyectoId: proyectoAPostular.id,
            estado: "Postulado",
            estadoPostulacion: "En revisión",
            fechaPostulacion: new Date().toISOString().split('T')[0],
            comentario: "",
            motivacion: motivacion
        };

        setPostulaciones([...postulaciones, nuevaPostulacion]);
        setMensaje(`¡Te has postulado a "${proyectoAPostular.titulo}" correctamente!`);
        setMotivacion("");
        setMostrarFormularioPostulacion(false);
        setProyectoAPostular(null);
        setTimeout(() => setMensaje(""), 3000);
    };

    const getEstadoPostulacion = (proyectoId) => {
        const postulacion = postulaciones.find(p => p.proyectoId === proyectoId);
        return postulacion ? postulacion.estadoPostulacion : "No postulado";
    };

    const getMotivacionPostulacion = (proyectoId) => {
        const postulacion = postulaciones.find(p => p.proyectoId === proyectoId);
        return postulacion ? postulacion.motivacion : "";
    };

    const estaPostulado = (proyectoId) => {
        return postulaciones.some(p => p.proyectoId === proyectoId && p.estado === "Postulado");
    };

    const proyectosFiltrados = filtroEstado === "Todos" 
        ? proyectos 
        : filtroEstado === "Postulados" 
            ? proyectos.filter(p => estaPostulado(p.id))
            : proyectos.filter(p => !estaPostulado(p.id));

    return (
        <div style={{ padding: "40px", background: "linear-gradient(to bottom, #272627, #000000)", minHeight: "100vh" }}>
            <h1 style={{ color: "#fff", marginBottom: "24px" }}>Proyectos Disponibles</h1>
            
            {mostrarFormularioPostulacion && proyectoAPostular && (
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
                        background: "#403f3f",
                        borderRadius: "16px",
                        padding: "24px",
                        width: "600px",
                        maxWidth: "90%",
                        color: "#fff"
                    }}>
                        <h2 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            Postulación a: {proyectoAPostular.titulo}
                        </h2>
                        
                        <div style={{ 
                            background: "#555", 
                            padding: "16px", 
                            borderRadius: "8px",
                            margin: "16px 0"
                        }}>
                            <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>Requisitos:</p>
                            <p style={{ margin: 0 }}>{proyectoAPostular.requisitos}</p>
                        </div>
                        
                        <p style={{ margin: "16px 0" }}>Explica por qué eres el candidato adecuado para este proyecto:</p>
                        
                        <textarea
                            value={motivacion}
                            onChange={(e) => setMotivacion(e.target.value)}
                            rows={6}
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid #555",
                                background: "#333",
                                color: "#fff",
                                fontSize: "16px",
                                marginBottom: "16px"
                            }}
                            placeholder="Describe tus habilidades relevantes, experiencia previa y por qué te interesa este proyecto en particular..."
                        />
                        
                        {mensaje && (
                            <p style={{ 
                                color: "#f44336", 
                                marginBottom: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                    <line x1="12" y1="9" x2="12" y2="13"></line>
                                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                </svg>
                                {mensaje}
                            </p>
                        )}
                        
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px" }}>
                            <button
                                onClick={cancelarPostulacion}
                                style={{
                                    padding: "10px 20px",
                                    background: "#6c757d",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarPostulacion}
                                style={{
                                    padding: "10px 20px",
                                    background: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                Enviar Postulación
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div style={{
                background: "#403f3f",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                marginBottom: "24px"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ color: "#fff", margin: 0 }}>Explora los proyectos</h2>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ color: "#fff" }}>Filtrar:</span>
                        <select
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                borderRadius: "8px",
                                background: "#555",
                                color: "#fff",
                                border: "1px solid #666"
                            }}
                        >
                            <option value="Todos">Todos los proyectos</option>
                            <option value="Postulados">Mis postulaciones</option>
                            <option value="Disponibles">Disponibles</option>
                        </select>
                    </div>
                </div>

                {!seleccionado ? (
                    <>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", color: "#fff", borderCollapse: "collapse", minWidth: "800px" }}>
                                <thead>
                                    <tr style={{ background: "#333" }}>
                                        <th style={{ padding: "12px", textAlign: "left", borderRadius: "8px 0 0 8px" }}>Proyecto</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Profesor</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Cupos</th>
                                        <th style={{ padding: "12px", textAlign: "center" }}>Estado</th>
                                        <th style={{ padding: "12px", textAlign: "center", borderRadius: "0 8px 8px 0" }}>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proyectosFiltrados.map((proyecto) => {
                                        const postulado = estaPostulado(proyecto.id);
                                        const estado = getEstadoPostulacion(proyecto.id);
                                        
                                        return (
                                            <tr key={proyecto.id} style={{ background: "#555", borderBottom: "8px solid #403f3f" }}>
                                                <td style={{ padding: "12px" }}>
                                                    <div style={{ fontWeight: "bold" }}>{proyecto.titulo}</div>
                                                    <div style={{ fontSize: "0.85rem", color: "#bbb" }}>{proyecto.departamento}</div>
                                                </td>
                                                <td style={{ padding: "12px" }}>{proyecto.profesor}</td>
                                                <td style={{ padding: "12px" }}>{proyecto.cuposDisponibles}</td>
                                                <td style={{ padding: "12px", textAlign: "center" }}>
                                                    <span style={{
                                                        display: "inline-block",
                                                        padding: "4px 12px",
                                                        borderRadius: "20px",
                                                        background: postulado 
                                                            ? estado === "Aprobada"
                                                                ? "rgba(76, 175, 80, 0.2)"
                                                                : estado === "Rechazada"
                                                                    ? "rgba(244, 67, 54, 0.2)"
                                                                    : "rgba(255, 193, 7, 0.2)"
                                                            : "transparent",
                                                        color: postulado
                                                            ? estado === "Aprobada"
                                                                ? "#4caf50"
                                                                : estado === "Rechazada"
                                                                    ? "#f44336"
                                                                    : "#ffc107"
                                                            : "#bbb",
                                                        fontWeight: "bold",
                                                        fontSize: "0.85rem"
                                                    }}>
                                                        {postulado ? estado : "Disponible"}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "12px", textAlign: "center" }}>
                                                    <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                                        <button
                                                            style={{
                                                                padding: "8px 16px",
                                                                borderRadius: "8px",
                                                                border: "none",
                                                                background: "#007bff",
                                                                color: "#fff",
                                                                cursor: "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px"
                                                            }}
                                                            onClick={() => setSeleccionado(proyecto)}
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                                <circle cx="12" cy="12" r="3"></circle>
                                                            </svg>
                                                            Detalles
                                                        </button>
                                                        <button
                                                            style={{
                                                                padding: "8px 16px",
                                                                borderRadius: "8px",
                                                                border: "none",
                                                                background: postulado ? "#dc3545" : "#28a745",
                                                                color: "#fff",
                                                                cursor: "pointer",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: "8px"
                                                            }}
                                                            onClick={() => iniciarPostulacion(proyecto)}
                                                        >
                                                            {postulado ? (
                                                                <>
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                                                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                                                        <polyline points="7 3 7 8 15 8"></polyline>
                                                                    </svg>
                                                                    Cancelar
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                        <path d="M12 20h9"></path>
                                                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                                                    </svg>
                                                                    Postularme
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {proyectosFiltrados.length === 0 && (
                            <div style={{ 
                                background: "#555", 
                                padding: "24px", 
                                borderRadius: "8px", 
                                textAlign: "center",
                                marginTop: "16px"
                            }}>
                                <p style={{ color: "#fff" }}>
                                    {filtroEstado === "Todos" 
                                        ? "No hay proyectos disponibles en este momento." 
                                        : filtroEstado === "Postulados"
                                            ? "No tienes postulaciones activas."
                                            : "No hay proyectos disponibles para postular."}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ color: "#fff" }}>
                        <button
                            onClick={() => setSeleccionado(null)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "24px",
                                background: "none",
                                border: "none",
                                color: "#007bff",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "1rem"
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M19 12H5M12 19l-7-7 7-7"></path>
                            </svg>
                            Volver al listado
                        </button>

                        <div style={{ 
                            background: "#555", 
                            borderRadius: "12px", 
                            padding: "24px",
                            marginBottom: "24px"
                        }}>
                            <h2 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: "12px" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                {seleccionado.titulo}
                            </h2>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                                <div>
                                    <h3 style={{ color: "#bbb", marginBottom: "12px" }}>Información del Proyecto</h3>
                                    <p><strong>Profesor responsable:</strong> {seleccionado.profesor}</p>
                                    <p><strong>Departamento:</strong> {seleccionado.departamento}</p>
                                    <p><strong>Cupos disponibles:</strong> {seleccionado.cuposDisponibles}</p>
                                </div>
                                
                                <div>
                                    <h3 style={{ color: "#bbb", marginBottom: "12px" }}>Detalles</h3>
                                    <p><strong>Publicado:</strong> {seleccionado.fechaPublicacion}</p>
                                    <p><strong>Fecha límite:</strong> {seleccionado.fechaLimite}</p>
                                    <p><strong>Requisitos:</strong> {seleccionado.requisitos}</p>
                                </div>
                            </div>
                            
                            <div style={{ marginTop: "24px" }}>
                                <h3 style={{ color: "#bbb", marginBottom: "12px" }}>Descripción</h3>
                                <div style={{ 
                                    background: "#444", 
                                    padding: "16px", 
                                    borderRadius: "8px",
                                    lineHeight: "1.6"
                                }}>
                                    {seleccionado.descripcion}
                                </div>
                            </div>
                        </div>

                        <div style={{ 
                            background: "#555", 
                            borderRadius: "12px", 
                            padding: "24px"
                        }}>
                            <h3 style={{ marginTop: 0, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffc107">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                Mi Postulación
                            </h3>
                            
                            {estaPostulado(seleccionado.id) ? (
                                <>
                                    <div style={{ 
                                        background: "#444", 
                                        padding: "16px", 
                                        borderRadius: "8px",
                                        marginBottom: "20px"
                                    }}>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                            <div>
                                                <p><strong>Estado:</strong></p>
                                                <span style={{
                                                    display: "inline-block",
                                                    padding: "4px 12px",
                                                    borderRadius: "20px",
                                                    background: getEstadoPostulacion(seleccionado.id) === "Aprobada"
                                                        ? "rgba(76, 175, 80, 0.2)"
                                                        : getEstadoPostulacion(seleccionado.id) === "Rechazada"
                                                            ? "rgba(244, 67, 54, 0.2)"
                                                            : "rgba(255, 193, 7, 0.2)",
                                                    color: getEstadoPostulacion(seleccionado.id) === "Aprobada"
                                                        ? "#4caf50"
                                                        : getEstadoPostulacion(seleccionado.id) === "Rechazada"
                                                            ? "#f44336"
                                                            : "#ffc107",
                                                    fontWeight: "bold"
                                                }}>
                                                    {getEstadoPostulacion(seleccionado.id)}
                                                </span>
                                            </div>
                                            <div>
                                                <p><strong>Fecha de postulación:</strong></p>
                                                <p>{postulaciones.find(p => p.proyectoId === seleccionado.id)?.fechaPostulacion}</p>
                                            </div>
                                        </div>
                                        
                                        <div style={{ marginTop: "16px" }}>
                                            <p><strong>Mi motivación:</strong></p>
                                            <div style={{ 
                                                background: "#333", 
                                                padding: "12px", 
                                                borderRadius: "8px",
                                                marginTop: "8px",
                                                lineHeight: "1.6"
                                            }}>
                                                {getMotivacionPostulacion(seleccionado.id)}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button
                                        style={{
                                            padding: "12px 24px",
                                            borderRadius: "8px",
                                            border: "none",
                                            background: "#dc3545",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            margin: "0 auto"
                                        }}
                                        onClick={() => iniciarPostulacion(seleccionado)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                            <polyline points="7 3 7 8 15 8"></polyline>
                                        </svg>
                                        Cancelar postulación
                                    </button>
                                </>
                            ) : (
                                <div style={{ textAlign: "center" }}>
                                    <p style={{ marginBottom: "20px" }}>No estás postulado a este proyecto.</p>
                                    <button
                                        style={{
                                            padding: "12px 24px",
                                            borderRadius: "8px",
                                            border: "none",
                                            background: "#28a745",
                                            color: "#fff",
                                            fontWeight: "bold",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            margin: "0 auto"
                                        }}
                                        onClick={() => iniciarPostulacion(seleccionado)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                        </svg>
                                        Postularme a este proyecto
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {mensaje && !mostrarFormularioPostulacion && (
                <div style={{
                    position: "fixed",
                    bottom: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#28a745",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    zIndex: 1000,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <path d="M22 4L12 14.01l-3-3"></path>
                    </svg>
                    {mensaje}
                </div>
            )}
        </div>
    );
}