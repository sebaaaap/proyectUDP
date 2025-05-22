INSERT INTO estudiantes (
    id, rut_estudiante, nombre1, nombre2, apellido1, apellido2,
    fecha_nacimiento, nacionalidad, genero, anio__ingreso,
    telefono, carrera, facultad, promedio_general,
    semestre_actual, experiencia, habilidades, email, password
) VALUES
(1, '12345678-9', 'Carlos', 'Eduardo', 'Pérez', 'González', '2000-05-15', 'Chilena', 'Masculino', 2019, '912345678', 'Ingeniería Civil', 'Ingeniería', 5.6, '8vo', '{"voluntariado": "Ayuda en campamentos", "tutorías": "Matemáticas"}', '["Python", "SQL", "Comunicación", "1@mail.udp.cl", "123"]'),
(2, '98765432-1', 'María', 'José', 'López', 'Ramírez', '2001-08-22', 'Chilena', 'Femenino', 2020, '923456789', 'Psicología', 'Ciencias Sociales', 6.1, '6to', '{"prácticas": "Centro comunitario"}', '["Empatía", "Escucha activa", "SPSS","2@mail.udp.cl", "123"]'),
(3, '11223344-5', 'Andrés', 'Felipe', 'Rojas', 'Torres', '1999-11-30', 'Colombiana', 'Masculino', 2018, '934567890', 'Derecho', 'Derecho y Humanidades', 5.9, '10mo', '{"asistente de investigación": "Derecho penal"}', '["Redacción", "Investigación", "Oratoria", "3@mail.udp.cl", "123"]'),
(4, '55667788-0', 'Camila', 'Andrea', 'Martínez', 'Figueroa', '2002-01-10', 'Chilena', 'Femenino', 2021, '945678901', 'Arquitectura', 'Arquitectura y Diseño', 6.3, '4to', '{"talleres": "Diseño urbano"}', '["AutoCAD", "SketchUp", "Creatividad", "4@mail.udp.cl", "123"]'),
(5, '66778899-2', 'Felipe', 'Ignacio', 'Soto', 'Muñoz', '2000-03-27', 'Chilena', 'Masculino', 2019, '956789012', 'Periodismo', 'Comunicación', 5.4, '7mo', '{"medio universitario": "Editor"}', '["Escritura", "Edición", "Redes sociales", "5@mail.udp.cl", "123"]');

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
    departamento
) VALUES
(
    '12345678-9', 
    'Juan', 
    'Carlos', 
    'Gómez', 
    'Pérez', 
    '+56987654321', 
    'Ingeniería', 
    'Inteligencia Artificial', 
    'Ciencias de la Computación'
),
(
    '23456789-0', 
    'María', 
    'Fernanda', 
    'López', 
    'Rodríguez', 
    '+56976543210', 
    'Ciencias', 
    'Bioquímica', 
    'Biología Molecular'
),
(
    '34567890-1', 
    'Pedro', 
    'Alberto', 
    'Martínez', 
    'Silva', 
    '+56965432109', 
    'Medicina', 
    'Neurología', 
    'Ciencias Neurológicas'
),
(
    '45678901-2', 
    'Ana', 
    'María', 
    'Torres', 
    'García', 
    '+56954321098', 
    'Humanidades', 
    'Literatura Contemporánea', 
    'Lengua y Literatura'
),
(
    '56789012-3', 
    'Luis', 
    'Miguel', 
    'Hernández', 
    'Vargas', 
    '+56943210987', 
    'Arquitectura', 
    'Diseño Urbano', 
    'Urbanismo y Ordenamiento Territorial'
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
),
(
    'Plataforma de Aprendizaje Adaptativo', 
    'Sistema que personaliza contenidos educativos según progreso del estudiante', 
    'Enseñanza estandarizada no considera diferencias individuales', 
    'Mejorar resultados académicos mediante personalización', 
    'Educación', 
    '2023-04-15', 
    '2024-06-20', 
    'propuesto', 
    12000.00, 
    '{
        "justificacion": "Brecha de aprendizaje aumentó post-pandemia",
        "metodologia": "Diseño centrado en usuario + machine learning",
        "impacto_academico": "Mejorará indicadores de retención",
        "impacto_social": "Reducirá desigualdad en aprendizaje",
        "perfil_profesor": "Especialista en pedagogía y algoritmos adaptativos"
    }', 
    '{
        "1": "Modelar estilos de aprendizaje",
        "2": "Desarrollar motor de recomendación",
        "3": "Validar con 3 cursos piloto"
    }', 
    2, 
    3
),
(
    'Análisis Genómico de Cultivos Andinos', 
    'Investigación de marcadores genéticos para mejorar resistencia a sequía', 
    'Cambio climático afecta producción agrícola tradicional', 
    'Identificar variantes genéticas para resiliencia climática', 
    'Biotecnología', 
    '2022-09-10', 
    '2023-08-15', 
    'finalizado', 
    18000.50, 
    '{
        "justificacion": "Seguridad alimentaria en riesgo por cambio climático",
        "metodologia": "Secuenciación masiva + bioinformática",
        "impacto_academico": "Fortalecerá investigación en agrobiotecnología",
        "impacto_social": "Beneficiará a pequeños agricultores",
        "perfil_profesor": "Doctor en genómica vegetal"
    }', 
    '{
        "1": "Recolectar 50 muestras de variedades nativas",
        "2": "Secuenciar genomas completos",
        "3": "Analizar correlaciones genotipo-fenotipo"
    }', 
    3, 
    4
),
(
    'Realidad Virtual para Terapias de Fobia', 
    'Desarrollo de entornos inmersivos para tratamiento de fobias específicas', 
    'Terapias tradicionales tienen limitaciones de acceso y costo', 
    'Crear solución escalable para trastornos de ansiedad', 
    'Psicología Clínica', 
    '2023-03-01', 
    '2023-12-15', 
    'en_desarrollo', 
    9500.75, 
    '{
        "justificacion": "40% de pacientes con fobias no completan tratamiento",
        "metodologia": "Diseño iterativo con profesionales de salud mental",
        "impacto_academico": "Nuevo campo de investigación interdisciplinaria",
        "impacto_social": "Reducirá costos de tratamiento psicológico",
        "perfil_profesor": "Experto en psicología cognitiva y desarrollo VR"
    }', 
    '{
        "1": "Modelar 5 escenarios de fobias comunes",
        "2": "Implementar sistema de biofeedback",
        "3": "Validar con estudio clínico controlado"
    }', 
    4, 
    5
),
(
    'Blockchain para Gestión Académica', 
    'Sistema descentralizado para verificación automática de credenciales', 
    'Procesos manuales de verificación son lentos y propensos a fraude', 
    'Automatizar la emisión y verificación de títulos académicos', 
    'Tecnologías de Información', 
    '2023-01-10', 
    '2023-10-31', 
    'en_desarrollo', 
    15000.00, 
    '{
        "justificacion": "Aumento de fraudes en documentos académicos",
        "metodologia": "Desarrollo de smart contracts en Ethereum",
        "impacto_academico": "Posicionará a la universidad como innovadora",
        "impacto_social": "Transparencia en procesos académicos",
        "perfil_profesor": "Especialista en blockchain y criptografía"
    }', 
    '{
        "1": "Diseñar arquitectura de red permisada",
        "2": "Implementar módulo de emisión de diplomas",
        "3": "Integrar con sistema académico existente"
    }', 
    5, 
    1
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
),
(
    1, 
    'diagrama_arquitectura.png', 
    'image/png', 
    'https://storage.edu/proyectos/1/diagrama.png', 
    '2023-03-01 14:22:10', 
    'Diagrama de componentes del sistema'
),
(
    2, 
    'protocolo_investigacion.docx', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'https://storage.edu/proyectos/2/protocolo.docx', 
    '2023-04-20 09:15:33', 
    'Protocolo de investigación aprobado por comité'
),
(
    3, 
    'datos_muestras.csv', 
    'text/csv', 
    'https://storage.edu/proyectos/3/muestras.csv', 
    '2022-10-05 16:45:21', 
    'Dataset con resultados preliminares de laboratorio'
),
(
    4, 
    'demo_vr.mp4', 
    'video/mp4', 
    'https://storage.edu/proyectos/4/demo.mp4', 
    '2023-05-12 11:20:15', 
    'Video demostrativo del entorno de realidad virtual'
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
),
(
    1,
    'ING-DAT-301',
    3,
    'pendiente',
    NULL
),
(
    2,
    'BIO-401',
    4,
    'rechazado',
    '2023-04-20'
),
(
    3,
    'PSI-VR-101',
    6,
    'aprobado',
    '2023-01-10'
),
(
    4,
    'TIC-BLK-205',
    4,
    'aprobado',
    '2023-02-28'
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
),
(
    2,  -- Proyecto: Plataforma de Aprendizaje Adaptativo
    3,  -- Profesor: Pedro Alberto Martínez Silva
    92,
    'Innovadora propuesta con alto impacto educativo. Validar con pilotos antes de escalar',
    '2023-05-15'
),
(
    3,  -- Proyecto: Análisis Genómico de Cultivos Andinos
    4,  -- Profesor: Ana María Torres García
    78,
    'Metodología sólida pero ampliar muestra de estudio para mayor significancia estadística',
    '2022-11-20'
),
(
    4,  -- Proyecto: Realidad Virtual para Terapias de Fobia
    5,  -- Profesor: Luis Miguel Hernández Vargas
    88,
    'Enfoque interdisciplinario muy valioso. Considerar aspectos éticos en el uso de datos clínicos',
    '2023-06-05'
),
(
    1,  -- Proyecto: Sistema Inteligente de Gestión Energética
    1,  -- Profesor: Juan Carlos Gómez Pérez
    90,
    'Solución bien fundamentada técnicamente con clara aplicabilidad institucional',
    '2023-04-18'
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
    'lider',
    '2023-02-01',
    '2023-11-30',
    'aprobado'
),
(
    1,
    2,
    'co_lider',
    '2023-02-15',
    '2023-11-30',
    'aprobado'
),
(
    1,
    3,
    'colaborador',
    '2023-03-01',
    NULL,  -- Fecha término abierta
    'pendiente'
),

-- Proyecto 2 (Plataforma de Aprendizaje Adaptativo)
(
    2,
    4,
    'lider',
    '2023-04-15',
    '2024-06-20',
    'aprobado'
),
(
    2,
    5,
    'colaborador',
    '2023-05-01',
    '2024-06-20',
    'rechazado'
),

-- Proyecto 3 (Análisis Genómico de Cultivos Andinos)
(
    3,
    1,
    'co_lider',
    '2022-09-10',
    '2023-08-15',
    'aprobado'
),
(
    3,
    3,
    'colaborador',
    '2022-10-01',
    '2023-08-15',
    'aprobado'
),

-- Proyecto 4 (Realidad Virtual para Terapias de Fobia)
(
    4,
    2,
    'lider',
    '2023-03-01',
    '2023-12-15',
    'aprobado'
),
(
    4,
    4,
    'colaborador',
    '2023-04-01',
    NULL,  -- Fecha término abierta
    'pendiente'
),

-- Proyecto 5 (Blockchain para Gestión Académica)
(
    5,
    5,
    'lider',
    '2023-01-10',
    '2023-10-31',
    'aprobado'
);