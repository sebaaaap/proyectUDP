import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompletarPerfilProfesor = () => {
  const [facultad, setFacultad] = useState('');
  const [facultades, setFacultades] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/facultades", { withCredentials: true })
      .then((res) => setFacultades(res.data))
      .catch((err) => console.error("Error al obtener facultades:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/completar-perfil/profesor',
        { facultad },
        { withCredentials: true }
      );
      alert('Perfil completado');
      window.location.href = '/home';
    } catch (err) {
      alert('Error al completar perfil');
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Completa tu perfil de profesor</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Facultad:</label>
        <select
          value={facultad}
          onChange={(e) => setFacultad(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="">Selecciona una facultad</option>
          {facultades.map((fac, i) => (
            <option key={i} value={fac}>{fac}</option>
          ))}
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
      </form>
    </div>
  );
};

export default CompletarPerfilProfesor;
