// Home.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Home component mounted');
        console.log('isAuthenticated:', isAuthenticated);
        console.log('user:', user);
        console.log('current pathname:', window.location.pathname);
        
        // Solo redirigir si no está autenticado y no está ya en la página principal
        if (!isAuthenticated && window.location.pathname !== '/') {
            navigate('/');
        }
    }, [isAuthenticated, navigate, user]);

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
                
                {isAuthenticated && user && (
                    <div style={{ 
                        backgroundColor: "rgba(255,255,255,0.1)", 
                        padding: "20px", 
                        borderRadius: "10px", 
                        marginBottom: "20px" 
                    }}>
                        <h4>Usuario Autenticado</h4>
                        <p>Email: {user.sub}</p>
                        <p>Rol: {user.rol_plataforma}</p>
                    </div>
                )}
                
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
};