import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompletarPerfilProfesor = () => {
  const [facultad, setFacultad] = useState('');
  const [facultades, setFacultades] = useState([]);
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
            Necesitamos algunos datos adicionales para personalizar tu experiencia como profesor
          </p>
          
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Facultad
              </label>
              <select
                value={facultad}
                onChange={(e) => setFacultad(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                required
                style={styles.select}
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

export default CompletarPerfilProfesor;
