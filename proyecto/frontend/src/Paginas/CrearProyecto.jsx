import React, { useState, useEffect } from "react";
import useAuth from "../auth/useAuth";
import axios from "axios";
import { Form, Button, Alert, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const CrearProyecto = ({ usuario }) => {
  const { loading } = useAuth(); // Ya se validó en App.jsx

  const [profesores, setProfesores] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [resumen, setResumen] = useState("");
  const [problema, setProblema] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [impacto, setImpacto] = useState("");
  const [perfiles, setPerfiles] = useState([{ carrera: "", cantidad: 1 }]);
  const [profesorId, setProfesorId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/profesores", { withCredentials: true })
      .then((res) => setProfesores(res.data))
      .catch((err) => console.error("Error al obtener profesores", err));

    axios.get("http://localhost:8000/carreras", { withCredentials: true })
      .then((res) => setCarreras(res.data))
      .catch((err) => console.error("Error al obtener carreras", err));
  }, []);

  const handlePerfilChange = (index, field, value) => {
    const nuevos = [...perfiles];
    nuevos[index][field] = value;
    setPerfiles(nuevos);
  };

  const agregarPerfil = () => {
    setPerfiles([...perfiles, { carrera: "", cantidad: 1 }]);
  };

  const removerPerfil = (index) => {
    if (perfiles.length > 1) {
      const nuevos = perfiles.filter((_, i) => i !== index);
      setPerfiles(nuevos);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validaciones básicas
    if (!titulo.trim()) {
      setError("El título del proyecto es obligatorio");
      return;
    }
    if (!descripcion.trim()) {
      setError("La descripción del proyecto es obligatoria");
      return;
    }
    if (!profesorId) {
      setError("Debes seleccionar un profesor");
      return;
    }

    try {
      const data = {
        titulo,
        descripcion,
        resumen,
        problema,
        justificacion,
        impacto,
        profesor_id: profesorId,
        perfiles_requeridos: perfiles,
      };

      await axios.post("http://localhost:8000/proyectos/crear", data, {
        withCredentials: true,
      });

      setSuccess(true);
      setMensaje("Proyecto creado exitosamente");
      
      // Limpiar formulario después de éxito
      setTimeout(() => {
        setTitulo("");
        setDescripcion("");
        setResumen("");
        setProblema("");
        setJustificacion("");
        setImpacto("");
        setProfesorId(null);
        setPerfiles([{ carrera: "", cantidad: 1 }]);
        setSuccess(false);
        setMensaje("");
      }, 3000);
    } catch (err) {
      console.error(err);
      setError("Error al crear el proyecto. Por favor, intenta nuevamente.");
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <Card className="shadow">
            <Card.Header className="text-white" style={{ backgroundColor: '#4f0000' }}>
              <h3 className="text-center">Crear Nuevo Proyecto</h3>
              <h5 className="text-center">Universidad Diego Portales</h5>
            </Card.Header>
            
            <Card.Body>
              {error && <Alert variant="danger"><FaExclamationTriangle /> {error}</Alert>}
              {success && <Alert variant="success"><FaCheckCircle /> {mensaje}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                {/* Sección 1: Información básica del proyecto */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>INFORMACIÓN BÁSICA DEL PROYECTO</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Título del proyecto *</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={titulo} 
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ingresa el título de tu proyecto"
                        required 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Descripción del proyecto *</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4} 
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Describe detalladamente tu proyecto"
                        required 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Resumen ejecutivo</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={resumen} 
                        onChange={(e) => setResumen(e.target.value)}
                        placeholder="Resumen breve del proyecto (máximo 200 palabras)"
                        maxLength={1200}
                      />
                      <Form.Text muted>{resumen.length}/1200 caracteres</Form.Text>
                    </Form.Group>
                  </Card.Body>
                </Card>

                {/* Sección 2: Problema y justificación */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>PROBLEMA Y JUSTIFICACIÓN</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Problema que busca resolver</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={problema} 
                        onChange={(e) => setProblema(e.target.value)}
                        placeholder="Describe el problema o necesidad que tu proyecto busca resolver"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Justificación</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={justificacion} 
                        onChange={(e) => setJustificacion(e.target.value)}
                        placeholder="¿Por qué es importante este proyecto?"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Impacto esperado</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={impacto} 
                        onChange={(e) => setImpacto(e.target.value)}
                        placeholder="Describe el impacto que esperas que tenga tu proyecto"
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>

                {/* Sección 3: Profesor supervisor */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>PROFESOR SUPERVISOR</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Selecciona un profesor supervisor *</Form.Label>
                      <Form.Select 
                        value={profesorId} 
                        onChange={(e) => setProfesorId(e.target.value)}
                        required
                      >
                        <option value="">Selecciona un profesor</option>
                        {profesores.map((prof) => (
                          <option key={prof.id} value={prof.id}>
                            {prof.nombre} {prof.apellido}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text muted>
                        El profesor seleccionado será responsable de supervisar el desarrollo del proyecto
                      </Form.Text>
                    </Form.Group>
                  </Card.Body>
                </Card>

                {/* Sección 4: Perfiles requeridos */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>PERFILES REQUERIDOS PARA EL EQUIPO</h5>
                  </Card.Header>
                  <Card.Body>
                    <p className="text-muted mb-3">
                      Define los perfiles de estudiantes que necesitas para tu equipo de trabajo:
                    </p>
                    
                    {perfiles.map((perfil, index) => (
                      <Card key={index} className="mb-3">
                        <Card.Body>
                          <Row>
                            <Col md={6}>
                              <Form.Group className="mb-3">
                                <Form.Label>Carrera/Especialidad</Form.Label>
                                <Form.Select
                                  value={perfil.carrera}
                                  onChange={(e) => handlePerfilChange(index, "carrera", e.target.value)}
                                >
                                  <option value="">Selecciona una carrera</option>
                                  {carreras.map((carrera) => (
                                    <option key={carrera.id} value={carrera.nombre}>
                                      {carrera.nombre}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={4}>
                              <Form.Group className="mb-3">
                                <Form.Label>Cantidad de estudiantes</Form.Label>
                                <Form.Control
                                  type="number"
                                  min="1"
                                  value={perfil.cantidad}
                                  onChange={(e) => handlePerfilChange(index, "cantidad", e.target.value)}
                                  placeholder="1"
                                />
                              </Form.Group>
                            </Col>
                            <Col md={2} className="d-flex align-items-end">
                              <Button 
                                variant="danger" 
                                size="sm" 
                                onClick={() => removerPerfil(index)}
                                disabled={perfiles.length <= 1}
                              >
                                Eliminar
                              </Button>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                    
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={agregarPerfil}
                    >
                      + Agregar otro perfil
                    </Button>
                  </Card.Body>
                </Card>

                <div className="d-flex justify-content-between mt-4">
                  <Button variant="secondary" onClick={() => window.history.back()}>
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit">
                    Crear Proyecto
                  </Button>
                </div>
              </Form>
            </Card.Body>
            
            <Card.Footer className="text-muted text-center">
              <small>Fecha de creación: {new Date().toLocaleDateString()}</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CrearProyecto;