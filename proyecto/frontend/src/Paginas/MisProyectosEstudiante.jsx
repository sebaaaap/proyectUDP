import { useEffect, useState } from "react";
import { ProyectoDetalle } from "./ProyectoDetalle";

export function MisProyectosEstudiante() {
    const [proyectos, setProyectos] = useState([]);
    const [seleccionado, setSeleccionado] = useState(null);
    const estudianteId = 1; // <-- Hardcodeado por ahora, debería venir de sesión o contexto

    // Función para parsear fechas del backend (formato ISO) a DD-MM-AAAA
    function parseFecha(fecha) {
        if (!fecha) return "";
        const date = new Date(fecha);
        const dia = String(date.getDate()).padStart(2, "0");
        const mes = String(date.getMonth() + 1).padStart(2, "0");
        const año = date.getFullYear();
        return `${dia}-${mes}-${año}`;
    }

    // Petición al backend para obtener proyectos del estudiante
    useEffect(() => {
        fetch(`http://localhost:8000/proyectos/estudiante/${estudianteId}`)
            .then((res) => res.json())
            .then((data) => {
                setProyectos(data);
            })
            .catch((error) => {
                console.error("Error al obtener los proyectos:", error);
            });
    }, []);

    // Si se selecciona un proyecto, mostrar su detalle
    if (seleccionado) {
        return (
            <ProyectoDetalle
                proyecto={seleccionado}
                volver={() => setSeleccionado(null)}
            />
        );
    }

    // Listado de proyectos del estudiante
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Mis Proyectos</h1>
            {proyectos.length === 0 ? (
                <p>No hay proyectos asociados.</p>
            ) : (
                <ul className="space-y-4">
                    {proyectos.map((proyecto) => (
                        <li
                            key={proyecto.id}
                            className="border rounded-xl p-4 hover:bg-gray-100 cursor-pointer"
                            onClick={() => setSeleccionado(proyecto)}
                        >
                            <h2 className="text-xl font-semibold">{proyecto.nombre}</h2>
                            <p className="text-gray-600">{proyecto.descripcion}</p>
                            <p className="text-sm text-gray-500">
                                Desde {parseFecha(proyecto.fecha_inicio)} hasta {parseFecha(proyecto.fecha_termino)}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
