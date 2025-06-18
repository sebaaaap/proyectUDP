// Home.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const Home = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);

    const irACrear = () => {
        navigate("/proyecto-form");
    };

    const irAlDashboard = () => {
        if (usuario?.rol === 'estudiante') {
            navigate("/dashboard-estudiante");
        } else if (usuario?.rol === 'profesor') {
            navigate("/dashboard-profe");
        }
    };

    useEffect(() => {
        console.log('Home component mounted');
        console.log('isAuthenticated:', isAuthenticated);
        console.log('user:', user);
        console.log('current pathname:', window.location.pathname);
        
        // Solo redirigir si no está autenticado y no está ya en la página principal
        if (!isAuthenticated && window.location.pathname !== '/') {
            navigate('/');
        }

        // Obtener información del usuario desde el backend
        if (isAuthenticated) {
            fetch("http://localhost:8000/me", {
                method: "GET",
                credentials: "include",
            })
            .then((res) => {
                if (res.status === 401) {
                    navigate("/");
                } else {
                    return res.json();
                }
            })
            .then((data) => {
                if (data) setUsuario(data);
            })
            .catch(() => navigate("/"));
        }
    }, [isAuthenticated, navigate, user]);

    if (!isAuthenticated) {
        return (
            <div style={{ 
                width: "100%", 
                margin: 0, 
                padding: "20px",
                backgroundColor: "#f5f5f5",
                minHeight: "100vh"
            }}>
                <div style={{
                    background: "linear-gradient(to bottom, #272627, #000000)",
                    color: "#fff",
                    borderRadius: "16px",
                    padding: "40px",
                    maxWidth: "800px",
                    margin: "0 auto",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    fontSize: "1.15rem",
                    lineHeight: "1.7",
                    textAlign: "center"
                }}>
                    <h2 style={{ marginBottom: "18px", color: "#fff" }}>
                        Bienvenido a la Plataforma de Proyectos UDP
                    </h2>
                    
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

    if (!usuario) return <div className="p-6">Cargando...</div>;

    const isEstudiante = usuario.rol === 'estudiante';

    return (
        <div style={{ 
            width: "100%", 
            margin: 0, 
            padding: "20px",
            backgroundColor: "#f5f5f5",
            minHeight: "100vh"
        }}>
            <div style={{
                background: "linear-gradient(to bottom, #272627, #000000)",
                color: "#fff",
                borderRadius: "16px",
                padding: "40px",
                maxWidth: "800px",
                margin: "0 auto",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                fontSize: "1.15rem",
                lineHeight: "1.7",
                textAlign: "center"
            }}>
                <h2 style={{ marginBottom: "18px", color: "#fff" }}>
                    Bienvenido a la Plataforma de Proyectos UDP
                </h2>
                
                <div style={{ 
                    backgroundColor: "rgba(255,255,255,0.1)", 
                    padding: "20px", 
                    borderRadius: "10px", 
                    marginBottom: "20px" 
                }}>
                    <h4>Hola {usuario.nombre} {usuario.apellido}</h4>
                    <p>Rol: {usuario.rol}</p>
                </div>

                {/* Botones de acción */}
                <div style={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: "12px", 
                    alignItems: "center",
                    marginTop: "20px"
                }}>
                    {/* Botón de ir al Dashboard */}
                    <button
                        onClick={irAlDashboard}
                        style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "12px 24px",
                            borderRadius: "12px",
                            fontSize: "16px",
                            cursor: "pointer",
                            transition: "background-color 0.3s"
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                        onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
                    >
                        Ir al Dashboard
                    </button>

                    {/* Solo mostrar botón de crear proyecto para estudiantes */}
                    {isEstudiante && (
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
                                transition: "background-color 0.3s"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#218838"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#28a745"}
                        >
                            Crear Proyecto
                        </button>
                    )}
                </div>
                
                <p style={{ marginTop: "30px" }}>
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
};