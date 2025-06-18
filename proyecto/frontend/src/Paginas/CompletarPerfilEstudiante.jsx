import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompletarPerfilEstudiante = () => {
  const [carreras, setCarreras] = useState([]);
  const [carreraId, setCarreraId] = useState('');
  const [semestreActual, setSemestreActual] = useState('');
  const [promedioGeneral, setPromedioGeneral] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const response = await fetch('http://localhost:8000/carreras', {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Error al cargar las carreras');
        }
        const data = await response.json();
        setCarreras(data);
      } catch (error) {
        setError('Error al cargar las carreras. Por favor, intenta nuevamente.');
        console.error('Error al cargar carreras:', error);
      }
    };

    fetchCarreras();
  }, []);

  const validateForm = () => {
    if (!carreraId) {
      setError('Por favor selecciona una carrera');
      return false;
    }
    if (!semestreActual || semestreActual < 1 || semestreActual > 12) {
      setError('El semestre debe estar entre 1 y 12');
      return false;
    }
    if (!promedioGeneral || promedioGeneral < 1 || promedioGeneral > 7) {
      setError('El promedio debe estar entre 1 y 7');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/completar-perfil/estudiante', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          carrera_id: parseInt(carreraId),
          semestre_actual: parseInt(semestreActual),
          promedio_general: parseFloat(promedioGeneral)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al completar perfil');
      }

      navigate('/home');
    } catch (err) {
      setError(err.message || 'Error al completar perfil. Por favor, intenta nuevamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Completa tu perfil de estudiante</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Carrera
            </label>
            <select
              value={carreraId}
              onChange={(e) => setCarreraId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona una carrera</option>
              {carreras.map(carrera => (
                <option key={carrera.id} value={carrera.id}>
                  {carrera.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semestre actual
            </label>
            <input
              type="number"
              min="1"
              max="12"
              value={semestreActual}
              onChange={(e) => setSemestreActual(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Promedio general
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              max="7"
              value={promedioGeneral}
              onChange={(e) => setPromedioGeneral(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompletarPerfilEstudiante;