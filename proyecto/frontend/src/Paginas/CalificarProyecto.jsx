// src/Paginas/CalificarProyecto.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Modal, Spinner } from 'react-bootstrap';
import { BsStar as Star, BsStarFill as StarFill, BsBookmarkCheck as BookmarkCheck, BsBookmarkX as BookmarkX, BsFilter as Filter } from "react-icons/bs";

const CalificarProyecto = () => {
    const [proyectos, setProyectos] = useState([]);
    const [filtro, setFiltro] = useState('todos'); // todos, sin_calificar, calificados
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [calificacion, setCalificacion] = useState(4.0);
    const [calificando, setCalificando] = useState(false);

    useEffect(() => {
        cargarProyectosAsignados();
    }, []);

    const cargarProyectosAsignados = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/proyectos/mis-proyectos-asignados', {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Error al cargar proyectos');
            }

            const data = await response.json();
            setProyectos(data);
        } catch (err) {
            setError('Error al cargar los proyectos asignados');
        } finally {
            setLoading(false);
        }
    };

    const abrirModalCalificacion = (proyecto) => {
        setProyectoSeleccionado(proyecto);
        setCalificacion(proyecto.calificacion_final || 4.0);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setProyectoSeleccionado(null);
        setCalificacion(4.0);
    };

    const calificarProyecto = async () => {
        if (!proyectoSeleccionado) return;

        try {
            setCalificando(true);
            const response = await fetch(`http://localhost:8000/proyectos/${proyectoSeleccionado.id}/calificacion`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ calificacion })
            });

            if (!response.ok) {
                throw new Error('Error al calificar proyecto');
            }

            const result = await response.json();
            
            // Actualizar la lista de proyectos
            setProyectos(prev => prev.map(p => 
                p.id === proyectoSeleccionado.id 
                    ? { ...p, calificacion_final: calificacion }
                    : p
            ));

            // Mostrar mensaje de éxito
           // Mostrar mensaje de éxito
            alert(`Proyecto calificado con ${calificacion}. ${result.en_ranking ? '¡Agregado al ranking!' : ''}`);
            
            cerrarModal();
        } catch (err) {
            alert('Error al calificar el proyecto');
        } finally {
            setCalificando(false);
        }
    };

    const proyectosFiltrados = proyectos.filter(proyecto => {
        if (filtro === 'sin_calificar') return !proyecto.calificacion_final;
        if (filtro === 'calificados') return proyecto.calificacion_final;
        return true; // todos
    });

    const renderEstrellas = (nota) => {
        const estrellas = [];
        const notaRedondeada = Math.round(nota * 2) / 2; // Redondear a 0.5
        
        for (let i = 1; i <= 7; i++) {
            if (i <= notaRedondeada) {
                estrellas.push(<StarFill key={i} className="text-warning me-1" />);
            } else {
                estrellas.push(<Star key={i} className="text-muted me-1" />);
            }
        }
        return estrellas;
    };

    const getBadgeEstado = (estado) => {
        const badges = {
            'propuesto': { bg: 'secondary', text: 'Propuesto' },
            'en_revision': { bg: 'warning', text: 'En Revisión' },
            'aprobado': { bg: 'success', text: 'Aprobado' },
            'rechazado': { bg: 'danger', text: 'Rechazado' }
        };
        return badges[estado] || { bg: 'secondary', text: estado };
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <Row className="mb-4">
                <Col>
                    <h2 className="text-center mb-3">📊 Calificar Proyectos Asignados</h2>
                    <p className="text-center text-muted">
                        Califica los proyectos asignados a ti. Proyectos con nota ≥6.0 aparecerán en el ranking.
                    </p>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" className="mb-4">
                    {error}
                </Alert>
            )}

            {/* Filtros */}
            <Row className="mb-4">
                <Col md={6} className="mx-auto">
                    <div className="d-flex justify-content-center gap-2">
                        <Button 
                            variant={filtro === 'todos' ? 'primary' : 'outline-primary'}
                            onClick={() => setFiltro('todos')}
                        >
                            <Filter className="me-1" /> Todos ({proyectos.length})
                        </Button>
                        <Button 
                            variant={filtro === 'sin_calificar' ? 'warning' : 'outline-warning'}
                            onClick={() => setFiltro('sin_calificar')}
                        >
                            <BookmarkX className="me-1" /> Sin Calificar ({proyectos.filter(p => !p.calificacion_final).length})
                        </Button>
                        <Button 
                            variant={filtro === 'calificados' ? 'success' : 'outline-success'}
                            onClick={() => setFiltro('calificados')}
                        >
                            <BookmarkCheck className="me-1" /> Calificados ({proyectos.filter(p => p.calificacion_final).length})
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Lista de Proyectos */}
            <Row>
                {proyectosFiltrados.length === 0 ? (
                <Col>
                    <Alert variant="info" className="text-center">
                            {filtro === 'todos' 
                                ? 'No tienes proyectos asignados.' 
                                : `No hay proyectos ${filtro === 'sin_calificar' ? 'sin calificar' : 'calificados'}.`
                            }
                            </Alert>
                        </Col>
                    ) : (
                    proyectosFiltrados.map(proyecto => (
                        <Col key={proyecto.id} md={6} lg={4} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <Badge bg={getBadgeEstado(proyecto.estado).bg}>
                                        {getBadgeEstado(proyecto.estado).text}
                                    </Badge>
                                    {proyecto.calificacion_final && (
                                        <div className="d-flex align-items-center">
                                            <span className="me-2 fw-bold">{proyecto.calificacion_final.toFixed(1)}</span>
                                            {renderEstrellas(proyecto.calificacion_final).slice(0, 1)}
                                        </div>
                                    )}
                                </Card.Header>
                                
                                <Card.Body>
                                    <Card.Title className="mb-2" style={{ fontSize: '1.1rem' }}>
                                        {proyecto.titulo}
                                    </Card.Title>
                                    
                                    <Card.Text className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                                        <strong>Creador:</strong> {proyecto.creador}
                                    </Card.Text>
                                    
                                    <Card.Text style={{ fontSize: '0.9rem' }}>
                                        {proyecto.descripcion?.substring(0, 100)}
                                        {proyecto.descripcion?.length > 100 && '...'}
                                    </Card.Text>

                                    {proyecto.perfiles_requeridos && proyecto.perfiles_requeridos.length > 0 && (
                                        <div className="mb-3">
                                            <small className="text-muted">Perfiles requeridos:</small>
                                            <div className="mt-1">
                                                {proyecto.perfiles_requeridos.slice(0, 2).map((perfil, idx) => (
                                                    <Badge key={idx} bg="light" text="dark" className="me-1">
                                                        {perfil.carrera || perfil}
                                                    </Badge>
                                                ))}
                                                {proyecto.perfiles_requeridos.length > 2 && (
                                                    <Badge bg="light" text="dark">
                                                        +{proyecto.perfiles_requeridos.length - 2} más
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Card.Body>
                                
                                <Card.Footer>
                                    <Button 
                                        variant={proyecto.calificacion_final ? "outline-success" : "primary"}
                                        onClick={() => abrirModalCalificacion(proyecto)}
                                        className="w-100"
                                    >
                                        {proyecto.calificacion_final ? '✏️ Editar Calificación' : '⭐ Calificar Proyecto'}
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {/* Modal de Calificación */}
            <Modal show={showModal} onHide={cerrarModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Calificar Proyecto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {proyectoSeleccionado && (
                        <>
                            <h5>{proyectoSeleccionado.titulo}</h5>
                            <p className="text-muted">Creador: {proyectoSeleccionado.creador}</p>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Calificación (1.0 - 7.0)</Form.Label>
                                <Form.Range
                                    min="1.0"
                                    max="7.0"
                                    step="0.1"
                                    value={calificacion}
                                    onChange={(e) => setCalificacion(parseFloat(e.target.value))}
                                />
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <span>1.0</span>
                                    <div className="text-center">
                                        <strong style={{ fontSize: '1.5rem' }}>{calificacion.toFixed(1)}</strong>
                                        <div>{renderEstrellas(calificacion)}</div>
                                    </div>
                                    <span>7.0</span>
                                </div>
                            </Form.Group>

                            {calificacion >= 6.0 && (
                                <Alert variant="success">
                                    🏆 ¡Este proyecto aparecerá en el ranking con esta calificación!
                                </Alert>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModal} disabled={calificando}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={calificarProyecto} disabled={calificando}>
                        {calificando ? <Spinner size="sm" className="me-2" /> : ''}
                        {calificando ? 'Calificando...' : 'Calificar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CalificarProyecto;