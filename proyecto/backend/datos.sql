INSERT INTO estudiantes (
    id, rut_estudiante, nombre1, nombre2, apellido1, apellido2,
    fecha_nacimiento, nacionalidad, genero, anio__ingreso,
    telefono, carrera, facultad, promedio_general,
    semestre_actual, experiencia, habilidades, email
) VALUES
(1, '12345678-9', 'Carlos', 'Eduardo', 'Pérez', 'González', '2000-05-15', 'Chilena', 'Masculino', 2019, 
 '912345678', 'Ingeniería Civil', 'Ingeniería', 5.6, '8vo', 
 '{"voluntariado": "Ayuda en campamentos", "tutorías": "Matemáticas"}', 
 '["Python", "SQL", "Comunicación"]', '1@mail.udp.cl'),  -- Email separado del array
(2, '98765432-1', 'María', 'José', 'López', 'Ramírez', '2001-08-22', 'Chilena', 'Femenino', 2020, 
 '923456789', 'Psicología', 'Ciencias Sociales', 6.1, '6to', 
 '{"prácticas": "Centro comunitario"}', 
 '["Empatía", "Escucha activa", "SPSS"]', '2@mail.udp.cl');  -- Email separado del array

-----
-- Datos para la tabla profesores (PostgreSQL)
INSERT INTO profesores (
    rut, 
    nombre1, 
    nombre2, 
    apellido1, 
    apellido2, 
    telefono, 
    facultad, 
    especialidad, 
    departamento,
    email
) VALUES
(
    '12345478-9', 
    'Juan', 
    'Carlos', 
    'Gómez', 
    'Pérez', 
    '+56987654321', 
    'Ingeniería', 
    'Inteligencia Artificial', 
    'Ciencias de la Computación',
    '3@mail.udp.cl'
),
(
    '23356789-0', 
    'María', 
    'Fernanda', 
    'López', 
    'Rodríguez', 
    '+56976543210', 
    'Ciencias', 
    'Bioquímica', 
    'Biología Molecular',
    '4@mail.udp.cl'
);

----

-- Datos para la tabla proyectos (PostgreSQL)
INSERT INTO proyectos (
    titulo, 
    descripcion, 
    problema, 
    objetivo_general, 
    area_conocimiento, 
    fecha_inicio, 
    fecha_fin, 
    estado, 
    presupuesto_asignado, 
    informacion_adicional, 
    objetivo_especificos, 
    id_prof, 
    id_estudiante_creador
) VALUES
(
    'Sistema Inteligente de Gestión Energética', 
    'Desarrollo de un sistema IoT para optimizar el consumo energético en campus universitario', 
    'Alto consumo energético sin monitorización en tiempo real', 
    'Reducir el consumo energético en un 20% mediante automatización', 
    'Ingeniería Energética', 
    '2023-02-01', 
    '2023-11-30', 
    'en_desarrollo', 
    7500.00, 
    '{
        "justificacion": "Costo energético representa el 30% del presupuesto operativo",
        "metodologia": "Prototipado rápido con sensores IoT",
        "impacto_academico": "Creará laboratorio vivo para estudiantes",
        "impacto_social": "Modelo replicable para otras instituciones",
        "perfil_profesor": "Experto en sistemas embebidos y eficiencia energética"
    }', 
    '{
        "1": "Instalar 50 sensores de consumo",
        "2": "Desarrollar algoritmo de optimización",
        "3": "Implementar panel de control"
    }', 
    1, 
    2
);
-----
-- Datos para la tabla archivos_proyecto (PostgreSQL)
INSERT INTO archivos_proyecto (
    id_proyecto, 
    nombre_archivo, 
    tipo_archivo, 
    url, 
    fecha_subida, 
    descripcion
) VALUES
(
    1, 
    'propuesta_inicial.pdf', 
    'application/pdf', 
    'https://storage.edu/proyectos/1/propuesta.pdf', 
    '2023-02-15 10:30:45', 
    'Documento de propuesta inicial del proyecto'
);
-------
-- Datos para la tabla cfg_equivalencias (PostgreSQL)
INSERT INTO cfg_equivalencias (
    id_proyecto,
    id_curso_equivalente,
    creditos,
    estado_aprobacion,
    fecha_aprobacion
) VALUES
(
    1,
    'ING-SW-202',
    5,
    'aprobado',
    '2023-03-15'
);
-----
-- Datos para la tabla evaluaciones (PostgreSQL)
INSERT INTO evaluaciones (
    id_proyecto,
    id_profesor,
    puntaje,
    comentarios,
    fecha_evaluacion
) VALUES
(
    1,  -- Proyecto: Sistema Inteligente de Gestión Energética
    2,  -- Profesor: María Fernanda López Rodríguez
    85,
    'Excelente planteamiento técnico, pero necesita mayor claridad en el plan de implementación',
    '2023-04-10'
);
----
-- Datos para la tabla participaciones (PostgreSQL)
INSERT INTO participaciones (
    id_proyecto,
    id_estudiante,
    rol,
    fecha_inicio,
    fecha_termino,
    estado_aprobacion
) VALUES
-- Proyecto 1 (Sistema Inteligente de Gestión Energética)
(
    1,
    1,
    'co_lider',
    '2023-02-01',
    '2023-11-30',
    'aprobado'
);