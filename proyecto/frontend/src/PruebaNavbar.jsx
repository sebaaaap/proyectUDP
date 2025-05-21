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

function PruebaNavbar() {
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
                <NavDropdown.Item as={Link} to="/login" style={{ fontSize: '18px' }}>Login</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/registrar" style={{ fontSize: '18px' }}>Registrarse</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/" style={{ fontSize: '20px', color: "white" }}>Home</Nav.Link>
            <Nav.Item style={{ borderLeft: '1px solid white', height: '20px', margin: '0 15px' }}></Nav.Item>
            <Nav.Link as={Link} to="/proyecto-form" style={{ fontSize: '20px', color: "white" }}>Formulario de Proyecto</Nav.Link>
        </Nav>
        {/* Buscador DERECHA */}
        <div className="ms-auto">
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
                        <Button variant="outline-success" style={{ marginRight: '30px' }}>Buscar</Button>
                    </Col>
                </Row>
            </Form>
        </div>
    </Navbar.Collapse>
</Navbar>
            </header>
            <Outlet />
        </>
    );
}

export default PruebaNavbar;