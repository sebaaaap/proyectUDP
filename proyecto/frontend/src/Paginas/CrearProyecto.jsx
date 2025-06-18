import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";
import axios from "axios";

const CrearProyecto = ({ usuario }) => {
  const { loading } = useAuth(); // Ya se validó en App.jsx

  const [profesores, setProfesores] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [resumen, setResumen] = useState("");
  const [problema, setProblema] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [impacto, setImpacto] = useState("");
  const [perfiles, setPerfiles] = useState([{ carrera: "", cantidad: 1 }]);
  const [profesorId, setProfesorId] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/profesores", { withCredentials: true })
      .then((res) => setProfesores(res.data))
      .catch((err) => console.error("Error al obtener profesores", err));

    axios.get("http://localhost:8000/carreras", { withCredentials: true })
      .then((res) => setCarreras(res.data))
      .catch((err) => console.error("Error al obtener carreras", err));
  }, []);

  const handlePerfilChange = (index, field, value) => {
    const nuevos = [...perfiles];
    nuevos[index][field] = value;
    setPerfiles(nuevos);
  };

  const agregarPerfil = () => {
    setPerfiles([...perfiles, { carrera: "", cantidad: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        titulo,
        descripcion,
        resumen,
        problema,
        justificacion,
        impacto,
        profesor_id: profesorId,
        perfiles_requeridos: perfiles,
      };

      await axios.post("http://localhost:8000/proyectos/crear", data, {
        withCredentials: true,
      });

      setMensaje("Proyecto creado exitosamente");
    } catch (err) {
      console.error(err);
      setMensaje("Error al crear el proyecto");
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Crear Proyecto</h2>
      {mensaje && <p className="mb-4 text-green-600">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full border p-2" />
        <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full border p-2" />
        <textarea placeholder="Resumen" value={resumen} onChange={(e) => setResumen(e.target.value)} className="w-full border p-2" />
        <textarea placeholder="Problema" value={problema} onChange={(e) => setProblema(e.target.value)} className="w-full border p-2" />
        <textarea placeholder="Justificación" value={justificacion} onChange={(e) => setJustificacion(e.target.value)} className="w-full border p-2" />
        <textarea placeholder="Impacto" value={impacto} onChange={(e) => setImpacto(e.target.value)} className="w-full border p-2" />

        <div>
          <label>Profesor:</label>
          <select value={profesorId} onChange={(e) => setProfesorId(e.target.value)} className="w-full border p-2">
            <option value="">Selecciona un profesor</option>
            {profesores.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.nombre} {prof.apellido}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Perfiles requeridos:</label>
          {perfiles.map((perfil, index) => (
            <div key={index} className="flex space-x-2 mt-2">
              <select
                value={perfil.carrera}
                onChange={(e) => handlePerfilChange(index, "carrera", e.target.value)}
                className="flex-1 border p-2"
              >
                <option value="">Selecciona una carrera</option>
                {carreras.map((carrera) => (
                  <option key={carrera.id} value={carrera.nombre}>
                    {carrera.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Cantidad"
                value={perfil.cantidad}
                onChange={(e) => handlePerfilChange(index, "cantidad", e.target.value)}
                className="w-24 border p-2"
              />
            </div>
          ))}
          <button type="button" onClick={agregarPerfil} className="mt-2 text-blue-500 underline">
            + Agregar otro perfil
          </button>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Crear</button>
      </form>
    </div>
  );
};

export default CrearProyecto;
