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
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './context/AuthContext';

function PruebaNavbar() {
    // Notificaciones simuladas
    const [notificaciones] = useState([
        { id: 1, mensaje: "Tu postulación fue aprobada", leido: false },
        { id: 2, mensaje: "Nuevo archivo subido a tu proyecto", leido: false }
    ]);

    // Obtener información del usuario autenticado y función de logout
    const { user, logout } = useAuth();
    const isEstudiante = user?.rol === 'estudiante';

    const handleLogout = () => {
        logout(); // Esto limpiará el token y redirigirá a '/'
        // También hacer logout en el backend
        fetch("http://localhost:8000/logout", {
            method: "POST",
            credentials: "include",
        }).catch(error => {
            console.error('Error en logout del backend:', error);
        });
    };

    return (
        <>
            <header>
                <Navbar expand="lg" className="bg-dark navbar-dark" style={{ borderBottom: '2px solid white' }}>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        {/* Nav IZQUIERDA */}
                        <Nav className="me-auto my-2 my-lg-0" navbarScroll style={{ alignItems: "center" }}>
                            <NavDropdown
                                title={
                                    <Button
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            padding: 0,
                                        }}
                                    >
                                        <img
                                            src={Usuario}
                                            alt="Usuario"
                                            style={{ width: '80px', height: '50px', borderRadius: '10%' }}
                                        />
                                    </Button>
                                }
                                id="navbarScrollingDropdown"
                            >
                                <NavDropdown.Item onClick={handleLogout} style={{ fontSize: '18px' }}>Cerrar Sesión</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link as={Link} to="/Home" style={{ fontSize: '20px', color: "white" }}>Home</Nav.Link>
                            <Nav.Item style={{ borderLeft: '1px solid white', height: '20px', margin: '0 15px' }}></Nav.Item>
                            {/* Solo mostrar Formulario de Proyecto para estudiantes */}
                            {isEstudiante && (
                                <>
                                    <Nav.Link as={Link} to="/proyecto-form" style={{ fontSize: '20px', color: "white" }}>Formulario de Proyecto</Nav.Link>
                                    <Nav.Item style={{ borderLeft: '1px solid white', height: '20px', margin: '0 15px' }}></Nav.Item>
                                </>
                            )}
                            <Nav.Link as={Link} to="/mis-proyectos" style={{ fontSize: '20px', color: "white" }}>Mis proyectos</Nav.Link>
                        </Nav>
                        {/* Buscador y Notificaciones DERECHA */}
                        <div className="ms-auto d-flex align-items-center" style={{ gap: 20 }}>
                            <Form className="d-flex">
                                <Row>
                                    <Col xs="auto">
                                        <Form.Control
                                            type="text"
                                            placeholder="Buscar..."
                                            className="me-2"
                                            style={{
                                                backgroundColor: 'gray',
                                                color: 'white',
                                            }}
                                        />
                                    </Col>
                                    <Col xs="auto">
                                        <Button variant="outline-success" >Buscar</Button>
                                    </Col>
                                </Row>
                            </Form>
                            <Nav>
                                <NavDropdown
                                    align="end"
                                    title={
                                        <span style={{ position: "relative", fontSize: 24, color: "white", marginRight: 20 }}>
                                            🔔
                                            {notificaciones.filter(n => !n.leido).length > 0 && (
                                                <span style={{
                                                    position: "absolute",
                                                    top: -6,
                                                    right: -10,
                                                    background: "red",
                                                    color: "white",
                                                    borderRadius: "50%",
                                                    width: 18,
                                                    height: 18,
                                                    fontSize: 12,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    {notificaciones.filter(n => !n.leido).length}
                                                </span>
                                            )}
                                        </span>
                                    }
                                    id="nav-notificaciones"
                                >
                                    <NavDropdown.Header>Notificaciones</NavDropdown.Header>
                                    {notificaciones.length === 0 && (
                                        <NavDropdown.Item disabled>No tienes notificaciones</NavDropdown.Item>
                                    )}
                                    {notificaciones.map(n => (
                                        <NavDropdown.Item key={n.id} style={{ fontWeight: n.leido ? "normal" : "bold" }}>
                                            {n.mensaje}
                                        </NavDropdown.Item>
                                    ))}
                                </NavDropdown>
                            </Nav>
                        </div>
                    </Navbar.Collapse>
                </Navbar>
            </header>
            <Outlet />
        </>
    );
}

export default PruebaNavbar;