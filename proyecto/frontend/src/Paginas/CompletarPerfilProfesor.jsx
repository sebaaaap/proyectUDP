import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompletarPerfilProfesor.css';

const CompletarPerfilProfesor = () => {
  const [facultad, setFacultad] = useState('');
  const [facultades, setFacultades] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFacultades = async () => {
      try {
        const response = await fetch("https://udprojectstest-production.up.railway.app/facultades", {
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
      const response = await fetch('https://udprojectstest-production.up.railway.app/completar-perfil/profesor', {
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
    <div className="completar-perfil-profe-page">
      <img src="/Proyectoudpnegrosf.png" alt="Logo UDP" className="completar-perfil-profe-image" />
      <div className="completar-perfil-profe-right-container">
        <div className="completar-perfil-profe-container">
          <h1 className="completar-perfil-profe-h1">Completa tu perfil</h1>
          <p className="completar-perfil-profe-subtitle">
            Necesitamos algunos datos adicionales para personalizar tu experiencia como profesor
          </p>
          {error && (
            <div className="completar-perfil-profe-error-message">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="completar-perfil-profe-form">
            <div className="completar-perfil-profe-form-group">
              <label className="completar-perfil-profe-label">
                Facultad
              </label>
              <select
                value={facultad}
                onChange={(e) => setFacultad(e.target.value)}
                required
                className="completar-perfil-profe-select"
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
              className={loading ? "completar-perfil-profe-loading-button" : "completar-perfil-profe-submit-button"}
            >
              {loading ? 'Guardando...' : 'Completar perfil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompletarPerfilProfesor;
