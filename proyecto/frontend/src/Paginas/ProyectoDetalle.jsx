import { useState, useEffect } from "react";

export function ProyectoDetalle({ proyecto, estudianteId, volver }) {
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [archivos, setArchivos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [subiendoArchivo, setSubiendoArchivo] = useState(false);

    // Cargar archivos al montar el componente
    useEffect(() => {
        const cargarArchivos = async () => {
            try {
                setCargando(true);
                setError(null);
                
                const response = await fetch(`http://localhost:8000/proyectos/${proyecto.id}/archivos`);
                
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
            formData.append('descripcion', `Subido por estudiante ${estudianteId}`);
            formData.append('estudiante_id', estudianteId);

            const response = await fetch(`http://localhost:8000/proyectos/${proyecto.id}/archivos`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Error ${response.status}`);
            }

            const nuevoArchivo = await response.json();
            setArchivos(prev => [...prev, nuevoArchivo]);
            
            // Resetear input
            e.target.value = '';
        } catch (err) {
            console.error("Error subiendo archivo:", err);
            setError(err.message);
        } finally {
            setSubiendoArchivo(false);
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
                <h2 style={styles.tituloProyecto}>{proyecto.nombre || 'Proyecto sin nombre'}</h2>
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
                                style={{
                                    ...styles.itemArchivo,
                                    backgroundColor: archivoSeleccionado === archivo.id ? '#555' : '#444'
                                }}
                                onClick={() => setArchivoSeleccionado(archivo.id)}
                            >
                                <span>{archivo.nombre}</span>
                                <span style={styles.fechaArchivo}>
                                    {new Date(archivo.fecha_subida).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Botón para subir archivos */}
                <label style={styles.botonSubir}>
                    {subiendoArchivo ? 'Subiendo...' : '+'}
                    <input
                        type="file"
                        accept=".pdf,.zip"
                        style={{ display: 'none' }}
                        onChange={handleSubirArchivo}
                        disabled={subiendoArchivo}
                    />
                </label>
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
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between'
    },
    fechaArchivo: {
        color: '#999',
        fontSize: '12px'
    },
    botonSubir: {
        position: 'fixed',
        right: '30px',
        bottom: '30px',
        backgroundColor: '#4f0000',
        color: '#fff',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        cursor: 'pointer'
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
        color: '#ff6b6b'
    }
};