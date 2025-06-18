import { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";

export function ProyectoDetalle({ proyecto, volver }) {
    const { user } = useAuth();
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [archivos, setArchivos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [subiendoArchivo, setSubiendoArchivo] = useState(false);
    const [descripcion, setDescripcion] = useState("");

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
    }, [proyecto.id]);

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
        <div style={styles.container}>
            {/* Panel de integrantes */}
            <div style={styles.panelIntegrantes}>
                <h3 style={styles.tituloSeccion}>Integrantes</h3>
                {/* ... renderizado de integrantes ... */}
                <button onClick={volver} style={styles.botonVolver}>
                    Volver
                </button>
            </div>

            {/* Panel principal */}
            <div style={styles.panelPrincipal}>
                <h2 style={styles.tituloProyecto}>{proyecto.titulo || 'Proyecto sin nombre'}</h2>
                <p style={styles.descripcion}>{proyecto.descripcion || 'Sin descripción'}</p>
                
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
                                    {user?.id === archivo.id_estudiante && (
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