import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompletarPerfilProfesor = () => {
  const [facultad, setFacultad] = useState('');
  const [facultades, setFacultades] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacultades = async () => {
      try {
        const response = await fetch("http://localhost:8000/facultades", {
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Error al cargar las facultades');
        }
        const data = await response.json();
        setFacultades(data);
      } catch (error) {
        setError('Error al cargar las facultades. Por favor, intenta nuevamente.');
        console.error("Error al obtener facultades:", error);
      }
    };

    fetchFacultades();
  }, []);

  const validateForm = () => {
    if (!facultad) {
      setError('Por favor selecciona una facultad');
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
      const response = await fetch('http://localhost:8000/completar-perfil/profesor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ facultad })
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
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Completa tu perfil de profesor</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facultad
            </label>
            <select
              value={facultad}
              onChange={(e) => setFacultad(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecciona una facultad</option>
              {facultades.map((fac, i) => (
                <option key={i} value={fac}>{fac}</option>
              ))}
            </select>
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

export default CompletarPerfilProfesor;
