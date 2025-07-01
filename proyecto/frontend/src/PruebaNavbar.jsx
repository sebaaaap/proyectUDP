import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Usuario from '../public/Astronauta.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './auth/useAuth';
// import { X, House, PlusCircle, Folder, Trophy } from 'react-bootstrap-icons';

function PruebaNavbar() {
    const { usuario, loading } = useAuth();
    const isEstudiante = usuario?.rol === 'estudiante';
    const [profesores, setProfesores] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Debug: mostrar información del usuario
    console.log('Usuario actual:', usuario);
    console.log('Rol del usuario:', usuario?.rol);
    console.log('¿Es estudiante?:', isEstudiante);
    console.log('Loading:', loading);

    useEffect(() => {
        fetch('http://localhost:8000/profesores', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setProfesores(data))
            .catch(() => setProfesores([]));
    }, []);

    const handleLogout = () => {
        window.location.href = 'http://localhost:5173/';
    };

    const handleRanking = () => {
        navigate('/ranking');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // Función para formatear el nombre completo
    const formatearNombreCompleto = (nombre, apellido) => {
        if (!nombre || !apellido) return 'Cargando...';
        
        // Tomar solo el primer nombre (antes del primer espacio)
        const primerNombre = nombre.split(' ')[0];
        
        // Combinar ambos apellidos
        const apellidosCompletos = apellido;
        
        return `${primerNombre} ${apellidosCompletos}`;
    };

    return (
        <header>
            <Navbar expand="lg" className="bg-dark navbar-dark" style={{ borderBottom: '2px solid white', minHeight: 70, paddingLeft: 32, paddingRight: 32 }}>
                <div className="d-flex align-items-center" style={{ marginRight: 32 }}>
                    <button 
                        className="hamburger-btn"
                        onClick={toggleSidebar}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#f3f3f3', 
                            fontSize: '32px', 
                            cursor: 'pointer',
                            marginRight: '15px',
                            padding: '5px'
                        }}
                    >
                        ☰
                    </button>
                    <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center">
                        <img src="/Proyectoudpnegrosfcortado.png" alt="UDP Logo" style={{ height: 40, marginRight: 12, marginTop: 8 }} />
                    </Navbar.Brand>
                </div>
                <Nav className="ms-auto d-flex align-items-center" style={{ gap: 18 }}>
                    <Button variant="outline-danger" onClick={handleLogout} style={{ fontWeight: 600, borderRadius: 20, padding: '6px 22px' }}>
                        Cerrar sesión
                    </Button>
                </Nav>
            </Navbar>

            {/* Barra lateral */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <img src="/Proyectoudpnegrosfcortado.png" alt="UDP Logo" style={{ height: 50, alignItems: 'center' }} />
                    
                </div>
                <div className="sidebar-content">
                    <div className="sidebar-section">
                        <h5>Menú</h5>
                                                <Link to="/home" className="sidebar-link" onClick={closeSidebar}>
                            Home
                        </Link>
                        {!loading && (usuario?.rol === 'estudiante' || usuario?.rol === 'Estudiante') && (
                            <Link to="/crear-proyecto" className="sidebar-link" onClick={closeSidebar}>
                                Crear Proyecto
                            </Link>
                        )}
                        {!loading && (usuario?.rol === 'estudiante' || usuario?.rol === 'Estudiante') && (
                            <Link to="/dashboard-estudiante" className="sidebar-link" onClick={closeSidebar}>
                                Dashboard Estudiante
                            </Link>
                        )}
                        {!loading && (usuario?.rol === 'profesor' || usuario?.rol === 'Profesor') && (
                            <Link to="/dashboard-profe" className="sidebar-link" onClick={closeSidebar}>
                                Dashboard Profesor
                            </Link>
                        )}
                        <Link to="/mis-proyectos" className="sidebar-link" onClick={closeSidebar}>
                            Mis Proyectos
                        </Link>
                        <Link to="/ranking" className="sidebar-link" onClick={closeSidebar}>
                            Ranking de proyectos
                        </Link>
                    </div>
                    <div className="sidebar-section">
                        <h5>Datos del usuario</h5>
                        <div className="user-info">
                            <p><strong>Nombre:</strong> {formatearNombreCompleto(usuario?.nombre, usuario?.apellido)}</p>
                            <p><strong>Rol:</strong> {usuario?.rol || 'Cargando...'}</p>
                            <p><strong>Email:</strong> {usuario?.correo || usuario?.email || 'Cargando...'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .udp-navbar-links .udp-navbar-link {
                    color: #f3f3f3 !important;
                    font-weight: 600;
                    font-size: 18px;
                    padding: 8px 18px;
                    border-radius: 8px;
                    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
                }
                .udp-navbar-links .udp-navbar-link:hover, .udp-navbar-links .udp-navbar-link.active {
                    background: #f3f3f3 !important;
                    color: #222 !important;
                    text-decoration: underline;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
                }

                .hamburger-btn:hover {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border-radius: 5px;
                }

                /* Estilos para la barra lateral */
                .sidebar-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 999;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                .sidebar-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }

                .sidebar {
                    position: fixed;
                    top: 0;
                    left: -25%;
                    width: 25%;
                    height: 100%;
                    background: #222;
                    z-index: 1000;
                    transition: left 0.3s ease;
                    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
                    overflow-y: auto;
                }

                .sidebar.open {
                    left: 0;
                }

                .sidebar-header {
                    padding: 20px;
                    border-bottom: 1px solid #444;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: #f3f3f3;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 5px;
                    transition: background 0.2s;
                }

                .close-btn:hover {
                    background: #444;
                }

                .sidebar-content {
                    padding: 20px;
                }

                .sidebar-section {
                    margin-bottom: 30px;
                }

                .sidebar-section h5 {
                    color: #f3f3f3;
                    margin-bottom: 15px;
                    font-size: 18px;
                    font-weight: 600;
                    border-bottom: 2px solid #f3f3f3;
                    padding-bottom: 5px;
                }

                .sidebar-link {
                    display: flex;
                    align-items: center;
                    padding: 12px 15px;
                    color: #f3f3f3;
                    text-decoration: none;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    transition: all 0.2s;
                    font-weight: 500;
                }

                .sidebar-link:hover {
                    background: #f3f3f3;
                    color: #222;
                    text-decoration: none;
                    transform: translateX(5px);
                }

                .user-info {
                    background: #333;
                    padding: 15px;
                    border-radius: 8px;
                    color: #f3f3f3;
                }

                .user-info p {
                    margin: 5px 0;
                    font-size: 14px;
                }

                /* Responsive para móviles */
                @media (max-width: 768px) {
                    .sidebar {
                        width: 80%;
                        left: -80%;
                    }
                }
            `}</style>
        </header>
    );
}

export default PruebaNavbar;