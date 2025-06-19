import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function DashboardProfe() {
    const [proyectos, setProyectos] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const [comentario, setComentario] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { token, user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && token) {
            cargarProyectos();
        }
    }, [token, isAuthenticated]);

    const cargarProyectos = async () => {
        try {
            setLoading(true);
            const headers = {
                'Content-Type': 'application/json'
            };
            
            // Si tenemos token, lo agregamos al header
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch("http://localhost:8000/proyectos/usuario/profesor", {
                method: 'GET',
                headers: headers,
                credentials: 'include'
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error response:', errorData);
                throw new Error(`Error al cargar los proyectos: ${response.status}`);
            }
            
            const data = await response.json();
            setProyectos(data);
        } catch (err) {
            console.error('Error:', err);
            setError('Error al cargar los proyectos');
            // Fallback a datos de ejemplo si hay error
            const datosEjemplo = [
                {
                    id: 1,
                    titulo: "Sistema de Gestión Académica",
                    descripcion: "Sistema para gestionar la información académica de los estudiantes y profesores.",
                    estado: "propuesto",
                    creador: {
                        nombre: "Claudio Bravo",
                        email: "claudio.bravo@mail.udp.cl"
                    },
                    postulaciones_pendientes: 2,
                    postulaciones_aceptadas: 1,
                    fecha_creacion: "2025-01-15"
                },
                {
                    id: 2,
                    titulo: "App de Tutorías UDP",
                    descripcion: "Aplicación móvil para gestionar las tutorías entre estudiantes y profesores.",
                    estado: "aprobado",
                    creador: {
                        nombre: "Andrés Soto",
                        email: "andres.soto@mail.udp.cl"
                    },
                    postulaciones_pendientes: 0,
                    postulaciones_aceptadas: 3,
                    fecha_creacion: "2025-01-10"
                },
                {
                    id: 3,
                    titulo: "Plataforma de Laboratorios Virtuales",
                    descripcion: "Plataforma para realizar experimentos de laboratorio de forma virtual.",
                    estado: "rechazado",
                    creador: {
                        nombre: "María Pérez",
                        email: "maria.perez@mail.udp.cl"
                    },
                    postulaciones_pendientes: 1,
                    postulaciones_aceptadas: 0,
                    fecha_creacion: "2025-01-05"
                }
            ];
            setProyectos(datosEjemplo);
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarEstado = async (nuevoEstado) => {
        if (!seleccionado) return;

        try {
            const headers = {
                "Content-Type": "application/json"
            };
            
            // Si tenemos token, lo agregamos al header
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`http://localhost:8000/profesor/proyectos/${seleccionado.id}/estado`, {
                method: "PATCH",
                headers: headers,
                credentials: 'include',
                body: JSON.stringify({ 
                    estado: nuevoEstado
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error response:', errorData);
                throw new Error(`Error al actualizar el proyecto: ${response.status}`);
            }

            // Actualizar el estado local
            setProyectos(proyectos.map(p =>
                p.id === seleccionado.id
                    ? { ...p, estado: nuevoEstado }
                    : p
            ));
            
            setMensaje(`Proyecto ${nuevoEstado === "aprobado" ? "aprobado" : "rechazado"} correctamente.`);
            setSeleccionado(null);
            setComentario("");
            setTimeout(() => setMensaje(""), 3000);
        } catch (err) {
            console.error('Error:', err);
            setMensaje("Error al procesar la solicitud. Por favor, intenta nuevamente.");
            setTimeout(() => setMensaje(""), 3000);
        }
    };

    const proyectosFiltrados = filtroEstado === "Todos" 
        ? proyectos 
        : proyectos.filter(p => {
            if (filtroEstado === "Propuesto") return p.estado === "propuesto";
            if (filtroEstado === "Aprobado") return p.estado === "aprobado";
            if (filtroEstado === "Rechazado") return p.estado === "rechazado";
            return true;
        });

    const getEstadoDisplay = (estado) => {
        switch (estado) {
            case "aprobado": return "Aprobado";
            case "rechazado": return "Rechazado";
            case "propuesto": return "Propuesto";
            default: return estado;
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case "aprobado": return { background: "rgba(76, 175, 80, 0.2)", color: "#4caf50" };
            case "rechazado": return { background: "rgba(244, 67, 54, 0.2)", color: "#f44336" };
            case "propuesto": return { background: "rgba(255, 193, 7, 0.2)", color: "#ffc107" };
            default: return { background: "rgba(255, 193, 7, 0.2)", color: "#ffc107" };
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "40px", background: "linear-gradient(to bottom, #272627, #000000)", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ color: "#fff", fontSize: "1.2rem" }}>Cargando proyectos...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div style={{ padding: "40px", background: "linear-gradient(to bottom, #272627, #000000)", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ color: "#fff", fontSize: "1.2rem" }}>Debes iniciar sesión para ver tus proyectos.</div>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px", background: "linear-gradient(to bottom, #272627, #000000)", minHeight: "100vh" }}>
            <h1 style={{ color: "#fff", marginBottom: "24px" }}>Mis Proyectos Asignados</h1>
            
            {error && (
                <div style={{
                    background: "#f44336",
                    color: "#fff",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    marginBottom: "24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    {error}
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
                    <h2 style={{ color: "#fff", margin: 0 }}>Gestión de Proyectos</h2>
                    
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
                            <option value="Todos">Todos</option>
                            <option value="Propuesto">Propuestos</option>
                            <option value="Aprobado">Aprobados</option>
                            <option value="Rechazado">Rechazados</option>
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
                                        <th style={{ padding: "12px", textAlign: "left" }}>Creador</th>
                                        <th style={{ padding: "12px", textAlign: "left" }}>Fecha</th>
                                        <th style={{ padding: "12px", textAlign: "center" }}>Estado</th>
                                        <th style={{ padding: "12px", textAlign: "center" }}>Postulaciones</th>
                                        <th style={{ padding: "12px", textAlign: "center", borderRadius: "0 8px 8px 0" }}>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proyectosFiltrados.map((p) => {
                                        const estadoColors = getEstadoColor(p.estado);
                                        return (
                                            <tr key={p.id} style={{ background: "#555", borderBottom: "8px solid #403f3f" }}>
                                                <td style={{ padding: "12px" }}>
                                                    <div style={{ fontWeight: "bold" }}>{p.titulo}</div>
                                                    <div style={{ fontSize: "0.85rem", color: "#bbb", marginTop: "4px" }}>
                                                        {p.descripcion.length > 60 ? p.descripcion.substring(0, 60) + "..." : p.descripcion}
                                                    </div>
                                                </td>
                                                <td style={{ padding: "12px" }}>
                                                    <div style={{ fontWeight: "bold" }}>{p.creador?.nombre || "N/A"}</div>
                                                    <div style={{ fontSize: "0.85rem", color: "#bbb" }}>{p.creador?.email || "N/A"}</div>
                                                </td>
                                                <td style={{ padding: "12px" }}>
                                                    {p.fecha_creacion ? new Date(p.fecha_creacion).toLocaleDateString('es-ES') : "N/A"}
                                                </td>
                                                <td style={{ padding: "12px", textAlign: "center" }}>
                                                    <span style={{
                                                        display: "inline-block",
                                                        padding: "4px 12px",
                                                        borderRadius: "20px",
                                                        background: estadoColors.background,
                                                        color: estadoColors.color,
                                                        fontWeight: "bold",
                                                        fontSize: "0.85rem"
                                                    }}>
                                                        {getEstadoDisplay(p.estado)}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "12px", textAlign: "center" }}>
                                                    <div style={{ fontSize: "0.85rem" }}>
                                                        <div style={{ color: "#ffc107" }}>Pendientes: {p.postulaciones_pendientes}</div>
                                                        <div style={{ color: "#4caf50" }}>Aceptadas: {p.postulaciones_aceptadas}</div>
                                                    </div>
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
                                                        onClick={() => setSeleccionado(p)}
                                                    >
                                                        <span>Revisar</span>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                            <circle cx="12" cy="12" r="3"></circle>
                                                        </svg>
                                                    </button>
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
                                        ? "No hay proyectos asignados." 
                                        : `No hay proyectos ${filtroEstado.toLowerCase()}.`}
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
                            <h2 style={{ marginTop: 0 }}>Detalle del Proyecto</h2>
                            
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div>
                                    <h3 style={{ color: "#bbb", marginBottom: "12px" }}>Información del Proyecto</h3>
                                    <p><strong>Título:</strong> {seleccionado.titulo}</p>
                                    <p><strong>Estado:</strong> 
                                        <span style={{
                                            display: "inline-block",
                                            marginLeft: "8px",
                                            padding: "4px 12px",
                                            borderRadius: "20px",
                                            ...getEstadoColor(seleccionado.estado),
                                            fontWeight: "bold",
                                            fontSize: "0.85rem"
                                        }}>
                                            {getEstadoDisplay(seleccionado.estado)}
                                        </span>
                                    </p>
                                    <p><strong>Fecha creación:</strong> {seleccionado.fecha_creacion ? new Date(seleccionado.fecha_creacion).toLocaleDateString('es-ES') : "N/A"}</p>
                                </div>
                                
                                <div>
                                    <h3 style={{ color: "#bbb", marginBottom: "12px" }}>Información del Creador</h3>
                                    <p><strong>Nombre:</strong> {seleccionado.creador?.nombre || "N/A"}</p>
                                    <p><strong>Email:</strong> {seleccionado.creador?.email || "N/A"}</p>
                                    <p><strong>Postulaciones pendientes:</strong> {seleccionado.postulaciones_pendientes}</p>
                                    <p><strong>Postulaciones aceptadas:</strong> {seleccionado.postulaciones_aceptadas}</p>
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
                                    {seleccionado.descripcion}
                                </div>
                            </div>

                            {seleccionado.resumen && (
                                <div style={{ marginTop: "24px" }}>
                                    <h3 style={{ color: "#bbb", marginBottom: "12px" }}>Resumen</h3>
                                    <div style={{ 
                                        background: "#444", 
                                        padding: "16px", 
                                        borderRadius: "8px",
                                        lineHeight: "1.6"
                                    }}>
                                        {seleccionado.resumen}
                                    </div>
                                </div>
                            )}

                            {seleccionado.problema && (
                                <div style={{ marginTop: "24px" }}>
                                    <h3 style={{ color: "#bbb", marginBottom: "12px" }}>Problema</h3>
                                    <div style={{ 
                                        background: "#444", 
                                        padding: "16px", 
                                        borderRadius: "8px",
                                        lineHeight: "1.6"
                                    }}>
                                        {seleccionado.problema}
                                    </div>
                                </div>
                            )}
                        </div>

                        {seleccionado.estado === "propuesto" && (
                            <div style={{ 
                                background: "#555", 
                                borderRadius: "12px", 
                                padding: "24px",
                                marginBottom: "24px"
                            }}>
                                <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Evaluación del Proyecto</h3>
                                
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
                                            setSeleccionado(null);
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
                                        onClick={() => handleCambiarEstado("rechazado")}
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
                                        onClick={() => handleCambiarEstado("aprobado")}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path d="M20 6L9 17l-5-5"></path>
                                        </svg>
                                        Aprobar
                                    </button>
                                </div>
                            </div>
                        )}
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