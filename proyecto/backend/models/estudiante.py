from sqlalchemy import Column, Integer, String, Date, Array, JSON, Text
from sqlalchemy.orm import relationship
from database.db import Base

class Estudiante(Base):
    __tablename__ = "estudiantes"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    rut_estudiante = Column(String, nullable=False, unique=True)
    nombre1 = Column(String, nullable=False)
    nombre2 = Column(String, nullable=False)
    apellido1 = Column(String, nullable=False)
    apellido2 = Column(String, nullable=False)
    fecha_nacimiento = Column(Date)
    nacionalidad = Column(String)
    genero = Column(String)
    anio__ingreso = Column(Integer)
    telefono = Column(String)
    carrera = Column(String)
    facultad = Column(String)
    promedio_general = Column(float)
    semestre_actual = Column(String)
    experiencia = Column(JSON, nullable=True, default={}) 
    habilidades = Column(JSON)
    
 
    # Relaciones
    proyectos_creados = relationship("Proyecto", back_populates="creador")
    participaciones = relationship("Participacion", back_populates="alumno")
