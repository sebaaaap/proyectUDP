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
import { useAuth } from './context/AuthContext';

function PruebaNavbar() {
    const { user } = useAuth();
    const isEstudiante = user?.rol === 'estudiante';
    const [profesores, setProfesores] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8000/profesores', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setProfesores(data))
            .catch(() => setProfesores([]));
    }, []);

    const handleLogout = () => {
        window.location.href = 'http://localhost:8000/logout';
    };

    const handleRanking = () => {
        navigate('/ranking');
    };

    return (
        <header>
            <Navbar expand="lg" className="bg-dark navbar-dark" style={{ borderBottom: '2px solid white', minHeight: 70, paddingLeft: 32, paddingRight: 32 }}>
                <Navbar.Brand as={Link} to="/home" className="d-flex align-items-center" style={{ marginRight: 32 }}>
                    <img src="/Proyectoudpnegrosfcortado.png" alt="UDP Logo" style={{ height: 40, marginRight: 12 }} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0 udp-navbar-links" navbarScroll style={{ alignItems: 'center', gap: 18 }}>
                        <Nav.Link as={Link} to="/crear-proyecto" className="udp-navbar-link">Crear Proyecto</Nav.Link>
                        <Nav.Link as={Link} to="/mis-proyectos" className="udp-navbar-link">Mis Proyectos</Nav.Link>
                        <Nav.Link as={Link} to="/ranking" className="udp-navbar-link">Ver Ranking</Nav.Link>
                    </Nav>
                    <Nav className="ms-auto d-flex align-items-center" style={{ gap: 18 }}>
                        <NavDropdown title="Profesores" id="dropdown-profesores" align="end">
                            {profesores.length === 0 && <NavDropdown.Item disabled>Cargando...</NavDropdown.Item>}
                            {profesores.map(prof => (
                                <NavDropdown.Item key={prof.id} disabled>{prof.nombre} ({prof.correo})</NavDropdown.Item>
                            ))}
                        </NavDropdown>
                        <Button variant="outline-danger" onClick={handleLogout} style={{ fontWeight: 600, borderRadius: 20, padding: '6px 22px' }}>
                            Cerrar sesión
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
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
            `}</style>
        </header>
    );
}

export default PruebaNavbar;