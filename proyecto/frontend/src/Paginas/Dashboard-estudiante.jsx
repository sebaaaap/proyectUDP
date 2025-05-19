import { useEffect, useState } from "react";

export function DashboardEstudiante() {
    const [proyectos, setProyectos] = useState([]);
    const [postulaciones, setPostulaciones] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [mostrarFormularioPostulacion, setMostrarFormularioPostulacion] = useState(false);
    const [motivacion, setMotivacion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [proyectoAPostular, setProyectoAPostular] = useState(null);

    useEffect(() => {
        // Datos de ejemplo de proyectos disponibles
        const proyectosEjemplo = [
            {
                id: 1,
                titulo: "Sistema de Gestión Académica",
                fechaPublicacion: "2025-05-18",
                descripcion: "Sistema para gestionar la información académica de los estudiantes y profesores.",
                cuposDisponibles: 3,
                requisitos: "Conocimientos en React y Node.js"
            },
            {
                id: 2,
                titulo: "App de Tutorías UDP",
                fechaPublicacion: "2025-05-17",
                descripcion: "Aplicación móvil para gestionar las tutorías entre estudiantes y profesores.",
                cuposDisponibles: 2,
                requisitos: "Experiencia en desarrollo móvil con Flutter"
            },
            {
                id: 3,
                titulo: "Plataforma de Laboratorios Virtuales",
                fechaPublicacion: "2025-05-16",
                descripcion: "Plataforma para realizar experimentos de laboratorio de forma virtual.",
                cuposDisponibles: 5,
                requisitos: "Conocimientos en Unity o Three.js"
            }
        ];

        // Datos de ejemplo de postulaciones del estudiante
        const postulacionesEjemplo = [
            {
                id: 1,
                proyectoId: 1,
                estado: "Postulado",
                fechaPostulacion: "2025-05-19",
                comentario: "Tengo experiencia previa con React en proyectos académicos.",
                motivacion: "He trabajado en dos proyectos similares durante mis cursos y estoy interesado en aplicar mis conocimientos."
            }
        ];

        setProyectos(proyectosEjemplo);
        setPostulaciones(postulacionesEjemplo);
    }, []);

    const iniciarPostulacion = (proyecto) => {
        const estaPostulado = postulaciones.some(p => p.proyectoId === proyecto.id && p.estado === "Postulado");
        
        if (estaPostulado) {
            // Si ya está postulado, despostular
            handleDespostular(proyecto.id);
        } else {
            // Si no está postulado, iniciar proceso de postulación
            setProyectoAPostular(proyecto);
            setMostrarFormularioPostulacion(true);
        }
    };

    const handleDespostular = (proyectoId) => {
        // Aquí iría la petición al backend para despostularse
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

        // Aquí iría la petición al backend para postularse
        const nuevaPostulacion = {
            id: postulaciones.length + 1,
            proyectoId: proyectoAPostular.id,
            estado: "Postulado",
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
        return postulacion ? postulacion.estado : "No postulado";
    };

    const getMotivacionPostulacion = (proyectoId) => {
        const postulacion = postulaciones.find(p => p.proyectoId === proyectoId);
        return postulacion ? postulacion.motivacion : "";
    };

    const estaPostulado = (proyectoId) => {
        return postulaciones.some(p => p.proyectoId === proyectoId && p.estado === "Postulado");
    };

    return (
        <div style={{ padding: "40px", background: "#222", minHeight: "100vh" }}>
            <h1 style={{ color: "#fff", marginBottom: "32px" }}>Proyectos Disponibles</h1>
            
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
                        <h2>Postulación a: {proyectoAPostular.titulo}</h2>
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
                            placeholder="Describa sus habilidades, experiencia y motivación para este proyecto específico..."
                        />
                        
                        {mensaje && (
                            <p style={{ color: "#f44336", marginBottom: "16px" }}>{mensaje}</p>
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
                                    cursor: "pointer"
                                }}
                            >
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
                                    cursor: "pointer"
                                }}
                            >
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
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
            }}>
                {!seleccionado ? (
                    <>
                        <table style={{ width: "100%", color: "#fff", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#333" }}>
                                    <th style={{ padding: "12px", borderRadius: "8px 0 0 8px" }}>Proyecto</th>
                                    <th style={{ padding: "12px" }}>Fecha Publicación</th>
                                    <th style={{ padding: "12px" }}>Cupos</th>
                                    <th style={{ padding: "12px" }}>Estado</th>
                                    <th style={{ padding: "12px", borderRadius: "0 8px 8px 0" }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proyectos.map((proyecto) => {
                                    const estado = getEstadoPostulacion(proyecto.id);
                                    const postulado = estaPostulado(proyecto.id);
                                    
                                    return (
                                        <tr key={proyecto.id} style={{ background: "#555", marginBottom: "8px" }}>
                                            <td style={{ padding: "10px" }}>{proyecto.titulo}</td>
                                            <td style={{ padding: "10px" }}>{proyecto.fechaPublicacion}</td>
                                            <td style={{ padding: "10px" }}>{proyecto.cuposDisponibles}</td>
                                            <td style={{
                                                padding: "10px",
                                                color: estado === "Postulado" ? "#4caf50" : "#ffc107",
                                                fontWeight: "bold"
                                            }}>
                                                {estado}
                                            </td>
                                            <td style={{ padding: "10px" }}>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button
                                                        style={{
                                                            padding: "6px 12px",
                                                            borderRadius: "8px",
                                                            border: "none",
                                                            background: "#007bff",
                                                            color: "#fff",
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() => setSeleccionado(proyecto)}
                                                    >
                                                        Ver
                                                    </button>
                                                    <button
                                                        style={{
                                                            padding: "6px 12px",
                                                            borderRadius: "8px",
                                                            border: "none",
                                                            background: postulado ? "#dc3545" : "#28a745",
                                                            color: "#fff",
                                                            cursor: "pointer"
                                                        }}
                                                        onClick={() => iniciarPostulacion(proyecto)}
                                                    >
                                                        {postulado ? "Despostularme" : "Postularme"}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {proyectos.length === 0 && (
                            <p style={{ color: "#fff", textAlign: "center", marginTop: "24px" }}>
                                No hay proyectos disponibles en este momento.
                            </p>
                        )}
                        {mensaje && !mostrarFormularioPostulacion && (
                            <p style={{ color: "#4caf50", textAlign: "center", marginTop: "18px" }}>
                                {mensaje}
                            </p>
                        )}
                    </>
                ) : (
                    <div style={{ color: "#fff" }}>
                        <button
                            onClick={() => setSeleccionado(null)}
                            style={{
                                marginBottom: "18px",
                                background: "none",
                                border: "none",
                                color: "#007bff",
                                cursor: "pointer",
                                fontWeight: "bold",
                                fontSize: "1rem"
                            }}
                        >
                            ← Volver al listado
                        </button>
                        <h2>{seleccionado.titulo}</h2>
                        <p><strong>Publicado:</strong> {seleccionado.fechaPublicacion}</p>
                        <p><strong>Cupos disponibles:</strong> {seleccionado.cuposDisponibles}</p>
                        <p><strong>Requisitos:</strong> {seleccionado.requisitos}</p>
                        <p><strong>Descripción:</strong> {seleccionado.descripcion}</p>
                        
                        <div style={{ marginTop: "24px", background: "#333", padding: "16px", borderRadius: "8px" }}>
                            <p>
                                <strong>Tu estado: </strong>
                                <span style={{
                                    color: getEstadoPostulacion(seleccionado.id) === "Postulado" ? "#4caf50" : "#ffc107",
                                    fontWeight: "bold"
                                }}>
                                    {getEstadoPostulacion(seleccionado.id)}
                                </span>
                            </p>
                            
                            {estaPostulado(seleccionado.id) && (
                                <div style={{ marginTop: "16px" }}>
                                    <p><strong>Tu motivación:</strong></p>
                                    <p style={{ background: "#444", padding: "12px", borderRadius: "8px" }}>
                                        {getMotivacionPostulacion(seleccionado.id)}
                                    </p>
                                </div>
                            )}
                            
                            <button
                                style={{
                                    padding: "10px 24px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: estaPostulado(seleccionado.id) ? "#dc3545" : "#28a745",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    marginTop: "16px"
                                }}
                                onClick={() => iniciarPostulacion(seleccionado)}
                            >
                                {estaPostulado(seleccionado.id) ? "Despostularme" : "Postularme"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}