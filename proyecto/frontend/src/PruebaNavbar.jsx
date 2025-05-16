//pruebaNavbar.jsx
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
import Usuario from '../public/Usuario.png';
import { Link } from 'react-router-dom';

function PruebaNavbar() {
    return (
        <>
            <header>
                <Navbar expand="lg" className="bg-dark navbar-dark">
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav className="me-auto my-2 my-lg-0" navbarScroll>
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
                                            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                        />
                                    </Button>
                                }
                                id="navbarScrollingDropdown"
                            >
                                <NavDropdown.Item as={Link} to="/">Home</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/registrar">Registrarse</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/proyecto-form">Formulario de Proyecto</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
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
                                    <Button variant="outline-success">Buscar</Button>
                                </Col>
                            </Row>
                        </Form>
                    </Navbar.Collapse>
                </Navbar>
            </header>
                <Outlet />
            
        </>
    );
}

export default PruebaNavbar;