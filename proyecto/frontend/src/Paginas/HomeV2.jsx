import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hoveredCircle, setHoveredCircle] = useState(null);

  const irACrear = () => {
    navigate("/crear-proyecto");
  };

  const irADashboard = () => {
    if (usuario.rol === 'estudiante') {
      navigate("/dashboard-estudiante");
    } else if (usuario.rol === 'profesor') {
      navigate("/dashboard-profe");
    }
  };

  const handleLogout = () => {
    window.location.href = "http://localhost:8000/logout";
  };

  useEffect(() => {
    console.log('Home component mounted');
    console.log('current pathname:', window.location.pathname);
    
    fetch("http://localhost:8000/me", {
      method: "GET",
      credentials: "include", // Importante para cookies
    })
      .then((res) => {
        if (res.status === 401) {
          console.log('No autenticado');
          setIsAuthenticated(false);
          navigate("/"); // No autenticado → ir al inicio
        } else {
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          console.log('Usuario autenticado:', data);
          setUsuario(data);
          setIsAuthenticated(true);
        }
      })
      .catch((error) => {
        console.error('Error de autenticación:', error);
        setIsAuthenticated(false);
        navigate("/");
      });
  }, [navigate]);

  const circleData = [
    {
      id: 1,
      title: "Plataforma exclusiva para estudiantes y profesores de la UDP",
      description: "Nuestra plataforma está diseñada específicamente para la comunidad UDP, facilitando la colaboración entre estudiantes y profesores en proyectos innovadores."
    },
    {
      id: 2,
      title: "Estudiantes postulan ideas de proyectos interdisciplinarios",
      description: "Los estudiantes pueden presentar sus ideas creativas de proyectos que combinen diferentes disciplinas, fomentando la innovación y el trabajo colaborativo."
    },
    {
      id: 3,
      title: "Profesores validan y definen equipos necesarios",
      description: "Los profesores revisan las propuestas, las validan según criterios académicos y definen los equipos necesarios para llevar a cabo cada proyecto."
    },
    {
      id: 4,
      title: "Subida de archivos y evaluación continua",
      description: "Durante el desarrollo del proyecto, los equipos pueden subir diferentes tipos de archivos (PDF, documentos, hojas de cálculo) y recibir evaluaciones con feedback detallado."
    },
    {
      id: 5,
      title: "Ranking anual con los mejores proyectos",
      description: "Al final del año académico, se genera un ranking que reconoce y premia a los mejores proyectos, incentivando la excelencia y la innovación."
    }
  ];

  if (!isAuthenticated || !usuario) {
    return (
      <div style={{ width: "100%", margin: 0, padding: 0 }}>
        {/* Imagen de portada que ocupa toda la pantalla */}
        <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
          <img
            src="/imagenhome.jpg"
            alt="Portada"
            style={{
              width: "100%",
              height: "90%",
              objectFit: "cover"
            }}
          />
        </div>
        <h1 style={{ marginBottom: "18px", color: "#fff", textAlign: "center" }}>
          ¡Bienvenido/a a la Plataforma de Proyectos UDP!
        </h1>
        {/* Contenido informativo debajo de la imagen */}
        <div
          style={{
            background: "linear-gradient(to bottom, #272627, #000000)",
            color: "#fff",
            borderRadius: "16px",
            padding: "40px",
            maxWidth: "800px",
            margin: "0 auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontSize: "1.15rem",
            lineHeight: "1.7",
            textAlign: "center",
            marginTop: "40px"
          }}
        >
          
          <p>
            Es una plataforma exclusiva para estudiantes y profesores de la UDP.
          </p>
          <p>
            Permite a estudiantes con ideas de proyectos interdisciplinarios postularlas para que un profesor las valide y defina el equipo necesario. Una vez aprobado, el proyecto queda visible para que otros estudiantes postulen o sean invitados según su perfil.
          </p>
          <p>
            Durante el semestre, los equipos podrán subir distintos tipos de archivos en la plataforma (PDF, .docs, xls, etc.), para complementar el proyecto o recibir una evaluación con calificación y feedback. Anual o semestralmente, se genera un ranking con los mejores proyectos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", margin: 0, padding: 0 }}>
      {/* Imagen de portada que ocupa toda la pantalla */}
      <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
        <img
          src="/imagenhome.jpg"
          alt="Portada"
          style={{
            width: "100%",
            height: "90%",
            objectFit: "cover"
          }}
        />
      </div>
      <h1 style={{ marginBottom: "18px", color: "#fff", textAlign: "center" }}>
        ¡Bienvenido/a {usuario.nombre} a la plataforma de proyectos UDP ({usuario.rol})!
      </h1>
      
      {/* Círculos con definiciones en fila */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginBottom: "30px",
        flexWrap: "wrap",
        position: "relative"
      }}>
        {circleData.map((circle) => (
          <div
            key={circle.id}
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              backgroundColor: hoveredCircle === circle.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "15px",
              fontSize: "14px",
              color: "#fff",
              border: "2px solid rgba(255,255,255,0.3)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              transform: hoveredCircle === circle.id ? "scale(1.05)" : "scale(1)"
            }}
            onMouseEnter={() => setHoveredCircle(circle.id)}
            onMouseLeave={() => setHoveredCircle(null)}
          >
            {circle.title}
          </div>
        ))}
      </div>

      {/* Botones debajo de los círculos */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginBottom: "30px",
        flexWrap: "wrap"
      }}>
        {/* Solo mostrar botón de crear proyecto para estudiantes */}
        {usuario.rol === 'estudiante' && (
          <button
            onClick={irACrear}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "16px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              animation: "pulse 1s infinite",
              boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)"
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#218838";
              e.target.style.transform = "scale(1.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#28a745";
              e.target.style.transform = "scale(1)";
            }}
          >
            Crear Proyecto
          </button>
        )}

        <button
          onClick={irADashboard}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#0056b3";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.transform = "scale(1)";
          }}
        >
          Ir al Dashboard
        </button>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent",
            color: "#dc3545",
            border: "2px solid #dc3545",
            padding: "10px 22px",
            borderRadius: "12px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#dc3545";
            e.target.style.color = "white";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#dc3545";
            e.target.style.transform = "scale(1)";
          }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Descripción detallada que aparece al hacer hover - centrada en la pantalla */}
      {hoveredCircle && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(0,0,0,0.95)",
          color: "#fff",
          padding: "30px",
          borderRadius: "15px",
          maxWidth: "500px",
          textAlign: "center",
          zIndex: 1000,
          boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
          border: "2px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(10px)",
          animation: "tooltipAppear 0.3s ease-out"
        }}>
          <h3 style={{ marginBottom: "15px", color: "#fff", fontSize: "18px" }}>
            {circleData.find(c => c.id === hoveredCircle)?.title}
          </h3>
          <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
            {circleData.find(c => c.id === hoveredCircle)?.description}
          </p>
        </div>
      )}

      {/* Estilos CSS para las animaciones */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 6px 20px rgba(40, 167, 69, 0.5);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            }
          }

          @keyframes tooltipAppear {
            0% {
              opacity: 0;
              transform: translate(-50%, -50%) scale(0.8);
            }
            100% {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;
