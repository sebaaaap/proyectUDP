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

  const styles = {
    page: {
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to bottom, #272627, #000000)",
      padding: "20px"
    },
    image: {
      height: "220px",
      marginRight: "60px",
      padding: "10px"
    },
    rightContainer: {
      width: "100%",
      maxWidth: "500px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    container: {
      width: "100%",
      maxWidth: "450px",
      padding: "40px",
      backgroundColor: "#403f3f",
      borderRadius: "20px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "24px",
    },
    h1: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: "2rem",
      textAlign: "center",
      margin: 0,
      marginBottom: "10px"
    },
    subtitle: {
      color: "#ccc",
      fontSize: "1rem",
      textAlign: "center",
      margin: 0,
      marginBottom: "20px"
    },
    errorMessage: {
      color: "#ff4444",
      backgroundColor: "rgba(255, 68, 68, 0.1)",
      padding: "12px",
      borderRadius: "8px",
      width: "100%",
      textAlign: "center",
      marginBottom: "10px",
      border: "1px solid rgba(255, 68, 68, 0.3)"
    },
    form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    label: {
      color: "#fff",
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "4px"
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      backgroundColor: "#2a2a2a",
      border: "2px solid #555",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "16px",
      transition: "border-color 0.3s, box-shadow 0.3s",
      outline: "none"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      backgroundColor: "#2a2a2a",
      border: "2px solid #555",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "16px",
      transition: "border-color 0.3s, box-shadow 0.3s",
      outline: "none"
    },
    submitButton: {
      width: "100%",
      padding: "14px 24px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s, transform 0.1s",
      marginTop: "10px"
    },
    loadingButton: {
      width: "100%",
      padding: "14px 24px",
      backgroundColor: "#666",
      color: "white",
      border: "none",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "not-allowed",
      marginTop: "10px",
      opacity: "0.7"
    }
  };

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

  const handleInputFocus = (e) => {
    e.target.style.borderColor = "#28a745";
    e.target.style.boxShadow = "0 0 0 3px rgba(40, 167, 69, 0.1)";
  };

  const handleInputBlur = (e) => {
    e.target.style.borderColor = "#555";
    e.target.style.boxShadow = "none";
  };

  return (
    <div style={styles.page}>
      <img src="/Proyectoudpnegrosf.png" alt="Logo UDP" style={styles.image} />
      <div style={styles.rightContainer}>
        <div style={styles.container}>
          <h1 style={styles.h1}>Completa tu perfil</h1>
          <p style={styles.subtitle}>
            Necesitamos algunos datos adicionales para personalizar tu experiencia
          </p>
          
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Carrera
              </label>
              <select
                value={carreraId}
                onChange={(e) => setCarreraId(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                style={styles.select}
              >
                <option value="">Selecciona una carrera</option>
                {carreras.map(carrera => (
                  <option key={carrera.id} value={carrera.id}>
                    {carrera.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Semestre actual
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={semestreActual}
                onChange={(e) => setSemestreActual(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                style={styles.input}
                placeholder="Ej: 5"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Promedio general
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                max="7"
                value={promedioGeneral}
                onChange={(e) => setPromedioGeneral(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                style={styles.input}
                placeholder="Ej: 5.8"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={loading ? styles.loadingButton : styles.submitButton}
              onMouseOver={!loading ? (e) => {
                e.target.style.backgroundColor = "#218838";
                e.target.style.transform = "translateY(-1px)";
              } : undefined}
              onMouseOut={!loading ? (e) => {
                e.target.style.backgroundColor = "#28a745";
                e.target.style.transform = "translateY(0)";
              } : undefined}
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