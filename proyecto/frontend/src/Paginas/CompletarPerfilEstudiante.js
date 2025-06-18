import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompletarPerfilEstudiante = () => {
  const [carreras, setCarreras] = useState([]);
  const [carreraId, setCarreraId] = useState('');
  const [semestreActual, setSemestreActual] = useState('');
  const [promedioGeneral, setPromedioGeneral] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/carreras', { withCredentials: true })
      .then(response => setCarreras(response.data))
      .catch(error => console.error('Error al cargar carreras:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/completar-perfil/estudiante',
        {  carrera_id: parseInt(carreraId),
                semestre_actual: parseInt(semestreActual),
                promedio_general: parseInt(promedioGeneral)
              },
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
      <h2 className="text-xl font-bold mb-4">Completa tu perfil de estudiante</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Carrera:</label>
        <select value={carreraId} onChange={(e) => setCarreraId(e.target.value)} required className="w-full border rounded px-3 py-2 mb-4">
          <option value="">Selecciona una carrera</option>
          {carreras.map(carrera => (
            <option key={carrera.id} value={carrera.id}>{carrera.nombre}</option>
          ))}
        </select>

        <label className="block mb-2">Semestre actual:</label>
        <input type="number" value={semestreActual} onChange={(e) => setSemestreActual(e.target.value)} required className="w-full border rounded px-3 py-2 mb-4" />
        <input
          type="number"
          step="0.01"
          value={promedioGeneral}
          onChange={(e) => setPromedioGeneral(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-4"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
      </form>
    </div>
  );
};

export default CompletarPerfilEstudiante;