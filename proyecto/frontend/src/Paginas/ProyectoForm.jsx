import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col, Card, ListGroup, InputGroup } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export function ProyectoForm() {
  const navigate = useNavigate();
  const alertRef = useRef(null);
  
  // Validación de RUT (exactamente 9 dígitos)
  const validateRUT = (rut) => {
    const cleanRut = rut.replace(/[^0-9kK]/g, '');
    return /^\d{9}$/.test(cleanRut);
  };

  // Validación de teléfono (+56 seguido de 9 dígitos)
  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s-()]/g, '');
    return /^\+56\d{9}$/.test(cleanPhone);
  };

  // Validación de correo UDP
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@mail\.udp\.cl$/;
    return regex.test(email);
  };

  // Lista de campos obligatorios
  const camposObligatorios = [
    'nombreCompleto',
    'rut',
    'correoUDP',
    'facultad',
    'carrera',
    'tituloProyecto',
    'resumenProyecto',
    'problema',
    'justificacion',
    'objetivoGeneral',
    'añoIngreso',
    'semestreActual',
    'promedioGeneral',
    'experiencia', 
    'metodologia', 
    'impactoAcademico', 
    'impactoSocial'
  ];

  const [formData, setFormData] = useState({
    // Información del estudiante
    nombreCompleto: '',
    rut: '',
    correoUDP: '',
    telefono: '+56',
    
    // Información académica
    facultad: '',
    carrera: '',
    añoIngreso: '',
    semestreActual: '',
    promedioGeneral: '',
    
    // Habilidades y experiencia
    habilidades: [],
    experiencia: '',
    
    // Descripción del proyecto
    tituloProyecto: '',
    resumenProyecto: '',
    problema: '',
    justificacion: '',
    
    // Objetivos
    objetivoGeneral: '',
    objetivosEspecificos: ['', '', '', '', ''],
    
    // Equipo de trabajo
    equipo: [{ carreraEspecialidad: '', cantidad: '', justificacion: '' }],
    trabajoIndividual: false,
    
    // Metodología y desarrollo
    metodologia: '',
    
    // Impacto y proyección
    impactoAcademico: '',
    impactoSocial: '',
    otrosImpactos: '',
    beneficiarios: '',
    proyeccionFutura: '',
    
    // Necesidades de supervisión
    perfilProfesor: '',
    areasExperiencia: '',
    facultadesSugeridas: '',
    comentariosSupervision: '',
    
    // Información adicional
    comentariosAdicionales: '',
    referencias: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Listado de facultades según lo solicitado
  const facultadesUDP = [
    "Facultad de Administración y Economía",
    "Facultad de Arquitectura, Arte y Diseño",
    "Facultad de Ciencias Sociales e Historia",
    "Facultad de Comunicación y Letras",
    "Facultad de Derecho",
    "Facultad de Educación",
    "Facultad de Ingeniería y Ciencias",
    "Facultad de Medicina",
    "Facultad de Psicología",
    "Facultad de Salud y Odontología",
    "Carreras Vespertinas",
    "Instituto de Filosofía"
  ];

  // Listado de carreras (ejemplo, puedes completarlo con las carreras reales de la UDP)
  const carrerasUDP = [
    "Administración Pública",
    "Antropología",
    "Arquitectura",
    "Artes Visuales",
    "Ciencia Política",
    "Cine y Realización Audiovisual",
    "Contador Auditor",
    "Contador Auditor – Contador Público",
    "Derecho",
    "Diseño",
    "Enfermería",
    "Ingeniería Civil en Informática y Telecomunicaciones",
    "Ingeniería Civil en Obras Civiles",
    "Ingeniería Civil Industrial",
    "Ingeniería Civil Plan Común",
    "Ingeniería Comercial",
    "Ingeniería en Administración de Empresas",
    "Ingeniería en Control de Gestión",
    "Ingeniería en Industria y Logística",
    "Ingeniería en Informática y Gestión",
    "Kinesiología",
    "Licenciatura en Historia",
    "Literatura Creativa",
    "Medicina",
    "Obstetricia y Neonatología",
    "Odontología",
    "Pedagogía en Educación Diferencial con mención en Desarrollo Cognitivo",
    "Pedagogía en Educación General Básica",
    "Pedagogía en Educación Parvularia",
    "Pedagogía en Historia y Ciencias Sociales",
    "Pedagogía en Inglés",
    "Pedagogía en Lengua Castellana y Comunicación",
    "Pedagogía Media en Matemática",
    "Periodismo",
    "Psicología",
    "Publicidad",
    "Sociología",
    "Tecnología Médica"
  ];

  const habilidades = [
    "Programación",
    "Diseño Gráfico",
    "Investigación",
    "Gestión de Proyectos",
    "Redacción Académica",
    "Comunicación",
    "Liderazgo",
    "Trabajo en equipo",
    "Análisis de datos",
    "Creatividad"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    const inputNumbers = e.target.value.replace(/\D/g, '');
    const limitedNumbers = inputNumbers.slice(0, 9);
    setFormData(prev => ({ 
      ...prev, 
      telefono: '+56' + limitedNumbers 
    }));
  };

  const handleObjetivoEspecificoChange = (index, value) => {
    const nuevosObjetivos = [...formData.objetivosEspecificos];
    nuevosObjetivos[index] = value;
    setFormData(prev => ({ ...prev, objetivosEspecificos: nuevosObjetivos }));
  };

  const handleEquipoChange = (index, field, value) => {
    const nuevoEquipo = [...formData.equipo];
    nuevoEquipo[index][field] = value;
    setFormData(prev => ({ ...prev, equipo: nuevoEquipo }));
  };

  const addEquipoMember = () => {
    setFormData(prev => ({
      ...prev,
      equipo: [...prev.equipo, { carreraEspecialidad: '', cantidad: '', justificacion: '' }]
    }));
  };

  const removeEquipoMember = (index) => {
    const nuevoEquipo = formData.equipo.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, equipo: nuevoEquipo }));
  };

  const handleCheckboxChange = (value) => {
    setFormData(prev => {
      const newArray = prev.habilidades.includes(value)
        ? prev.habilidades.filter(item => item !== value)
        : [...prev.habilidades, value];
      return { ...prev, habilidades: newArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Validar campos obligatorios
    const camposFaltantes = camposObligatorios.filter(campo => !formData[campo]);
    if (camposFaltantes.length > 0) {
      setError('Por favor completa todos los campos obligatorios');
      alertRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Validación de RUT
    if (!validateRUT(formData.rut)) {
      setError('El RUT debe tener exactamente 9 dígitos (sin puntos ni guión)');
      alertRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Validación de correo
    if (!validateEmail(formData.correoUDP)) {
      setError('Por favor ingresa un correo electrónico válido de la UDP (@mail.udp.cl)');
      alertRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Validación de teléfono (si se ingresó)
    if (formData.telefono && !validatePhone(formData.telefono)) {
      setError('El teléfono debe tener el formato +56 seguido de 9 dígitos');
      alertRef.current.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    try {
      console.log('Datos enviados:', formData);
      setSuccess(true);
      
      // Scroll al inicio para mostrar el mensaje de éxito
      alertRef.current.scrollIntoView({ behavior: 'smooth' });
      
      // Esperar 2 segundos antes de redirigir para que el usuario vea el mensaje
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Error al enviar el formulario');
      alertRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Container className="mt-5 mb-5" ref={alertRef}>
      <Row className="justify-content-center">
        <Col md={12} lg={10}>
          <Card className="shadow">
            <Card.Header className="text-white" style={{ backgroundColor: '#4f0000' }}>
              <h3 className="text-center">Formulario de Postulación de Proyecto Estudiantil</h3>
              <h5 className="text-center">Universidad Diego Portales</h5>
            </Card.Header>
            
            <Card.Body>
              {error && <Alert variant="danger"><FaExclamationTriangle /> {error}</Alert>}
              {success && <Alert variant="success"><FaCheckCircle /> ¡Formulario enviado con éxito!</Alert>}
              
              <Form onSubmit={handleSubmit}>
                {/* Sección 1: Información del estudiante */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>INFORMACIÓN DEL ESTUDIANTE</h5>
                  </Card.Header>
                  <Card.Body>
                    <h6 className="mb-3">DATOS PERSONALES</h6>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre completo *</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="nombreCompleto" 
                        value={formData.nombreCompleto} 
                        onChange={handleChange} 
                        required 
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>RUT * (sin puntos ni guión)</Form.Label>
                          <Form.Control 
                            type="text" 
                            name="rut" 
                            value={formData.rut} 
                            onChange={handleChange}
                            isInvalid={formData.rut && !validateRUT(formData.rut)}
                            required 
                            maxLength={9}
                            placeholder="123456789"
                          />
                          <Form.Control.Feedback type="invalid">
                            El RUT debe tener exactamente 9 dígitos (sin puntos ni guión)
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Teléfono de contacto</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>+56</InputGroup.Text>
                            <Form.Control
                              type="tel"
                              value={formData.telefono.substring(3)}
                              onChange={handlePhoneChange}
                              isInvalid={formData.telefono && !validatePhone(formData.telefono)}
                              placeholder="912345678"
                              maxLength={9}
                            />
                          </InputGroup>
                          <Form.Control.Feedback type="invalid">
                            Debe tener 9 dígitos después del +56
                          </Form.Control.Feedback>
                          <Form.Text muted>Ejemplo: 912345678</Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Correo electrónico UDP *</Form.Label>
                      <Form.Control 
                        type="email" 
                        name="correoUDP" 
                        value={formData.correoUDP} 
                        onChange={handleChange}
                        isInvalid={formData.correoUDP && !validateEmail(formData.correoUDP)}
                        required 
                      />
                      <Form.Control.Feedback type="invalid">
                        Por favor ingresa un correo válido de la UDP (@mail.udp.cl)
                      </Form.Control.Feedback>
                    </Form.Group>
                    
                    <h6 className="mb-3 mt-4">INFORMACIÓN ACADÉMICA</h6>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Facultad *</Form.Label>
                          <Form.Select 
                            name="facultad" 
                            value={formData.facultad} 
                            onChange={handleChange}
                            required
                          >
                            <option value="">Selecciona tu facultad</option>
                            {facultadesUDP.map((facultad, index) => (
                              <option key={index} value={facultad}>{facultad}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Carrera *</Form.Label>
                          <Form.Select 
                            name="carrera" 
                            value={formData.carrera} 
                            onChange={handleChange}
                            required
                          >
                            <option value="">Selecciona tu carrera</option>
                            {carrerasUDP.map((carrera, index) => (
                              <option key={index} value={carrera}>{carrera}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Año de ingreso *</Form.Label>
                          <Form.Control 
                            type="number" 
                            name="añoIngreso" 
                            value={formData.añoIngreso} 
                            onChange={handleChange} 
                            min="2000"
                            max={new Date().getFullYear()}
                            required 
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Semestre actual *</Form.Label>
                          <Form.Select
                            name="semestreActual" 
                            value={formData.semestreActual} 
                            onChange={handleChange} 
                            required
                          >
                            <option value="">Seleccionar</option>
                            <option value="1° Semestre">1° Semestre</option>
                            <option value="2° Semestre">2° Semestre</option>
                            <option value="3° Semestre">3° Semestre</option>
                            <option value="4° Semestre">4° Semestre</option>
                            <option value="5° Semestre">5° Semestre</option>
                            <option value="6° Semestre">6° Semestre</option>
                            <option value="7° Semestre">7° Semestre</option>
                            <option value="8° Semestre">8° Semestre</option>
                            <option value="9° Semestre">9° Semestre</option>
                            <option value="11° Semestre">11° Semestre</option>
                            <option value="12° Semestre">12° Semestre o superior</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label>Promedio general *</Form.Label>
                          <Form.Control 
                            type="number" 
                            step="0.01" 
                            min="1.0"
                            max="7.0"
                            name="promedioGeneral" 
                            value={formData.promedioGeneral} 
                            onChange={handleChange} 
                            required 
                          />
                          <Form.Text muted>Escala de 1.0 a 7.0</Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                {/* Resto de las secciones del formulario se mantienen igual */}
                {/* Sección 2: Habilidades y experiencia */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>HABILIDADES Y EXPERIENCIA</h5>
                  </Card.Header>
                  <Card.Body>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Resume brevemente tus principales habilidades y experiencias relevantes para este proyecto: *</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="experiencia" 
                        value={formData.experiencia} 
                        onChange={handleChange} 
                        required 
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
                
                {/* Sección 3: Descripción del proyecto */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>DESCRIPCIÓN DEL PROYECTO</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Título del proyecto *</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="tituloProyecto" 
                        value={formData.tituloProyecto} 
                        onChange={handleChange} 
                        required 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Resumen del proyecto (máx. 250 palabras) *</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4} 
                        name="resumenProyecto" 
                        value={formData.resumenProyecto} 
                        onChange={handleChange} 
                        maxLength={1500} 
                        required 
                      />
                      <Form.Text muted>{formData.resumenProyecto.length}/1500 caracteres</Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Problema o necesidad que busca resolver *</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="problema" 
                        value={formData.problema} 
                        onChange={handleChange} 
                        required 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Justificación (¿Por qué es importante este proyecto?) *</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="justificacion" 
                        value={formData.justificacion} 
                        onChange={handleChange} 
                        required 
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
                
                {/* Sección 4: Objetivos */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>OBJETIVOS</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Objetivo general *</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={2} 
                        name="objetivoGeneral" 
                        value={formData.objetivoGeneral} 
                        onChange={handleChange} 
                        required 
                      />
                    </Form.Group>
                    
                    <Form.Label>Objetivos específicos</Form.Label>
                    {formData.objetivosEspecificos.map((objetivo, index) => (
                      <Form.Group key={index} className="mb-3">
                        <div className="d-flex align-items-center">
                          <span className="me-2">{index + 1}.</span>
                          <Form.Control 
                            type="text" 
                            value={objetivo} 
                            onChange={(e) => handleObjetivoEspecificoChange(index, e.target.value)} 
                          />
                        </div>
                      </Form.Group>
                    ))}
                  </Card.Body>
                </Card>
                
                {/* Sección 5: Equipo de trabajo */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>EQUIPO DE TRABAJO</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Check 
                        type="checkbox"
                        id="trabajoIndividual"
                        label="Planeo desarrollar este proyecto de manera individual o solo con compañeros de mi misma carrera"
                        checked={formData.trabajoIndividual}
                        onChange={(e) => setFormData(prev => ({ ...prev, trabajoIndividual: e.target.checked }))}
                      />
                    </Form.Group>
                    
                    {!formData.trabajoIndividual && (
                      <>
                        <h6 className="mb-3">COMPOSICIÓN DEL EQUIPO</h6>
                        <p className="text-muted">Si tu proyecto requiere la colaboración de estudiantes de otras carreras o facultades, detalla el equipo que consideras necesario:</p>
                        
                        {formData.equipo.map((miembro, index) => (
                          <Card key={index} className="mb-3">
                            <Card.Body>
                              <Row>
                                <Col md={5}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Carrera/Especialidad</Form.Label>
                                    <Form.Control 
                                      type="text" 
                                      value={miembro.carreraEspecialidad}
                                      onChange={(e) => handleEquipoChange(index, 'carreraEspecialidad', e.target.value)}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={2}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Cantidad</Form.Label>
                                    <Form.Control 
                                      type="number" 
                                      value={miembro.cantidad}
                                      onChange={(e) => handleEquipoChange(index, 'cantidad', e.target.value)}
                                      min="1"
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={4}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>Justificación/Rol en el proyecto</Form.Label>
                                    <Form.Control 
                                      type="text" 
                                      value={miembro.justificacion}
                                      onChange={(e) => handleEquipoChange(index, 'justificacion', e.target.value)}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col md={1} className="d-flex align-items-end">
                                  <Button 
                                    variant="danger" 
                                    size="sm" 
                                    onClick={() => removeEquipoMember(index)}
                                    disabled={formData.equipo.length <= 1}
                                  >
                                    X
                                  </Button>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Card>
                        ))}
                        
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={addEquipoMember}
                        >
                          Añadir miembro al equipo
                        </Button>
                      </>
                    )}
                  </Card.Body>
                </Card>
                
                {/* Sección 6: Metodología y desarrollo */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>METODOLOGÍA Y DESARROLLO</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Metodología que se utilizará para el desarrollo del proyecto *</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4} 
                        name="metodologia" 
                        value={formData.metodologia} 
                        onChange={handleChange} 
                        required 
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
                
                {/* Sección 7: Impacto y proyección */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>IMPACTO Y PROYECCIÓN</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Impacto académico esperado *</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={2} 
                        name="impactoAcademico" 
                        value={formData.impactoAcademico} 
                        onChange={handleChange} 
                        required 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Impacto social esperado *</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={2} 
                        name="impactoSocial" 
                        value={formData.impactoSocial} 
                        onChange={handleChange} 
                        required 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Otros impactos (especificar)</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={2} 
                        name="otrosImpactos" 
                        value={formData.otrosImpactos} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>¿Quiénes serán los principales beneficiarios o usuarios de los resultados del proyecto?</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={2} 
                        name="beneficiarios" 
                        value={formData.beneficiarios} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>¿Cómo podría continuar o expandirse este proyecto más allá del semestre actual?</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={2} 
                        name="proyeccionFutura"   
                        value={formData.proyeccionFutura} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
                
                {/* Sección 8: Necesidades de supervisión */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>NECESIDADES DE SUPERVISIÓN</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Perfil ideal del profesor que podría guiar este proyecto</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={2} 
                        name="perfilProfesor" 
                        value={formData.perfilProfesor} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Áreas de experiencia deseables</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="areasExperiencia" 
                        value={formData.areasExperiencia} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Facultad(es) sugerida(s)</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="facultadesSugeridas" 
                        value={formData.facultadesSugeridas} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Comentarios adicionales sobre la supervisión</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={2} 
                        name="comentariosSupervision" 
                        value={formData.comentariosSupervision} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
                
                {/* Sección 9: Información adicional */}
                <Card className="mb-4">
                  <Card.Header className="bg-light">
                    <h5>INFORMACIÓN ADICIONAL</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-3">
                      <Form.Label>Cualquier información adicional que consideres relevante para la evaluación de tu propuesta</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="comentariosAdicionales" 
                        value={formData.comentariosAdicionales} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Referencias bibliográficas o fuentes que respaldan tu propuesta (si aplica)</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="referencias" 
                        value={formData.referencias} 
                        onChange={handleChange} 
                      />
                    </Form.Group>
                  </Card.Body>
                </Card>
                
                <div className="d-flex justify-content-between mt-4">
                  <Button variant="secondary" onClick={() => navigate('/')}>
                    Cancelar
                  </Button>
                  <Button variant="primary" type="submit">
                    Enviar postulación
                  </Button>
                </div>
              </Form>
            </Card.Body>
            
            <Card.Footer className="text-muted text-center">
              <small>Fecha de postulación: {new Date().toLocaleDateString()}</small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}