// src/Paginas/RankingProyectos.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const RankingProyectos = () => {
    const [proyectos, setProyectos] = useState([]);
    const [facultades, setFacultades] = useState([]);
    const [filtroFacultad, setFiltroFacultad] = useState('');
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('success');
    const { user } = useAuth();

    const esProfesor = user?.rol === 'profesor';

    useEffect(() => {
        cargarDatos();
    }, [filtroFacultad]);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            
            // Cargar proyectos del ranking
            const params = new URLSearchParams();
            if (filtroFacultad) params.append('facultad', filtroFacultad);
            
            const responseProyectos = await fetch(`http://localhost:8000/ranking?${params}`, {
                credentials: 'include'
            });
            
            if (responseProyectos.ok) {
                const dataProyectos = await responseProyectos.json();
                setProyectos(dataProyectos);
            }

            // Cargar facultades
            const responseFacultades = await fetch('http://localhost:8000/ranking/facultades', {
                credentials: 'include'
            });
            
            if (responseFacultades.ok) {
                const dataFacultades = await responseFacultades.json();
                setFacultades(dataFacultades);
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            mostrarMensaje('Error al cargar los datos', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const handleVoto = async (proyectoId, votoPositivo) => {
        try {
            const response = await fetch(`http://localhost:8000/ranking/${proyectoId}/votar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ voto_positivo: votoPositivo })
            });

            if (response.ok) {
                mostrarMensaje('Voto registrado correctamente', 'success');
                // Recargar datos para actualizar el estado
                cargarDatos();
            } else {
                const error = await response.json();
                mostrarMensaje(error.detail || 'Error al registrar voto', 'danger');
            }
        } catch (error) {
            console.error('Error votando:', error);
            mostrarMensaje('Error al registrar voto', 'danger');
        }
    };

    const mostrarMensaje = (texto, tipo) => {
        setMensaje(texto);
        setTipoMensaje(tipo);
        setTimeout(() => setMensaje(''), 3000);
    };

    const truncarTexto = (texto, longitud = 150) => {
        if (!texto) return '';
        return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto;
    };

    const getBadgeColor = (posicion) => {
        if (posicion === 1) return 'warning'; // Dorado
        if (posicion === 2) return 'secondary'; // Plateado
        if (posicion === 3) return 'dark'; // Bronce
        return 'primary';
    };

    return (
        <Container fluid className="py-4" style={{ minHeight: '100vh' }}>
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="text-white">Ranking de Proyectos</h1>
                        <div className="d-flex align-items-center gap-3">
                            <Form.Select 
                                value={filtroFacultad} 
                                onChange={(e) => setFiltroFacultad(e.target.value)}
                                style={{ width: '250px' }}
                            >
                                <option value="">Todas las facultades</option>
                                {facultades.map(facultad => (
                                    <option key={facultad} value={facultad}>{facultad}</option>
                                ))}
                            </Form.Select>
                            {esProfesor && (
                                <Badge bg="info" className="p-2">
                                    Profesor - Puedes votar
                                </Badge>
                            )}
                        </div>
                    </div>

                    {mensaje && (
                        <Alert variant={tipoMensaje} className="mb-4">
                            {mensaje}
                        </Alert>
                    )}

                    {loading ? (
                        <div className="text-center text-white">
                            <h4>Cargando proyectos...</h4>
                        </div>
                    ) : proyectos.length === 0 ? (
                        <div className="text-center text-white">
                            <h4>No hay proyectos en el ranking</h4>
                            <p>Los proyectos deben tener una calificación mínima de 6.0 para aparecer aquí.</p>
                        </div>
                    ) : (
                        <Row>
                            {proyectos.map((proyecto, index) => (
                                <Col md={6} lg={4} key={proyecto.id} className="mb-4">
                                    <Card 
                                        className="h-100" 
                                        style={{ 
                                            backgroundColor: '#2c2c2c', 
                                            borderColor: '#555',
                                            position: 'relative'
                                        }}
                                    >
                                        {/* Badge de posición */}
                                        <Badge 
                                            bg={getBadgeColor(index + 1)}
                                            className="position-absolute"
                                            style={{ 
                                                top: '10px', 
                                                left: '10px', 
                                                fontSize: '1rem',
                                                zIndex: 1
                                            }}
                                        >
                                            #{index + 1}
                                        </Badge>

                                        <Card.Body className="text-white d-flex flex-column">
                                            <div className="mb-3 mt-3">
                                                <Card.Title className="h5 mb-2">
                                                    {proyecto.titulo}
                                                </Card.Title>
                                                
                                                <div className="mb-2">
                                                    <small className="text-muted">
                                                        <strong>Creador:</strong> {proyecto.creador_nombre}
                                                    </small>
                                                </div>
                                                
                                                <div className="mb-2">
                                                    <small className="text-muted">
                                                        <strong>Profesor:</strong> {proyecto.profesor_nombre}
                                                    </small>
                                                </div>

                                                {proyecto.facultad && (
                                                    <div className="mb-2">
                                                        <Badge bg="secondary" className="me-2">
                                                            {proyecto.facultad}
                                                        </Badge>
                                                    </div>
                                                )}

                                                <div className="mb-3">
                                                    <Badge bg="success" className="me-2">
                                                        Calificación: {proyecto.calificacion_final.toFixed(1)}
                                                    </Badge>
                                                    <Badge bg="info">
                                                        {proyecto.puntuacion_ranking} votos
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex-grow-1 mb-3">
                                                <Card.Text className="small">
                                                    <strong>Resumen:</strong><br />
                                                    {truncarTexto(proyecto.resumen)}
                                                </Card.Text>
                                            </div>

                                            {/* Botones de votación para profesores */}
                                            {esProfesor && (
                                                <div className="mt-auto">
                                                    {proyecto.ya_vote ? (
                                                        <div className="text-center">
                                                            <Badge 
                                                                bg={proyecto.mi_voto ? "success" : "danger"}
                                                                className="p-2 mb-2"
                                                            >
                                                                Ya votaste: {proyecto.mi_voto ? "👍 Positivo" : "👎 Negativo"}
                                                            </Badge>
                                                            <div>
                                                                <Button
                                                                    variant={proyecto.mi_voto ? "outline-success" : "success"}
                                                                    size="sm"
                                                                    className="me-2"
                                                                    onClick={() => handleVoto(proyecto.id, true)}
                                                                >
                                                                    👍
                                                                </Button>
                                                                <Button
                                                                    variant={!proyecto.mi_voto ? "outline-danger" : "danger"}
                                                                    size="sm"
                                                                    onClick={() => handleVoto(proyecto.id, false)}
                                                                >
                                                                    👎
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <div className="mb-2">
                                                                <small className="text-muted">Vota este proyecto:</small>
                                                            </div>
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                className="me-2"
                                                                onClick={() => handleVoto(proyecto.id, true)}
                                                            >
                                                                👍 Votar
                                                            </Button>
                                                            <Button
                                                                variant="danger"
                                                                size="sm"
                                                                onClick={() => handleVoto(proyecto.id, false)}
                                                            >
                                                                👎 Votar
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {!esProfesor && (
                                                <div className="mt-auto text-center">
                                                    <small className="text-muted">
                                                        Solo profesores pueden votar
                                                    </small>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default RankingProyectos;