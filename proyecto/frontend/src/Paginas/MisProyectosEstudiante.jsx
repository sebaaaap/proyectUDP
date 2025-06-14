import { useEffect, useState } from "react";
import { ProyectoDetalle } from "./ProyectoDetalle";

export function MisProyectosEstudiante() {
    const [proyectos, setProyectos] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);

    // Adaptado exclusivamente a DD-MM-AAAA
    function parseFecha(fecha) {
        if (!fecha) return new Date(0);
        const [d, m, y] = fecha.split("-");
         return new Date(`${y}-${m}-${d}T12:00:00`);
    }

    function getFechaMasReciente(archivos) {
        if (!archivos || archivos.length === 0) return new Date(0);
        return archivos
            .map(a => parseFecha(a.fecha))
            .reduce((max, fecha) => (fecha > max ? fecha : max), new Date(0));
    }

    useEffect(() => {
        // Simulación de fetch con orden de archivos incluido
        const datos = [
            {
                id: 1,
                titulo: "Sistema de Gestión de Tesis",
                descripcion: "Plataforma para gestionar proyectos de titulación.",
                integrantes: [
                     { nombre: "Juan", rol: "Profesor" },
                     { nombre: "Ana", rol: "Product Owner" },
                     { nombre: "Pedro", rol: "Development Team" },
                     { nombre: "Diego Caña", rol: "Development Team" }
            ],
                archivos: [
                    { id: 1, nombre: "avance1.pdf", fecha: "01-05-2025" },
                    { id: 2, nombre: "informe_final.pdf", fecha: "20-05-2025" },
                    { id: 3, nombre: "informe_finalfinal.pdf", fecha: "04-05-2025" }
                ]
            },
            {
                id: 2,
                titulo: "App de Tutorías",
                descripcion: "Aplicación para coordinar tutorías entre estudiantes.",
                integrantes: ["María", "Luis"],
                archivos: [
                    { id: 1, nombre: "propuesta.pdf", fecha: "10-05-2025" }
                ]
            }
        ];

        // Ordenamos los archivos por fecha (más reciente primero)
        const proyectosConArchivosOrdenados = datos.map(proy => ({
            ...proy,
            archivos: [...proy.archivos].sort(
                (a, b) => parseFecha(b.fecha) - parseFecha(a.fecha)
            )
        }));

        setProyectos(proyectosConArchivosOrdenados);
    }, []);

    const proyectosOrdenados = [...proyectos].sort((a, b) => {
        const fechaA = getFechaMasReciente(a.archivos);
        const fechaB = getFechaMasReciente(b.archivos);
        return fechaB - fechaA; // más nuevo primero
    });

    if (seleccionado) {
        return (
            <ProyectoDetalle
                proyecto={seleccionado}
                volver={() => setSeleccionado(null)}
            />
        );
    }

    return (
        <div style={{ padding: 32 }}>
            <h1 style={{ marginTop: 0, color: "#bbb" }}>Mis Proyectos</h1>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {proyectosOrdenados.map(proy => (
                    <li
                        key={proy.id}
                        style={{
                            background: "#444",
                            color: "#fff",
                            marginBottom: 16,
                            padding: 16,
                            borderRadius: 8,
                            cursor: "pointer"
                        }}
                        onClick={() => setSeleccionado(proy)}
                    >
                        <h3>{proy.titulo}</h3>
                        <p>{proy.descripcion}</p>
                        <p style={{ fontSize: "0.9em", color: "#ccc" }}>
                            Última actualización: {getFechaMasReciente(proy.archivos).toLocaleDateString()}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
