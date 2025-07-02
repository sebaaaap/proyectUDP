import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompletarPerfilEstudiante.css';

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
    <div className="completar-perfil-page">
      <img src="/Proyectoudpnegrosf.png" alt="Logo UDP" className="completar-perfil-image" />
      <div className="completar-perfil-right-container">
        <div className="completar-perfil-container">
          <h1 className="completar-perfil-h1">Completa tu perfil</h1>
          <p className="completar-perfil-subtitle">
            Necesitamos algunos datos adicionales para personalizar tu experiencia
          </p>
          {error && (
            <div className="completar-perfil-error-message">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="completar-perfil-form">
            <div className="completar-perfil-form-group">
              <label className="completar-perfil-label">
                Carrera
              </label>
              <select
                value={carreraId}
                onChange={(e) => setCarreraId(e.target.value)}
                required
                className="completar-perfil-select"
              >
                <option value="">Selecciona una carrera</option>
                {carreras.map(carrera => (
                  <option key={carrera.id} value={carrera.id}>
                    {carrera.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="completar-perfil-form-group">
              <label className="completar-perfil-label">
                Semestre actual
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={semestreActual}
                onChange={(e) => setSemestreActual(e.target.value)}
                required
                className="completar-perfil-input"
                placeholder="Ej: 5"
              />
            </div>
            <div className="completar-perfil-form-group">
              <label className="completar-perfil-label">
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
                className="completar-perfil-input"
                placeholder="Ej: 5.8"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={loading ? "completar-perfil-loading-button" : "completar-perfil-submit-button"}
            >
              {loading ? 'Guardando...' : 'Completar perfil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompletarPerfilEstudiante;