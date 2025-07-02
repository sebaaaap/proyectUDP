import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";

export function ProyectoDetalle({ proyecto, volver }) {
    const { usuario } = useAuth();
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [archivos, setArchivos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [subiendoArchivo, setSubiendoArchivo] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    // Postulaciones
    const [postulaciones, setPostulaciones] = useState([]);
    const [cargandoPostulaciones, setCargandoPostulaciones] = useState(false);
    const [mensajePostulacion, setMensajePostulacion] = useState("");
    const [integrantes, setIntegrantes] = useState({ creador: null, profesor: null, colaboradores: [] });
    const [cargandoIntegrantes, setCargandoIntegrantes] = useState(true);
    const [showPropuestoModal, setShowPropuestoModal] = useState(false);

    const closePropuestoModal = () => {
        setShowPropuestoModal(false);
    };

    // Cargar archivos al montar el componente
    useEffect(() => {
        const cargarArchivos = async () => {
            try {
                setCargando(true);
                setError(null);
                
                const response = await fetch(`http://localhost:8000/proyectos/${proyecto.id}/archivos`, {
                    credentials: 'include'
                });
                
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                
                const data = await response.json();
                setArchivos(data);
                    } catch (err) {
            console.error("Error cargando archivos:", err);
            setError(err.message);
        } finally {
            setCargando(false);
        }
    };
    
    cargarArchivos();

    // Mostrar modal si el proyecto está en estado "Propuesto"
    if (proyecto.estado === "propuesto") {
        setShowPropuestoModal(true);
    }

        // Cargar postulaciones si el usuario es el creador
        if (usuario && usuario.id === proyecto.creador_id) {
            setCargandoPostulaciones(true);
            fetch(`http://localhost:8000/proyectos/${proyecto.id}/postulaciones`, { credentials: 'include' })
                .then(res => res.ok ? res.json() : [])
                .then(data => {
                    // Filtrar solo pendientes
                    setPostulaciones(Array.isArray(data) ? data.filter(p => p.estado === "pendiente") : []);
                })
                .catch(() => setPostulaciones([]))
                .finally(() => setCargandoPostulaciones(false));
        }

        // Fetch de integrantes
        setCargandoIntegrantes(true);
        fetch(`http://localhost:8000/proyectos/${proyecto.id}/integrantes`, { credentials: 'include' })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) setIntegrantes(data);
            })
            .catch(() => setIntegrantes({ creador: null, profesor: null, colaboradores: [] }))
            .finally(() => setCargandoIntegrantes(false));
    }, [proyecto.id, usuario]);

    const handleSubirArchivo = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSubiendoArchivo(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('archivo', file);
            formData.append('descripcion', descripcion);

            const response = await fetch(`http://localhost:8000/proyectos/${proyecto.id}/archivos`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Error ${response.status}`);
            }

            const nuevoArchivo = await response.json();
            setArchivos(prev => [...prev, nuevoArchivo]);
            setDescripcion("");
            
            // Resetear input
            e.target.value = '';
        } catch (err) {
            console.error("Error subiendo archivo:", err);
            setError(err.message);
        } finally {
            setSubiendoArchivo(false);
        }
    };

    const handleDescargarArchivo = async (archivoId) => {
        try {
            const response = await fetch(
                `http://localhost:8000/proyectos/${proyecto.id}/archivos/${archivoId}/descargar`,
                {
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw new Error(`Error al descargar: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = archivos.find(a => a.id === archivoId)?.nombre_archivo || 'archivo';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Error descargando archivo:", err);
            setError(err.message);
        }
    };

    const handleEliminarArchivo = async (archivoId) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/proyectos/${proyecto.id}/archivos/${archivoId}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                throw new Error(`Error al eliminar: ${response.status}`);
            }

            setArchivos(prev => prev.filter(a => a.id !== archivoId));
        } catch (err) {
            console.error("Error eliminando archivo:", err);
            setError(err.message);
        }
    };

    // Función para aceptar/rechazar postulaciones
    const cambiarEstadoPostulacion = async (postulacionId, nuevoEstado) => {
        try {
            const response = await fetch(`http://localhost:8000/proyectos/postulaciones/${postulacionId}/estado-creador`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (!response.ok) throw new Error("Error al actualizar postulación");
            setMensajePostulacion(`Postulación ${nuevoEstado} correctamente.`);
            // Quitar la postulación de la lista
            setPostulaciones(prev => prev.filter(p => p.id !== postulacionId));
            setTimeout(() => setMensajePostulacion(""), 2500);
        } catch (err) {
            setMensajePostulacion("Error al actualizar postulación");
            setTimeout(() => setMensajePostulacion(""), 2500);
        }
    };

    // Renderizado seguro
    if (!proyecto) {
        return (
            <div style={styles.container}>
                <p>Proyecto no encontrado</p>
                <button onClick={volver} style={styles.botonVolver}>
                    Volver
                </button>
            </div>
        );
    }

    return (
        <>
            <div style={styles.container}>
                {/* Panel de integrantes */}
                <div style={styles.panelIntegrantes}>
                    <h3 style={styles.tituloSeccion}>Integrantes</h3>
                    {cargandoIntegrantes ? (
                        <p>Cargando integrantes...</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            {/* Creador */}
                            <div style={{ background: '#ffe082', borderRadius: 8, padding: 12, marginBottom: 4, border: '1.5px solid #ffd54f', maxWidth: 320, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                <div style={{ fontWeight: 600, color: '#b28900', fontSize: 15, marginBottom: 2 }}>Creador</div>
                                {integrantes.creador ? (
                                    <>
                                        <div style={{ fontSize: 16, fontWeight: 500, color: '#5d4037', wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>{integrantes.creador.nombre}</div>
                                        <div style={{ color: '#6d4c41', fontSize: 13, wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>{integrantes.creador.correo}</div>
                                    </>
                                ) : <span style={{ color: '#bbb' }}>N/A</span>}
                            </div>
                            {/* Profesor */}
                            <div style={{ background: '#b3e5fc', borderRadius: 8, padding: 12, marginBottom: 4, border: '1.5px solid #4fc3f7', maxWidth: 320, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                <div style={{ fontWeight: 600, color: '#0277bd', fontSize: 15, marginBottom: 2 }}>Profesor a cargo</div>
                                {integrantes.profesor ? (
                                    <>
                                        <div style={{ fontSize: 16, fontWeight: 500, color: '#01579b', wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>{integrantes.profesor.nombre}</div>
                                        <div style={{ color: '#0277bd', fontSize: 13, wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>{integrantes.profesor.correo}</div>
                                    </>
                                ) : <span style={{ color: '#bbb' }}>N/A</span>}
                            </div>
                            {/* Colaboradores */}
                            <div style={{ background: '#dcedc8', borderRadius: 8, padding: 12, border: '1.5px solid #aed581', maxWidth: 320, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                <div style={{ fontWeight: 600, color: '#558b2f', fontSize: 15, marginBottom: 2 }}>Colaboradores</div>
                                {integrantes.colaboradores && integrantes.colaboradores.length > 0 ? (
                                    <ul style={{ paddingLeft: 18, margin: 0 }}>
                                        {integrantes.colaboradores.map((col, idx) => (
                                            <li key={idx} style={{ marginBottom: 4, color: '#33691e', wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>
                                                <span style={{ fontWeight: 500, wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>{col.nombre}</span>
                                                <span style={{ color: '#789262', fontSize: 13, marginLeft: 4, wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'pre-line' }}>({col.correo})</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div style={{ color: '#789262', fontSize: 13 }}>No hay colaboradores aún</div>
                                )}
                            </div>
                        </div>
                    )}
                    <button onClick={volver} style={styles.botonVolver}>
                        Volver
                    </button>
                </div>

                {/* Panel principal */}
                <div style={styles.panelPrincipal}>
                    <h2 style={styles.tituloProyecto}>{proyecto.titulo || 'Proyecto sin nombre'}</h2>
                    <p style={styles.descripcion}>{proyecto.descripcion || 'Sin descripción'}</p>
                    
                    {/* SECCIÓN DE POSTULACIONES SOLO PARA EL CREADOR */}
                    {usuario && usuario.id === proyecto.creador_id && (
                        <div style={{ marginBottom: 32, background: '#333', borderRadius: 8, padding: 18 }}>
                            <h4 style={{ color: '#ffc107', marginBottom: 12 }}>Postulaciones pendientes</h4>
                            {cargandoPostulaciones ? (
                                <p style={{ color: '#fff' }}>Cargando postulaciones...</p>
                            ) : postulaciones.length === 0 ? (
                                <p style={{ color: '#bbb' }}>No hay postulaciones pendientes.</p>
                            ) : (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {postulaciones.map(post => (
                                        <li key={post.id} style={{ background: '#444', borderRadius: 6, marginBottom: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                                            <div><b>Nombre:</b> {post.nombre || 'N/A'}</div>
                                            <div><b>Correo:</b> {post.correo || 'N/A'}</div>
                                            <div><b>Carrera:</b> {post.carrera || 'N/A'}</div>
                                            <div><b>Promedio general:</b> {post.promedio_general !== null && post.promedio_general !== undefined ? post.promedio_general : 'N/A'}</div>
                                            <div><b>Motivación:</b> {post.motivacion || 'Sin motivación'}</div>
                                            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                                                <button onClick={() => cambiarEstadoPostulacion(post.id, 'aceptado')} style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer' }}>Aceptar</button>
                                                <button onClick={() => cambiarEstadoPostulacion(post.id, 'rechazado')} style={{ background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer' }}>Rechazar</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {mensajePostulacion && <div style={{ color: '#4caf50', marginTop: 8 }}>{mensajePostulacion}</div>}
                        </div>
                    )}

                    <h4 style={styles.tituloSeccion}>Archivos subidos</h4>
                    
                    {cargando ? (
                        <p>Cargando archivos...</p>
                    ) : error ? (
                        <p style={styles.error}>{error}</p>
                    ) : archivos.length === 0 ? (
                        <p>No hay archivos subidos aún</p>
                    ) : (
                        <ul style={styles.listaArchivos}>
                            {archivos.map(archivo => (
                                <li 
                                    key={archivo.id}
                                    style={styles.itemArchivo}
                                >
                                    <div style={styles.infoArchivo}>
                                        <span style={styles.nombreArchivo}>{archivo.nombre_archivo}</span>
                                        <span style={styles.fechaArchivo}>
                                            {new Date(archivo.fecha_subida).toLocaleDateString()}
                                        </span>
                                        {archivo.descripcion && (
                                            <p style={styles.descripcionArchivo}>{archivo.descripcion}</p>
                                        )}
                                    </div>
                                    <div style={styles.accionesArchivo}>
                                        <button
                                            onClick={() => handleDescargarArchivo(archivo.id)}
                                            style={styles.botonAccion}
                                        >
                                            Descargar
                                        </button>
                                        {usuario?.id === archivo.id_estudiante && (
                                            <button
                                                onClick={() => handleEliminarArchivo(archivo.id)}
                                                style={{...styles.botonAccion, backgroundColor: '#dc3545'}}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Formulario para subir archivos */}
                    <div style={styles.formularioSubida}>
                        <input
                            type="text"
                            placeholder="Descripción del archivo (opcional)"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            style={styles.inputDescripcion}
                        />
                        <label style={styles.botonSubir}>
                            {subiendoArchivo ? 'Subiendo...' : 'Subir archivo'}
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.zip,.rar"
                                style={{ display: 'none' }}
                                onChange={handleSubirArchivo}
                                disabled={subiendoArchivo}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Modal de advertencia para proyectos propuestos */}
            {showPropuestoModal && (
                <div className="propuesto-modal-overlay" onClick={closePropuestoModal}>
                    <div className="propuesto-modal" onClick={(e) => e.stopPropagation()}>
                                            <div className="propuesto-modal-header">
                        <div className="warning-icon">⚠️</div>
                        <h4>Este proyecto aún no es aceptado</h4>
                    </div>
                        <div className="propuesto-modal-body">
                            <p>Como este proyecto aún no esta en fase de aprobación, no podrás realizar entregas, ni usar algunas de las funcionalidades de la plataforma.</p>
                        </div>
                        <div className="propuesto-modal-footer">
                            <button className="propuesto-modal-btn" onClick={closePropuestoModal}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .propuesto-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                    animation: fadeIn 0.3s ease;
                }

                .propuesto-modal {
                    background: #f3f3f3;
                    border-radius: 12px;
                    padding: 0;
                    max-width: 450px;
                    width: 90%;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    animation: slideIn 0.3s ease;
                }

                .propuesto-modal-header {
                    padding: 20px 20px 0 20px;
                    border-bottom: 1px solid #ddd;
                }

                .propuesto-modal-header h4 {
                    margin: 0;
                    color: #222;
                    font-weight: 600;
                    text-align: center;
                }

                .warning-icon {
                    font-size: 48px;
                    text-align: center;
                    margin-bottom: 15px;
                    animation: warningAppear 0.6s ease-out;
                    display: block;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
                    filter: drop-shadow(0 0 8px rgba(255, 193, 7, 0.5));
                    position: relative;
                }

                .warning-icon {
                    animation: warningAppear 0.6s ease-out, warningShake 2s ease-in-out infinite 0.6s;
                }

                @keyframes warningAppear {
                    0% {
                        opacity: 0;
                        transform: scale(0.3) rotate(-180deg);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.2) rotate(0deg);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1) rotate(0deg);
                    }
                }

                @keyframes warningShake {
                    0%, 100% {
                        transform: scale(1) rotate(0deg);
                    }
                    25% {
                        transform: scale(1.05) rotate(-1deg);
                    }
                    50% {
                        transform: scale(1.1) rotate(0deg);
                    }
                    75% {
                        transform: scale(1.05) rotate(1deg);
                    }
                }

                .propuesto-modal-body {
                    padding: 20px;
                }

                .propuesto-modal-body p {
                    margin: 0;
                    color: #222;
                    font-size: 16px;
                    text-align: center;
                    line-height: 1.5;
                }

                .propuesto-modal-footer {
                    padding: 0 20px 20px 20px;
                    display: flex;
                    justify-content: center;
                }

                .propuesto-modal-btn {
                    background: #4f0000;
                    color: white;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .propuesto-modal-btn:hover {
                    background: #6a0000;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(79, 0, 0, 0.3);
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideIn {
                    from { 
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </>
    );
}

// Estilos como objeto JavaScript
const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#222',
        color: '#fff'
    },
    panelIntegrantes: {
        width: '250px',
        backgroundColor: '#333',
        padding: '20px',
        borderRight: '1px solid #444'
    },
    panelPrincipal: {
        flex: 1,
        padding: '20px',
        position: 'relative'
    },
    tituloProyecto: {
        fontSize: '24px',
        marginBottom: '10px'
    },
    descripcion: {
        color: '#bbb',
        marginBottom: '20px'
    },
    tituloSeccion: {
        fontSize: '18px',
        color: '#bbb',
        marginBottom: '15px'
    },
    listaArchivos: {
        listStyle: 'none',
        padding: 0,
        maxHeight: '60vh',
        overflowY: 'auto'
    },
    itemArchivo: {
        padding: '12px',
        marginBottom: '10px',
        borderRadius: '6px',
        backgroundColor: '#333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoArchivo: {
        flex: 1
    },
    nombreArchivo: {
        display: 'block',
        marginBottom: '4px'
    },
    fechaArchivo: {
        color: '#999',
        fontSize: '12px'
    },
    descripcionArchivo: {
        color: '#bbb',
        fontSize: '14px',
        marginTop: '4px'
    },
    accionesArchivo: {
        display: 'flex',
        gap: '8px'
    },
    botonAccion: {
        padding: '6px 12px',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#4f0000',
        color: '#fff',
        cursor: 'pointer'
    },
    formularioSubida: {
        position: 'fixed',
        right: '30px',
        bottom: '30px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
    },
    inputDescripcion: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #444',
        backgroundColor: '#333',
        color: '#fff',
        width: '200px'
    },
    botonSubir: {
        backgroundColor: '#4f0000',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    botonVolver: {
        backgroundColor: '#4f0000',
        color: '#fff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '20px'
    },
    error: {
        color: '#dc3545',
        marginBottom: '10px'
    }
};