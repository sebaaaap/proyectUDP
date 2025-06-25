// src/Paginas/RankingProyectos.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Spinner, Modal, Tooltip, OverlayTrigger, Navbar, Nav } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const RankingProyectos = () => {
    const [proyectos, setProyectos] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('success');
    const [proyectoDetalle, setProyectoDetalle] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();

    const esProfesor = user?.rol === 'profesor';

    useEffect(() => {
        cargarDatos();
        cargarEstadisticas();
    }, []);

    const cargarDatos = useCallback(async () => {
        try {
            setLoading(true);
            
            const responseProyectos = await fetch(`http://localhost:8000/ranking`, {
                credentials: 'include'
            });
            
            if (responseProyectos.ok) {
                const dataProyectos = await responseProyectos.json();
                setProyectos(dataProyectos);
            } else {
                mostrarMensaje('Error al cargar proyectos', 'danger');
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            mostrarMensaje('Error al cargar los datos', 'danger');
        } finally {
            setLoading(false);
        }
    }, []);

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

    const getRankIcon = (posicion) => {
        switch (posicion) {
            case 1:
                return <span style={{ color: '#ffd700', fontSize: '24px' }}>🏆</span>;
            case 2:
                return <span style={{ color: '#c0c0c0', fontSize: '24px' }}>🥈</span>;
            case 3:
                return <span style={{ color: '#cd7f32', fontSize: '24px' }}>🥉</span>;
            default:
                return (
                    <span style={{ 
                        width: '24px', 
                        height: '24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '14px', 
                        fontWeight: 'bold', 
                        color: '#6c757d' 
                    }}>
                        #{posicion}
                    </span>
                );
        }
    };

    const getCalificacionColor = (calificacion) => {
        if (calificacion >= 6.5) return 'success';
        if (calificacion >= 6.0) return 'warning';
        return 'secondary';
    };

    const filteredProyectos = useMemo(() => {
        return proyectos.filter(
            (proyecto) =>
                proyecto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                proyecto.creador_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (proyecto.profesor_nombre && proyecto.profesor_nombre.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [proyectos, searchTerm]);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: 'white' }}>
            {/* Header */}
            <div style={{ borderBottom: '1px solid #374151', backgroundColor: 'rgba(17, 24, 39, 0.5)', backdropFilter: 'blur(8px)' }}>
                <Container fluid className="py-4">
                    <Row>
                        <Col>
                            <div className="d-flex flex-column gap-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h1 className="mb-0" style={{ 
                                        fontSize: '2rem', 
                                        fontWeight: 'bold', 
                                        background: 'linear-gradient(to right, white, #9ca3af)', 
                                        WebkitBackgroundClip: 'text', 
                                        WebkitTextFillColor: 'transparent' 
                                    }}>
                                        Ranking Académico
                                    </h1>
                                    <Badge 
                                        style={{ 
                                            backgroundColor: 'transparent', 
                                            border: '1px solid #6b7280', 
                                            color: '#d1d5db' 
                                        }}
                                        className="p-2"
                                    >
                                        {filteredProyectos.length} Proyectos
                                    </Badge>
                                </div>

                                {/* Solo el buscador */}
                                <Row>
                                    <Col md={6}>
                                        <div style={{ position: 'relative', maxWidth: '400px' }}>
                                            <span style={{ 
                                                position: 'absolute', 
                                                left: '12px', 
                                                top: '50%', 
                                                transform: 'translateY(-50%)', 
                                                color: '#6b7280', 
                                                fontSize: '16px' 
                                            }}>
                                                🔍
                                            </span>
                                            <Form.Control
                                                type="text"
                                                placeholder="Buscar por nombre de proyecto o autor..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                style={{ 
                                                    paddingLeft: '40px', 
                                                    backgroundColor: '#374151', 
                                                    borderColor: '#4b5563', 
                                                    color: 'white' 
                                                }}
                                                className="form-control::placeholder"
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Mensaje Motivacional - Solo cuando hay proyectos */}
            {filteredProyectos.length > 0 && (
                <Container fluid className="py-3">
                    <div style={{ 
                        background: 'linear-gradient(to right, rgba(30, 58, 138, 0.5), rgba(91, 33, 182, 0.5))', 
                        border: '1px solid rgba(59, 130, 246, 0.5)', 
                        borderRadius: '8px', 
                        padding: '16px' 
                    }}>
                        <p className="text-center mb-0" style={{ color: '#bfdbfe', fontWeight: '500' }}>
                            Destaca por tu desempeño y obtén puntaje adicional en tu Curso de Formación General (CFG).
                        </p>
                    </div>
                </Container>
            )}

            <Container fluid className="py-4">
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
                ) : filteredProyectos.length === 0 ? (
                    <div className="text-center text-white py-5">
                        {proyectos.length === 0 ? (
                            // NUEVO MENSAJE MOTIVACIONAL CUANDO NO HAY PROYECTOS
                            <div className="py-5">
                                <div className="mx-auto" style={{ maxWidth: '600px' }}>
                                    {/* Ícono o ilustración */}
                                    <div className="mb-4" style={{ fontSize: '4rem' }}>
                                        🎯
                                    </div>
                                    
                                    {/* Mensaje principal */}
                                    <div className="mb-4" style={{ 
                                        color: '#d1d5db', 
                                        fontSize: '1.25rem', 
                                        lineHeight: '1.6',
                                        fontWeight: '300'
                                    }}>
                                        Destaca por tu desempeño y obtén puntaje adicional en tu Curso de Formación General (CFG).
                                    </div>
                                    
                                    {/* Mensaje secundario */}
                                    <div style={{ 
                                        color: '#60a5fa', 
                                        fontSize: '1rem', 
                                        fontWeight: '500',
                                        marginBottom: '2rem'
                                    }}>
                                        ¡Tu esfuerzo académico ahora tiene recompensa!
                                    </div>
                                    
                                    {/* Información adicional */}
                                    <div className="mt-4 p-4" style={{ 
                                        backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                                        borderRadius: '12px',
                                        border: '1px solid #374151'
                                    }}>
                                        <h6 className="text-white mb-3">¿Cómo funciona el ranking?</h6>
                                        <div className="text-left" style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                                            <div className="mb-2">• Los profesores votan por los mejores proyectos</div>
                                            <div className="mb-2">• Los proyectos se ordenan por puntuación</div>
                                            <div className="mb-2">• Los mejores obtienen puntaje adicional en CFG</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h4>No se encontraron proyectos</h4>
                                <p className="text-muted">No hay proyectos que coincidan con tu búsqueda</p>
                                <small className="text-muted">Intenta con otros términos de búsqueda</small>
                            </>
                        )}
                    </div>
                ) : (
                    /* Lista de proyectos */
                    <div>
                        {filteredProyectos.map((proyecto) => (
                            <Card 
                                key={proyecto.id} 
                                className="mb-3" 
                                style={{ 
                                    backgroundColor: '#111827', 
                                    border: '1px solid #374151',
                                    transition: 'border-color 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#4b5563'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#374151'}
                            >
                                <Card.Body className="p-4">
                                    <div className="d-flex gap-3">
                                        {/* Ranking Icon */}
                                        <div className="d-flex flex-column align-items-center" style={{ minWidth: '60px' }}>
                                            {getRankIcon(proyecto.posicion)}
                                            <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>
                                                #{proyecto.posicion}
                                            </div>
                                        </div>

                                        {/* Contenido del Proyecto */}
                                        <div className="flex-grow-1">
                                            <Row>
                                                <Col lg={8}>
                                                    <h5 className="text-white mb-2" style={{ lineHeight: '1.3' }}>
                                                        {proyecto.titulo}
                                                    </h5>

                                                    <div className="d-flex flex-wrap gap-3 mb-3" style={{ fontSize: '14px', color: '#9ca3af' }}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span>👤</span>
                                                            <span>{proyecto.creador_nombre}</span>
                                                        </div>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span>👨‍🏫</span>
                                                            <span>Prof: {proyecto.profesor_nombre}</span>
                                                        </div>
                                                        {proyecto.facultad && (
                                                            <div className="d-flex align-items-center gap-1">
                                                                <span>📚</span>
                                                                <span>{proyecto.facultad}</span>
                                                            </div>
                                                        )}
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span>📅</span>
                                                            <span>{new Date(proyecto.fecha_entrega || proyecto.fecha_creacion).toLocaleDateString("es-ES")}</span>
                                                        </div>
                                                        <div style={{ 
                                                            backgroundColor: 'rgba(34, 197, 94, 0.3)', 
                                                            padding: '2px 8px', 
                                                            borderRadius: '4px' 
                                                        }}>
                                                            <span style={{ color: '#4ade80', fontWeight: '600' }}>
                                                                Nota: {proyecto.calificacion_final?.toFixed(1)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-light mb-2" style={{ fontSize: '14px', lineHeight: '1.5' }}>
                                                        {truncarTexto(proyecto.resumen || proyecto.descripcion)}
                                                    </p>

                                                    <Button
                                                        variant="outline-info"
                                                        size="sm"
                                                        onClick={() => mostrarDetalle(proyecto.id)}
                                                        className="mt-2"
                                                    >
                                                        Ver detalles
                                                    </Button>
                                                </Col>

                                                {/* Sistema de Votación */}
                                                <Col lg={4} className="d-flex justify-content-end">
                                                    <div className="d-flex flex-column align-items-center" style={{ 
                                                        backgroundColor: '#374151', 
                                                        borderRadius: '8px', 
                                                        padding: '12px',
                                                        minWidth: '80px'
                                                    }}>
                                                        {esProfesor ? (
                                                            <>
                                                                <Button
                                                                    variant={proyecto.ya_vote && proyecto.mi_voto === true ? "success" : "outline-light"}
                                                                    size="sm"
                                                                    onClick={() => handleVoto(proyecto.id, true)}
                                                                    style={{ 
                                                                        fontSize: '12px', 
                                                                        padding: '4px 8px',
                                                                        minWidth: '50px',
                                                                        marginBottom: '4px'
                                                                    }}
                                                                    disabled={proyecto.ya_vote}
                                                                >
                                                                    {proyecto.ya_vote && proyecto.mi_voto === true ? "Votado" : "Votar"}
                                                                </Button>
                                                                <div className="text-white fw-bold" style={{ fontSize: '18px', minWidth: '2rem', textAlign: 'center' }}>
                                                                    {proyecto.puntuacion_neta > 0 ? '+' : ''}{proyecto.puntuacion_neta}
                                                                </div>
                                                                <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>
                                                                    {proyecto.total_votos} votos
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <div className="text-white fw-bold" style={{ fontSize: '18px', minWidth: '2rem', textAlign: 'center' }}>
                                                                    {proyecto.puntuacion_neta > 0 ? '+' : ''}{proyecto.puntuacion_neta}
                                                                </div>
                                                                <div className="text-muted" style={{ fontSize: '12px', marginTop: '4px' }}>
                                                                    {proyecto.total_votos} votos
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}
            </Container>

            {/* Modal de Detalle del Proyecto */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}>
                    <Modal.Title className="text-white">
                        {proyectoDetalle?.titulo}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#111827', color: 'white' }}>
                    {proyectoDetalle && (
                        <>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <strong>Creador:</strong> {proyectoDetalle.creador_nombre}
                                </Col>
                                <Col md={6}>
                                    <strong>Profesor:</strong> {proyectoDetalle.profesor_nombre}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <strong>Facultad:</strong> {proyectoDetalle.facultad || 'No especificada'}
                                </Col>
                                <Col md={6}>
                                    <strong>Calificación:</strong> 
                                    <Badge bg={getCalificacionColor(proyectoDetalle.calificacion_final)} className="ms-2">
                                        {proyectoDetalle.calificacion_final?.toFixed(1)}
                                    </Badge>
                                </Col>
                            </Row>
                            <div className="mb-3">
                                <strong>Resumen:</strong>
                                <p className="mt-2">{proyectoDetalle.resumen || 'Sin resumen disponible'}</p>
                            </div>
                            <div className="mb-3">
                                <strong>Descripción:</strong>
                                <p className="mt-2">{proyectoDetalle.descripcion || 'Sin descripción disponible'}</p>
                            </div>
                            {proyectoDetalle.objetivos && (
                                <div className="mb-3">
                                    <strong>Objetivos:</strong>
                                    <p className="mt-2">{proyectoDetalle.objetivos}</p>
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            <style jsx>{`
                .form-control::placeholder {
                    color: #6b7280 !important;
                }
                .navbar-nav .nav-link:hover {
                    color: #fbbf24 !important;
                }
            `}</style>
        </div>
    );
};

export default RankingProyectos;