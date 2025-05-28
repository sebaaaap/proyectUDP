import { useState } from "react";

export function ProyectoDetalle({ proyecto, volver }) {
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [archivos, setArchivos] = useState(proyecto.archivos);

    // Estado para mensajes de chat por archivo
    const [mensajesPorArchivo, setMensajesPorArchivo] = useState({});
    const [mensajeInput, setMensajeInput] = useState("");

    const handleSubirArchivo = (e) => {
        const file = e.target.files[0];
        const maxSize = 10 * 1024 * 1024; // 10 MB

        if (file) {
            const allowedTypes = [
                "application/pdf",
                "application/zip",
            ];
            const allowedExtensions = [".pdf", ".zip"];

            const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
                alert("Solo se permiten archivos PDF o ZIP.");
                return;
            }
            if (file.size > maxSize) {
                alert("El archivo no debe superar los 10 MB.");
                return;
            }
            setArchivos([
                ...archivos,
                { id: archivos.length + 1, nombre: file.name, fecha: new Date().toISOString().split("T")[0] }
            ]);
        }
    };

    // Formatea la fecha para mostrar hora y día, y semanas si corresponde
    function formatearFecha(fecha) {
        const d = new Date(fecha);
        const ahora = new Date();

        // Normalizar fechas a medianoche para comparar solo días
        const dSinHora = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const ahoraSinHora = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());

        const diffMs = ahoraSinHora - dSinHora;
        const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const opcionesHora = { hour: '2-digit', minute: '2-digit' };

        if (diffDias === 0) {
            return d.toLocaleTimeString([], opcionesHora) + " hoy";
        } else if (diffDias === 1) {
            return d.toLocaleTimeString([], opcionesHora) + " hace 1 día";
        } else if (diffDias < 7) {
            return d.toLocaleTimeString([], opcionesHora) + ` hace ${diffDias} días`;
        } else {
            const semanas = Math.floor(diffDias / 7);
            return d.toLocaleTimeString([], opcionesHora) + ` hace ${semanas} semana${semanas > 1 ? "s" : ""}`;
        }
    }

    // Agrupa los integrantes por rol
    const roles = ["Profesor", "Product Owner", "Development Team"];
    const integrantesPorRol = roles.map(rol => ({
        rol,
        integrantes: (proyecto.integrantes || []).filter(i => i.rol === rol)
    }));

    // Manejar envío de mensaje en el chat
    const enviarMensaje = () => {
        if (!mensajeInput.trim() || !archivoSeleccionado) return;
        setMensajesPorArchivo(prev => {
            const prevMensajes = prev[archivoSeleccionado] || [];
            return {
                ...prev,
                [archivoSeleccionado]: [
                    ...prevMensajes,
                    { autor: "Yo", texto: mensajeInput, fecha: new Date().toISOString() }
                ]
            };
        });
        setMensajeInput("");
    };

    return (
        <div style={{ display: "flex", height: "90vh", background: "#222", color: "#fff", borderRadius: 12 }}>
            <div style={{ width: 220, background: "#333", padding: 24, borderRadius: "12px 0 0 12px" }}>
                <h3 style={{ fontSize: 18, marginBottom: 16 }}>Integrantes</h3>
                {integrantesPorRol.map(grupo => (
                    <div key={grupo.rol} style={{ marginBottom: 16 }}>
                        <b style={{ color: "#bbb" }}>{grupo.rol}</b>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {grupo.integrantes.map((i, idx) => (
                                <li key={idx} style={{ marginBottom: 8, background: "#272627", borderRadius: 12, padding: 5 }}>
                                    {i.nombre}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <button onClick={volver} style={{
                    position: "absolute",
                    left: 24,
                    bottom: 42,
                    background: "#4f0000",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    cursor: "pointer"
                }}>Volver</button>
            </div>

            <div style={{ flex: 1, padding: 24, position: "relative", display: "flex", flexDirection: "column" }}>
                <h2 style={{ marginTop: 0 }}>{proyecto.titulo}</h2>
                <h4 style={{ marginTop: 0, color: "#bbb" }}>Archivos subidos</h4>
                <ul style={{ listStyle: "none", padding: 0, marginBottom: 24 }}>
                    {archivos.map(arch => (
                        <li key={arch.id}
                            style={{
                                background: archivoSeleccionado === arch.id ? "#555" : "#444",
                                marginBottom: 10,
                                padding: 12,
                                borderRadius: 8,
                                cursor: "pointer"
                            }}
                            onClick={() => setArchivoSeleccionado(arch.id)}
                        >
                            <span>{arch.nombre}</span>
                            <span style={{ float: "right", color: "#aaa" }}>{arch.fecha}</span>
                        </li>
                    ))}
                </ul>

                {archivoSeleccionado && (
                    <div style={{
                        background: "#333",
                        borderRadius: 8,
                        padding: 16,
                        marginBottom: 16,
                        marginTop: "auto"
                    }}>
                        <h5>Chat sobre <span style={{ color: "#4f0000" }}>
                            {archivos.find(a => a.id === archivoSeleccionado)?.nombre}
                        </span></h5>
                        <div style={{
                            maxHeight: 150,
                            overflowY: "auto",
                            background: "#222",
                            borderRadius: 6,
                            padding: 8,
                            marginBottom: 8
                        }}>
                            {(mensajesPorArchivo[archivoSeleccionado] || []).map((msg, i) => (
                                <div key={i} style={{ marginBottom: 4 }}>
                                    <b>{msg.autor}</b> ({formatearFecha(msg.fecha)}): {msg.texto}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex" }}>
                            <input
                                type="text"
                                value={mensajeInput}
                                onChange={e => setMensajeInput(e.target.value)}
                                placeholder="Escribe un mensaje..."
                                style={{
                                    flex: 1,
                                    borderRadius: 6,
                                    border: "1px solid #555",
                                    background: "#222",
                                    color: "#fff",
                                    padding: 6,
                                    marginRight: 8
                                }}
                                onKeyDown={e => {
                                    if (e.key === "Enter") enviarMensaje();
                                }}
                            />
                            <button
                                style={{
                                    background: "#4f0000",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 6,
                                    padding: "6px 16px",
                                    cursor: "pointer"
                                }}
                                onClick={enviarMensaje}
                            >
                                Enviar
                            </button>
                        </div>
                    </div>
                )}

                <label style={{
                    position: "absolute",
                    right: 24,
                    bottom: 24,
                    background: "#4f0000",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 32,
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                }}>
                    +
                    <input
                        type="file"
                        accept=".pdf,.zip"
                        style={{ display: "none" }}
                        onChange={handleSubirArchivo}
                    />
                </label>
            </div>
        </div>
    );
}