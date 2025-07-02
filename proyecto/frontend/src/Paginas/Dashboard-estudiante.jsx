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
        // Obtener solo proyectos aprobados desde el backend
        fetch("http://localhost:8000/proyectos/aprobados", { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                console.log('Proyectos aprobados recibidos:', data);
                setProyectos(data);
            })
            .catch(() => {
                setProyectos([]);
            });

        // Obtener postulaciones reales del usuario desde el backend
        fetch("http://localhost:8000/postulaciones/mis", { credentials: 'include' })
            .then(res => res.ok ? res.json() : [])
            .then(data => Array.isArray(data) ? setPostulaciones(data) : setPostulaciones([]))
            .catch(() => setPostulaciones([]));
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

    const postularAProyecto = async (proyectoId, motivacion) => {
        const response = await fetch(`http://localhost:8000/proyectos/${proyectoId}/postular`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ proyecto_id: proyectoId, motivacion })
        });
        if (response.ok) {
            setMensaje("¡Te has postulado correctamente!");
            // Refresca las postulaciones reales desde el backend
            fetch("http://localhost:8000/postulaciones/mis", { credentials: 'include' })
                .then(res => res.ok ? res.json() : [])
                .then(data => Array.isArray(data) ? setPostulaciones(data) : setPostulaciones([]))
                .catch(() => setPostulaciones([]));
        } else {
            setMensaje("Error al postularse");
        }
    };

    const confirmarPostulacion = async () => {
        if (!motivacion.trim()) {
            setMensaje("Debes ingresar una motivación para postularte");
            setTimeout(() => setMensaje(""), 2500);
            return;
        }
        await postularAProyecto(proyectoAPostular.id, motivacion);
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
        const p = postulaciones.find(p => p.proyectoId === proyectoId);
        return !!p && (p.estado === 'pendiente' || p.estado === 'aceptado');
    };

    const renderEstadoPostulacion = (proyectoId) => {
        const p = postulaciones.find(p => p.proyectoId === proyectoId);
        if (!p) return <span style={{ color: '#bbb' }}>No postulado</span>;
        if (p.estado === 'pendiente') return <span style={{ color: '#ffc107', fontWeight: 600 }}>Pendiente</span>;
        if (p.estado === 'aceptado') return <span style={{ color: '#4caf50', fontWeight: 600 }}>Aceptado</span>;
        if (p.estado === 'rechazado') return <span style={{ color: '#f44336', fontWeight: 600 }}>Rechazado</span>;
        return <span style={{ color: '#bbb' }}>No postulado</span>;
    };

    const proyectosFiltrados = filtroEstado === "Todos"
        ? proyectos
        : filtroEstado === "Postulados"
            ? proyectos.filter(p => estaPostulado(p.id))
            : proyectos.filter(p => !estaPostulado(p.id));

    // Determina el estado real de la postulación para un proyecto
    const getEstadoRealPostulacion = (proyectoId) => {
        const p = postulaciones.find(p => p.proyectoId === proyectoId);
        return p ? p.estado : null;
    };

    // Helper para obtener el nombre del proyecto por ID
    const getNombreProyecto = (proyectoId) => {
        const p = proyectos.find(p => p.id === proyectoId);
        return p ? p.titulo : `Proyecto #${proyectoId}`;
    };

    // Estilos visuales idénticos a Dashboard-profe (header flotante, filas separadas, sombra, paddings, bordes)
    const tableStyles = `
      .tabla-proyectos {
        width: 100%;
        color: #fff;
        border-collapse: separate;
        border-spacing: 0 12px;
        min-width: 800px;
        background: transparent;
      }
      .tabla-proyectos th {
        background: #222;
        color: #fff;
        font-weight: 700;
        font-size: 1rem;
        border: none;
        padding: 16px 18px;
        letter-spacing: 0.5px;
      }
      .tabla-proyectos td {
        background: #555;
        color: #fff;
        font-size: 1rem;
        padding: 18px 18px;
        border: none;
        vertical-align: middle;
      }
      .tabla-proyectos tr {
        box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        border-radius: 12px;
        overflow: hidden;
      }
      .proyecto-row {
        opacity: 0;
        transform: translateY(32px);
        animation: fadeInUp 0.6s forwards;
      }
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(32px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .acciones-cell {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        align-items: center;
      }
      .btn-detalles {
        background: #007bff;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 10px 22px;
        font-weight: 600;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .btn-detalles:hover {
        background: #0056b3;
      }
      .btn-postular {
        background: #28a745;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 10px 22px;
        font-weight: 600;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .btn-postular:hover {
        background: #218838;
      }
      .btn-cancelar {
        background: #dc3545;
        color: #fff;
        border: none;
        border-radius: 8px;
        padding: 10px 22px;
        font-weight: 600;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: background 0.2s;
      }
      .btn-cancelar:hover {
        background: #b52a37;
      }
    `;

    return (
        <div style={{ padding: "40px", background: "#222", minHeight: "100vh" }}>
            <style>{tableStyles}</style>
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
                            <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>Área de conocimiento:</p>
                            <p style={{ margin: 0 }}>{proyectoAPostular.area_conocimiento || "No especificada"}</p>
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
                    <h2 style={{ color: "#fff", margin: 0 }}>Gestión de Proyectos</h2>

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
                    <div style={{ overflowX: 'auto' }}>
                        <table className="tabla-proyectos">
                            <thead>
                                <tr>
                                    <th>Proyecto</th>
                                    <th>Profesor</th>
                                    <th>Fecha</th>
                                    <th>Postulación</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {proyectosFiltrados.map((proyecto, idx) => (
                                    <tr key={proyecto.id} className="proyecto-row" style={{ animationDelay: `${idx * 0.13 + 0.1}s` }}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{proyecto.titulo}</div>
                                            <div style={{ fontSize: '0.95rem', color: '#bbb', marginTop: 4 }}>{proyecto.descripcion}</div>
                                        </td>
                                        <td>{proyecto.profesor}</td>
                                        <td>{proyecto.fecha_inicio ? new Date(proyecto.fecha_inicio).toLocaleDateString('es-ES') : 'N/A'}</td>
                                        <td>{renderEstadoPostulacion(proyecto.id)}</td>
                                        <td>
                                            <div className="acciones-cell">
                                                <button
                                                    className="btn-detalles"
                                                    onClick={() => setSeleccionado(proyecto)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                        <circle cx="12" cy="12" r="3"></circle>
                                                    </svg>
                                                    Detalles
                                                </button>
                                                {estaPostulado(proyecto.id) ? (
                                                    <button className="btn-cancelar" disabled>
                                                        {getEstadoRealPostulacion(proyecto.id) === 'pendiente' ? 'Postulación pendiente' : 'Ya postulado'}
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="btn-postular"
                                                        onClick={() => iniciarPostulacion(proyecto)}
                                                    >
                                                        Postular
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {proyectosFiltrados.length === 0 && (
                            <div style={{
                                background: "#555",
                                padding: "24px",
                                borderRadius: "8px",
                                textAlign: "center",
                                marginTop: "16px"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "12px" }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                </div>
                                <p style={{ color: "#fff", marginBottom: "8px" }}>
                                    {filtroEstado === "Todos"
                                        ? "No hay proyectos disponibles para postular en este momento."
                                        : filtroEstado === "Postulados"
                                            ? "No tienes postulaciones activas."
                                            : "No hay proyectos disponibles para postular."}
                                </p>
                                {filtroEstado === "Todos" && (
                                    <p style={{ color: "#bbb", fontSize: "0.9rem", margin: 0 }}>
                                        Los proyectos que creaste o en los que ya participas no aparecen en esta lista.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
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
                                    <p><strong>Área de conocimiento:</strong> {seleccionado.area_conocimiento || "No especificada"}</p>
                                    <p><strong>Estado:</strong> {seleccionado.estado || "Propuesto"}</p>
                                    <p><strong>Fecha inicio:</strong> {seleccionado.fechaInicio || "-"}</p>
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