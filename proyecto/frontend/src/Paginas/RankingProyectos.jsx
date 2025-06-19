// src/Paginas/RankingProyectos.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Spinner, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const RankingProyectos = () => {
    const [proyectos, setProyectos] = useState([]);
    const [facultades, setFacultades] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [filtroFacultad, setFiltroFacultad] = useState('');
    const [ordenamiento, setOrdenamiento] = useState('puntuacion'); // puntuacion, calificacion, votos
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('success');
    const [proyectoDetalle, setProyectoDetalle] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const { user } = useAuth();

    const esProfesor = user?.rol === 'profesor';

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            cargarDatos();
        }, 300);
        return () => clearTimeout(timer);
    }, [filtroFacultad, ordenamiento, busqueda]);

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarDatos = useCallback(async () => {
        try {
            setLoading(true);
            
            const params = new URLSearchParams();
            if (filtroFacultad) params.append('facultad', filtroFacultad);
            if (ordenamiento) params.append('orden', ordenamiento);
            if (busqueda) params.append('busqueda', busqueda);
            
            const responseProyectos = await fetch(`http://localhost:8000/ranking?${params}`, {
                credentials: 'include'
            });
            
            if (responseProyectos.ok) {
                const dataProyectos = await responseProyectos.json();
                setProyectos(dataProyectos);
            } else {
                mostrarMensaje('Error al cargar proyectos', 'danger');
            }

            // Cargar facultades solo la primera vez
            if (facultades.length === 0) {
                const responseFacultades = await fetch('http://localhost:8000/ranking/facultades', {
                    credentials: 'include'
                });
                
                if (responseFacultades.ok) {
                    const dataFacultades = await responseFacultades.json();
                    setFacultades(dataFacultades);
                }
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            mostrarMensaje('Error al cargar los datos', 'danger');
        } finally {
            setLoading(false);
        }
    }, [filtroFacultad, ordenamiento, busqueda, facultades.length]);

    const cargarEstadisticas = async () => {
        try {
            const response = await fetch('http://localhost:8000/ranking/estadisticas', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setEstadisticas(data);
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
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
                const data = await response.json();
                mostrarMensaje(data.mensaje, 'success');
                cargarDatos();
                cargarEstadisticas();
            } else {
                const error = await response.json();
                mostrarMensaje(error.detail || 'Error al registrar voto', 'danger');
            }
        } catch (error) {
            console.error('Error votando:', error);
            mostrarMensaje('Error al registrar voto', 'danger');
        }
    };

    const mostrarDetalle = async (proyectoId) => {
        try {
            const response = await fetch(`http://localhost:8000/proyectos/${proyectoId}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setProyectoDetalle(data);
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error cargando detalle:', error);
        }
    };

    const mostrarMensaje = (texto, tipo) => {
        setMensaje(texto);
        setTipoMensaje(tipo);
        setTimeout(() => setMensaje(''), 4000);
    };

    const truncarTexto = (texto, longitud = 200) => {
        if (!texto) return 'Sin resumen disponible';
        return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto;
    };

    const getBadgeColorPosicion = (posicion) => {
        if (posicion === 1) return 'warning'; // Oro
        if (posicion === 2) return 'secondary'; // Plata
        if (posicion === 3) return 'dark'; // Bronce
        return 'primary';
    };

    const getPuntuacionColor = (puntuacion) => {
        if (puntuacion > 10) return 'success';
        if (puntuacion > 5) return 'info';
        if (puntuacion > 0) return 'primary';
        if (puntuacion === 0) return 'secondary';
        return 'danger';
    };

    const getCalificacionColor = (calificacion) => {
        if (calificacion >= 6.5) return 'success';
        if (calificacion >= 6.0) return 'warning';
        return 'secondary';
    };

    // Memoized filtered and sorted projects
    const proyectosFiltrados = useMemo(() => {
        return proyectos.filter(proyecto => {
            const matchesBusqueda = !busqueda || 
                proyecto.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                proyecto.creador_nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                proyecto.profesor_nombre.toLowerCase().includes(busqueda.toLowerCase());
            
            return matchesBusqueda;
        });
    }, [proyectos, busqueda]);

    const renderTooltip = (text) => (
        <Tooltip>{text}</Tooltip>
    );

    return (
        <Container fluid className="py-4" style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
            <Row>
                <Col>
                    {/* Header Mejorado */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="text-white mb-1">
                                🏆 Ranking de Proyectos
                            </h1>
                            <p className="text-muted mb-0">
                                Proyectos con calificación 6.0 o superior ordenados por votación
                            </p>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            {esProfesor && (
                                <Badge bg="success" className="p-2">
                                    👨‍🏫 Profesor - Puedes votar
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Controles de Filtrado y Búsqueda */}
                    <Row className="mb-4">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="text-white small">🔍 Buscar proyectos</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Buscar por título, creador o profesor..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    style={{ backgroundColor: '#2c2c2c', borderColor: '#555', color: 'white' }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="text-white small">🏫 Facultad</Form.Label>
                                <Form.Select 
                                    value={filtroFacultad} 
                                    onChange={(e) => setFiltroFacultad(e.target.value)}
                                    style={{ backgroundColor: '#2c2c2c', borderColor: '#555', color: 'white' }}
                                >
                                    <option value="">Todas las facultades</option>
                                    {facultades.map(facultad => (
                                        <option key={facultad} value={facultad}>{facultad}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="text-white small">📊 Ordenar por</Form.Label>
                                <Form.Select 
                                    value={ordenamiento}
                                    onChange={(e) => setOrdenamiento(e.target.value)}
                                    style={{ backgroundColor: '#2c2c2c', borderColor: '#555', color: 'white' }}
                                >
                                    <option value="puntuacion">Puntuación (votos)</option>
                                    <option value="calificacion">Calificación académica</option>
                                    <option value="votos">Total de votos</option>
                                    <option value="reciente">Más recientes</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Estadísticas Mejoradas */}
                    {estadisticas && (
                        <Row className="mb-4">
                            <Col md={3}>
                                <Card bg="dark" text="white" className="text-center border-primary">
                                    <Card.Body>
                                        <h4 className="text-primary">{estadisticas.total_proyectos_ranking}</h4>
                                        <small>📚 Proyectos en ranking</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card bg="dark" text="white" className="text-center border-success">
                                    <Card.Body>
                                        <h4 className="text-success">{estadisticas.total_votos}</h4>
                                        <small>🗳️ Total de votos</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card bg="dark" text="white" className="text-center border-warning">
                                    <Card.Body>
                                        <h4 className="text-warning">{estadisticas.promedio_calificacion}</h4>
                                        <small>⭐ Calificación promedio</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={3}>
                                <Card bg="dark" text="white" className="text-center border-info">
                                    <Card.Body>
                                        <h4 className="text-info">{proyectosFiltrados.length}</h4>
                                        <small>🔍 Proyectos mostrados</small>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}

                    {/* Mensajes */}
                    {mensaje && (
                        <Alert variant={tipoMensaje} className="mb-4" dismissible onClose={() => setMensaje('')}>
                            {mensaje}
                        </Alert>
                    )}

                    {/* Loading */}
                    {loading ? (
                        <div className="text-center text-white py-5">
                            <Spinner animation="border" role="status" className="me-2" />
                            <span>Cargando proyectos...</span>
                        </div>
                    ) : proyectosFiltrados.length === 0 ? (
                        <div className="text-center text-white py-5">
                            <h4>📭 No hay proyectos que coincidan</h4>
                            <p className="text-muted">
                                {busqueda ? 
                                    `No se encontraron proyectos con "${busqueda}"` :
                                    filtroFacultad 
                                        ? `No hay proyectos de la facultad "${filtroFacultad}" con calificación 6.0 o superior`
                                        : 'Los proyectos deben tener una calificación mínima de 6.0 para aparecer en el ranking'
                                }
                            </p>
                            {(busqueda || filtroFacultad) && (
                                <Button 
                                    variant="outline-primary" 
                                    onClick={() => {
                                        setBusqueda('');
                                        setFiltroFacultad('');
                                    }}
                                >
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    ) : (
                        /* Lista de proyectos mejorada */
                        <div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="text-white mb-0">
                                    📋 Mostrando {proyectosFiltrados.length} proyecto{proyectosFiltrados.length !== 1 ? 's' : ''}
                                </h5>
                                <div className="text-muted small">
                                    Ordenado por: <strong>{
                                        ordenamiento === 'puntuacion' ? 'Puntuación' :
                                        ordenamiento === 'calificacion' ? 'Calificación' :
                                        ordenamiento === 'votos' ? 'Total votos' : 'Más recientes'
                                    }</strong>
                                </div>
                            </div>

                            {proyectosFiltrados.map((proyecto) => (
                                <Card 
                                    key={proyecto.id} 
                                    className="mb-3 shadow-sm" 
                                    style={{ 
                                        backgroundColor: '#2c2c2c', 
                                        borderColor: proyecto.posicion <= 3 ? '#ffd700' : '#555',
                                        borderWidth: proyecto.posicion <= 3 ? '2px' : '1px'
                                    }}
                                >
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            {/* Votación mejorada */}
                                            <Col xs={1} className="text-center">
                                                {esProfesor ? (
                                                    <div className="d-flex flex-column align-items-center">
                                                        <OverlayTrigger
                                                            placement="right"
                                                            overlay={renderTooltip(proyecto.ya_vote && proyecto.mi_voto === true ? 'Ya votaste positivo' : 'Votar positivo')}
                                                        >
                                                            <Button
                                                                variant={proyecto.ya_vote && proyecto.mi_voto === true ? "success" : "outline-light"}
                                                                size="sm"
                                                                className="mb-1 px-2"
                                                                onClick={() => handleVoto(proyecto.id, true)}
                                                                style={{ fontSize: '16px', minWidth: '32px' }}
                                                            >
                                                                ▲
                                                            </Button>
                                                        </OverlayTrigger>
                                                        <div className={`fw-bold text-${getPuntuacionColor(proyecto.puntuacion_neta)} fs-6`}>
                                                            {proyecto.puntuacion_neta > 0 ? '+' : ''}{proyecto.puntuacion_neta}
                                                        </div>
                                                        <OverlayTrigger
                                                            placement="right"
                                                            overlay={renderTooltip(proyecto.ya_vote && proyecto.mi_voto === false ? 'Ya votaste negativo' : 'Votar negativo')}
                                                        >
                                                            <Button
                                                                variant={proyecto.ya_vote && proyecto.mi_voto === false ? "danger" : "outline-light"}
                                                                size="sm"
                                                                className="mt-1 px-2"
                                                                onClick={() => handleVoto(proyecto.id, false)}
                                                                style={{ fontSize: '16px', minWidth: '32px' }}
                                                            >
                                                                ▼
                                                            </Button>
                                                        </OverlayTrigger>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex flex-column align-items-center text-muted">
                                                        <div style={{ fontSize: '16px' }}>▲</div>
                                                        <div className={`fw-bold text-${getPuntuacionColor(proyecto.puntuacion_neta)}`}>
                                                            {proyecto.puntuacion_neta > 0 ? '+' : ''}{proyecto.puntuacion_neta}
                                                        </div>
                                                        <div style={{ fontSize: '16px' }}>▼</div>
                                                    </div>
                                                )}
                                            </Col>

                                            {/* Contenido del proyecto mejorado */}
                                            <Col xs={11}>
                                                <Row>
                                                    <Col md={8}>
                                                        <div className="d-flex align-items-center mb-2">
                                                            <Badge 
                                                                bg={getBadgeColorPosicion(proyecto.posicion)}
                                                                className="me-2 fs-6"
                                                            >
                                                                #{proyecto.posicion}
                                                                {proyecto.posicion === 1 && ' 🥇'}
                                                                {proyecto.posicion === 2 && ' 🥈'}
                                                                {proyecto.posicion === 3 && ' 🥉'}
                                                            </Badge>
                                                            <h5 className="text-white mb-0 flex-grow-1">
                                                                {proyecto.titulo}
                                                            </h5>
                                                            <Button
                                                                variant="outline-info"
                                                                size="sm"
                                                                onClick={() => mostrarDetalle(proyecto.id)}
                                                                className="ms-2"
                                                            >
                                                                👁️ Ver
                                                            </Button>
                                                        </div>
                                                        
                                                        <div className="mb-2">
                                                            <small className="text-muted">
                                                                <span className="me-3">
                                                                    <strong>👤 Creador:</strong> {proyecto.creador_nombre}
                                                                </span>
                                                                <span className="me-3">
                                                                    <strong>👨‍🏫 Profesor:</strong> {proyecto.profesor_nombre}
                                                                </span>
                                                                {proyecto.facultad && (
                                                                    <span>
                                                                        <strong>🏫 Facultad:</strong> {proyecto.facultad}
                                                                    </span>
                                                                )}
                                                            </small>
                                                        </div>

                                                        <p className="text-light mb-2">
                                                            {truncarTexto(proyecto.resumen)}
                                                        </p>

                                                        {/* Tags adicionales */}
                                                        <div className="d-flex flex-wrap gap-1 mb-2">
                                                            {proyecto.tags && proyecto.tags.map((tag, index) => (
                                                                <Badge key={index} bg="outline-secondary" className="small">
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </Col>

                                                    <Col md={4} className="text-end">
                                                        <div className="mb-2">
                                                            <Badge 
                                                                bg={getCalificacionColor(proyecto.calificacion_final)} 
                                                                className="me-1 fs-6"
                                                            >
                                                                ⭐ {proyecto.calificacion_final.toFixed(1)}
                                                            </Badge>
                                                        </div>
                                                        
                                                        <div className="small text-muted mb-2">
                                                            <div className="d-flex justify-content-between">
                                                                <span>👍 Positivos:</span>
                                                                <strong className="text-success">{proyecto.total_votos_positivos}</strong>
                                                            </div>
                                                            <div className="d-flex justify-content-between">
                                                                <span>👎 Negativos:</span>
                                                                <strong className="text-danger">{proyecto.total_votos_negativos}</strong>
                                                            </div>
                                                            <div className="d-flex justify-content-between border-top pt-1 mt-1">
                                                                <span>🗳️ Total:</span>
                                                                <strong>{proyecto.total_votos}</strong>
                                                            </div>
                                                        </div>

                                                        {proyecto.ya_vote && esProfesor && (
                                                            <div className="mt-2">
                                                                <Badge 
                                                                    bg={proyecto.mi_voto ? "success" : "danger"}
                                                                    className="small"
                                                                >
                                                                    Tu voto: {proyecto.mi_voto ? "👍 Positivo" : "👎 Negativo"}
                                                                </Badge>
                                                            </div>
                                                        )}

                                                        {/* Indicador de tendencia */}
                                                        {proyecto.tendencia && (
                                                            <div className="mt-2">
                                                                <Badge 
                                                                    bg={proyecto.tendencia === 'subiendo' ? 'success' : 
                                                                        proyecto.tendencia === 'bajando' ? 'danger' : 'secondary'}
                                                                    className="small"
                                                                >
                                                                    {proyecto.tendencia === 'subiendo' ? '📈 Subiendo' :
                                                                     proyecto.tendencia === 'bajando' ? '📉 Bajando' : '➡️ Estable'}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </Col>
            </Row>

            {/* Modal de Detalle del Proyecto */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ backgroundColor: '#2c2c2c', borderColor: '#555' }}>
                    <Modal.Title className="text-white">
                        {proyectoDetalle?.titulo}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#1a1a1a', color: 'white' }}>
                    {proyectoDetalle && (
                        <>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <strong>👤 Creador:</strong> {proyectoDetalle.creador_nombre}
                                </Col>
                                <Col md={6}>
                                    <strong>👨‍🏫 Profesor:</strong> {proyectoDetalle.profesor_nombre}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <strong>🏫 Facultad:</strong> {proyectoDetalle.facultad || 'No especificada'}
                                </Col>
                                <Col md={6}>
                                    <strong>⭐ Calificación:</strong> 
                                    <Badge bg={getCalificacionColor(proyectoDetalle.calificacion_final)} className="ms-2">
                                        {proyectoDetalle.calificacion_final?.toFixed(1)}
                                    </Badge>
                                </Col>
                            </Row>
                            <div className="mb-3">
                                <strong>📝 Resumen:</strong>
                                <p className="mt-2">{proyectoDetalle.resumen || 'Sin resumen disponible'}</p>
                            </div>
                            <div className="mb-3">
                                <strong>📋 Descripción:</strong>
                                <p className="mt-2">{proyectoDetalle.descripcion || 'Sin descripción disponible'}</p>
                            </div>
                            {proyectoDetalle.objetivos && (
                                <div className="mb-3">
                                    <strong>🎯 Objetivos:</strong>
                                    <p className="mt-2">{proyectoDetalle.objetivos}</p>
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#2c2c2c', borderColor: '#555' }}>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default RankingProyectos;