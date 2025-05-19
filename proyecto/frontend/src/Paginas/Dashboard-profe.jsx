import { useEffect, useState } from "react";

export function DashboardProfe() {
    const [postulaciones, setPostulaciones] = useState([]);
    const [seleccionada, setSeleccionada] = useState(null);
    const [comentario, setComentario] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        // Datos de ejemplo
        const datosEjemplo = [
            {
                id: 1,
                estudiante: "Claudio Bravo",
                proyecto: "Sistema de Gestión Académica",
                fecha: "2025-05-18",
                estado: "Pendiente",
                descripcion: "Sistema para gestionar la información académica de los estudiantes y profesores."
            },
            {
                id: 2,
                estudiante: "Andrés Soto",
                proyecto: "App de Tutorías UDP",
                fecha: "2025-05-17",
                estado: "Aprobada",
                descripcion: "Aplicación móvil para gestionar las tutorías entre estudiantes y profesores."
            },
            {
                id: 3,
                estudiante: "María Pérez",
                proyecto: "Plataforma de Laboratorios Virtuales",
                fecha: "2025-05-16",
                estado: "Rechazada",
                descripcion: "Plataforma para realizar experimentos de laboratorio de forma virtual."
            }
        ];
        setPostulaciones(datosEjemplo);
    }, []);

    const handleVeredicto = (veredicto) => {
        if (!seleccionada) return;
        // Aquí iría la petición al backend para actualizar el estado y comentario
        setPostulaciones(postulaciones.map(p =>
            p.id === seleccionada.id
                ? { ...p, estado: veredicto, comentario }
                : p
        ));
        setMensaje(`Postulación ${veredicto === "Aprobada" ? "aprobada" : "rechazada"} correctamente.`);
        setSeleccionada(null);
        setComentario("");
        setTimeout(() => setMensaje(""), 2500);
    };

    return (
        <div style={{ padding: "40px", background: "#222", minHeight: "100vh" }}>
            <h1 style={{ color: "#fff", marginBottom: "32px" }}>Postulaciones de Proyectos</h1>
            <div style={{
                background: "#403f3f",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
            }}>
                {!seleccionada ? (
                    <>
                        <table style={{ width: "100%", color: "#fff", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#333" }}>
                                    <th style={{ padding: "12px", borderRadius: "8px 0 0 8px" }}>Estudiante</th>
                                    <th style={{ padding: "12px" }}>Proyecto</th>
                                    <th style={{ padding: "12px" }}>Fecha</th>
                                    <th style={{ padding: "12px" }}>Estado</th>
                                    <th style={{ padding: "12px", borderRadius: "0 8px 8px 0" }}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {postulaciones.map((p) => (
                                    <tr key={p.id} style={{ background: "#555", marginBottom: "8px" }}>
                                        <td style={{ padding: "10px" }}>{p.estudiante}</td>
                                        <td style={{ padding: "10px" }}>{p.proyecto}</td>
                                        <td style={{ padding: "10px" }}>{p.fecha}</td>
                                        <td style={{
                                            padding: "10px",
                                            color:
                                                p.estado === "Aprobada"
                                                    ? "#4caf50"
                                                    : p.estado === "Rechazada"
                                                        ? "#f44336"
                                                        : "#ffc107",
                                            fontWeight: "bold"
                                        }}>
                                            {p.estado}
                                        </td>
                                        <td style={{ padding: "10px" }}>
                                            <button
                                                style={{
                                                    padding: "6px 16px",
                                                    borderRadius: "8px",
                                                    border: "none",
                                                    background: "#007bff",
                                                    color: "#fff",
                                                    cursor: "pointer",
                                                    fontWeight: "bold"
                                                }}
                                                onClick={() => setSeleccionada(p)}
                                            >
                                                Ver detalles
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {postulaciones.length === 0 && (
                            <p style={{ color: "#fff", textAlign: "center", marginTop: "24px" }}>
                                No hay postulaciones registradas.
                            </p>
                        )}
                        {mensaje && (
                            <p style={{ color: "#4caf50", textAlign: "center", marginTop: "18px" }}>
                                {mensaje}
                            </p>
                        )}
                    </>
                ) : (
                    <div style={{ color: "#fff" }}>
                        <button
                            onClick={() => setSeleccionada(null)}
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
                        <h2>Detalle de la Postulación</h2>
                        <p><strong>Estudiante:</strong> {seleccionada.estudiante}</p>
                        <p><strong>Proyecto:</strong> {seleccionada.proyecto}</p>
                        <p><strong>Fecha:</strong> {seleccionada.fecha}</p>
                        <p><strong>Estado actual:</strong> {seleccionada.estado}</p>
                        <p><strong>Descripción:</strong> {seleccionada.descripcion}</p>
                        <div style={{ margin: "18px 0" }}>
                            <label style={{ display: "block", marginBottom: "8px" }}>
                                Comentario para el estudiante:
                            </label>
                            <textarea
                                value={comentario}
                                onChange={e => setComentario(e.target.value)}
                                rows={4}
                                style={{
                                    width: "100%",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                    padding: "10px",
                                    fontSize: "1rem",
                                    resize: "vertical"
                                }}
                                placeholder="Escribe un comentario (opcional)..."
                            />
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                            <button
                                style={{
                                    padding: "10px 24px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: "#4caf50",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                                onClick={() => handleVeredicto("Aprobada")}
                            >
                                Aprobar
                            </button>
                            <button
                                style={{
                                    padding: "10px 24px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: "#f44336",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    cursor: "pointer"
                                }}
                                onClick={() => handleVeredicto("Rechazada")}
                            >
                                Rechazar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}