import { useEffect, useState } from "react";

export function DashboardProfe() {
    const [postulaciones, setPostulaciones] = useState([]);
    const [seleccionada, setSeleccionada] = useState(null);
    const [comentario, setComentario] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("Todas");

    useEffect(() => {
        // Datos de ejemplo con más información
        const datosEjemplo = [
            {
                id: 1,
                estudiante: "Claudio Bravo",
                email: "claudio.bravo@mail.udp.cl",
                carrera: "Ingeniería Civil Informática",
                proyecto: "Sistema de Gestión Académica",
                fecha: "2025-05-18",
                estado: "Pendiente",
                descripcion: "Sistema para gestionar la información académica de los estudiantes y profesores.",
                motivacion: "Tengo experiencia desarrollando sistemas web con React y Node.js, y me interesa aplicar estos conocimientos en un proyecto real."
            },
            {
                id: 2,
                estudiante: "Andrés Soto",
                email: "andres.soto@mail.udp.cl",
                carrera: "Diseño de Productos Digitales",
                proyecto: "App de Tutorías UDP",
                fecha: "2025-05-17",
                estado: "Aprobada",
                descripcion: "Aplicación móvil para gestionar las tutorías entre estudiantes y profesores.",
                motivacion: "Como diseñador UX/UI, quiero contribuir a mejorar la experiencia de tutorías en la universidad.",
                comentario: "Excelente perfil para el desarrollo frontend."
            },
            {
                id: 3,
                estudiante: "María Pérez",
                email: "maria.perez@mail.udp.cl",
                carrera: "Ingeniería Civil en Computación",
                proyecto: "Plataforma de Laboratorios Virtuales",
                fecha: "2025-05-16",
                estado: "Rechazada",
                descripcion: "Plataforma para realizar experimentos de laboratorio de forma virtual.",
                motivacion: "He trabajado con Unity en proyectos personales y quiero profesionalizar mis habilidades.",
                comentario: "Proyecto requiere más experiencia en desarrollo 3D."
            },
            {
                id: 4,
                estudiante: "Juan González",
                email: "juan.gonzalez@mail.udp.cl",
                carrera: "Ingeniería Civil Informática",
                proyecto: "Sistema de Gestión Académica",
                fecha: "2025-05-15",
                estado: "Pendiente",
                descripcion: "Sistema para gestionar la información académica de los estudiantes y profesores.",
                motivacion: "Busco experiencia en desarrollo de sistemas empresariales antes de graduarme."
            }
        ];
        setPostulaciones(datosEjemplo);
    }, []);

    const handleVeredicto = (veredicto) => {
        if (!seleccionada) return;

        setPostulaciones(postulaciones.map(p =>
            p.id === seleccionada.id
                ? { ...p, estado: veredicto, comentario }
                : p
        ));
        setMensaje(`Postulación ${veredicto === "Aprobada" ? "aprobada" : "rechazada"} correctamente.`);
        setSeleccionada(null);
        setComentario("");
        setTimeout(() => setMensaje(""), 3000);
    };

    const postulacionesFiltradas = filtroEstado === "Todas" 
        ? postulaciones 
        : postulaciones.filter(p => p.estado === filtroEstado);

    return (
        <div style={{ padding: "40px", background: "#222", minHeight: "100vh" }}>
            <h1 style={{ color: "#fff", marginBottom: "24px" }}>Postulaciones de Proyectos</h1>
            
            <div style={{
                background: "#403f3f",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                marginBottom: "24px"
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ color: "#fff", margin: 0 }}>Gestión de Postulaciones</h2>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ color: "#fff" }}>Filtrar por estado:</span>
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
                            <option value="Todas">Todas</option>
                            <option value="Pendiente">Pendientes</option>
                            <option value="Aprobada">Aprobadas</option>
                            <option value="Rechazada">Rechazadas</option>
                        </select>
                    </div>
                </div>

                {!seleccionada ? (
                    <>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", color: "#fff", borderCollapse: "collapse", minWidth: "800px" }}>
                                <thead>
                                    <tr style={{ background: "#333" }}>
                                        <th style={{ padding: "12px", textAlign: "left", borderRadius: "8px 0 0 8px" }}>Estudiante</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Carrera</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Proyecto</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Fecha</th>
                                        <th style={{ padding: "12px", textAlign: "center" }}>Estado</th>
                                        <th style={{ padding: "12px", textAlign: "center", borderRadius: "0 8px 8px 0" }}>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {postulacionesFiltradas.map((p) => (
                                        <tr key={p.id} style={{ background: "#555", borderBottom: "8px solid #403f3f" }}>
                                            <td style={{ padding: "12px" }}>
                                                <div style={{ fontWeight: "bold" }}>{p.estudiante}</div>
                                                <div style={{ fontSize: "0.85rem", color: "#bbb" }}>{p.email}</div>
                                            </td>
                                            <td style={{ padding: "12px" }}>{p.carrera}</td>
                                            <td style={{ padding: "12px" }}>{p.proyecto}</td>
                                            <td style={{ padding: "12px" }}>{p.fecha}</td>
                                            <td style={{ padding: "12px", textAlign: "center" }}>
                                                <span style={{
                                                    display: "inline-block",
                                                    padding: "4px 12px",
                                                    borderRadius: "20px",
                                                    background:
                                                        p.estado === "Aprobada"
                                                            ? "rgba(76, 175, 80, 0.2)"
                                                            : p.estado === "Rechazada"
                                                                ? "rgba(244, 67, 54, 0.2)"
                                                                : "rgba(255, 193, 7, 0.2)",
                                                    color:
                                                        p.estado === "Aprobada"
                                                            ? "#4caf50"
                                                            : p.estado === "Rechazada"
                                                                ? "#f44336"
                                                                : "#ffc107",
                                                    fontWeight: "bold",
                                                    fontSize: "0.85rem"
                                                }}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td style={{ padding: "12px", textAlign: "center" }}>
                                                <button
                                                    style={{
                                                        padding: "8px 16px",
                                                        borderRadius: "8px",
                                                        border: "none",
                                                        background: "#007bff",
                                                        color: "#fff",
                                                        cursor: "pointer",
                                                        fontWeight: "bold",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "8px",
                                                        margin: "0 auto"
                                                    }}
                                                    onClick={() => setSeleccionada(p)}
                                                >
                                                    <span>Revisar</span>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {postulacionesFiltradas.length === 0 && (
                            <div style={{ 
                                background: "#555", 
                                padding: "24px", 
                                borderRadius: "8px", 
                                textAlign: "center",
                                marginTop: "16px"
                            }}>
                                <p style={{ color: "#fff" }}>
                                    {filtroEstado === "Todas" 
                                        ? "No hay postulaciones registradas." 
                                        : `No hay postulaciones ${filtroEstado.toLowerCase()}.`}
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ color: "#fff" }}>
                        <button
                            onClick={() => setSeleccionada(null)}
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
                            <h2 style={{ marginTop: 0 }}>Detalle de la Postulación</h2>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div>
                                    <h3 style={{ color: "#bbb", marginBottom: "12px" }}>Información del Estudiante</h3>
                                    <p><strong>Nombre:</strong> {seleccionada.estudiante}</p>
                                    <p><strong>Email:</strong> {seleccionada.email}</p>
                                    <p><strong>Carrera:</strong> {seleccionada.carrera}</p>
                                </div>
                                
                                <div>
                                    <h3 style={{ color: "#bbb", marginBottom: "12px" }}>Información del Proyecto</h3>
                                    <p><strong>Proyecto:</strong> {seleccionada.proyecto}</p>
                                    <p><strong>Fecha postulación:</strong> {seleccionada.fecha}</p>
                                    <p>
                                        <strong>Estado:</strong> 
                                        <span style={{
                                            display: "inline-block",
                                            marginLeft: "8px",
                                            padding: "4px 12px",
                                            borderRadius: "20px",
                                            background:
                                                seleccionada.estado === "Aprobada"
                                                    ? "rgba(76, 175, 80, 0.2)"
                                                    : seleccionada.estado === "Rechazada"
                                                        ? "rgba(244, 67, 54, 0.2)"
                                                        : "rgba(255, 193, 7, 0.2)",
                                            color:
                                                seleccionada.estado === "Aprobada"
                                                    ? "#4caf50"
                                                    : seleccionada.estado === "Rechazada"
                                                        ? "#f44336"
                                                        : "#ffc107",
                                            fontWeight: "bold",
                                            fontSize: "0.85rem"
                                        }}>
                                            {seleccionada.estado}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            
                            <div style={{ marginTop: "24px" }}>
                                <h3 style={{ color: "#bbb", marginBottom: "12px" }}>Motivación del Estudiante</h3>
                                <div style={{ 
                                    background: "#444", 
                                    padding: "16px", 
                                    borderRadius: "8px",
                                    lineHeight: "1.6"
                                }}>
                                    {seleccionada.motivacion}
                                </div>
                            </div>
                            
                            <div style={{ marginTop: "24px" }}>
                                <h3 style={{ color: "#bbb", marginBottom: "12px" }}>Descripción del Proyecto</h3>
                                <div style={{ 
                                    background: "#444", 
                                    padding: "16px", 
                                    borderRadius: "8px",
                                    lineHeight: "1.6"
                                }}>
                                    {seleccionada.descripcion}
                                </div>
                            </div>
                        </div>

                        <div style={{ 
                            background: "#555", 
                            borderRadius: "12px", 
                            padding: "24px",
                            marginBottom: "24px"
                        }}>
                            <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Evaluación</h3>
                            
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
                                    Comentario para el estudiante:
                                </label>
                                <textarea
                                    value={comentario}
                                    onChange={e => setComentario(e.target.value)}
                                    rows={4}
                                    style={{
                                        width: "100%",
                                        borderRadius: "10px",
                                        border: "1px solid #666",
                                        padding: "12px",
                                        fontSize: "1rem",
                                        resize: "vertical",
                                        background: "#444",
                                        color: "#fff"
                                    }}
                                    placeholder="Escribe tus comentarios, sugerencias o razones para aprobar/rechazar..."
                                />
                            </div>
                            
                            <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                                <button
                                    style={{
                                        padding: "12px 24px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "#6c757d",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                    onClick={() => {
                                        setSeleccionada(null);
                                        setComentario("");
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    style={{
                                        padding: "12px 24px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "#f44336",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                    onClick={() => handleVeredicto("Rechazada")}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18M6 6l12 12"></path>
                                    </svg>
                                    Rechazar
                                </button>
                                <button
                                    style={{
                                        padding: "12px 24px",
                                        borderRadius: "8px",
                                        border: "none",
                                        background: "#4caf50",
                                        color: "#fff",
                                        fontWeight: "bold",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}
                                    onClick={() => handleVeredicto("Aprobada")}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M20 6L9 17l-5-5"></path>
                                    </svg>
                                    Aprobar
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
                        background: "#4caf50",
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
        </div>
    );
}