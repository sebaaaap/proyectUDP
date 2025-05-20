from sqlalchemy import Column, Integer, String, Date, JSON, Float
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
    promedio_general = Column(Float)
    semestre_actual = Column(String)
    experiencia = Column(JSON, nullable=True, default={}) 
    habilidades = Column(JSON)
    
 
    # Relaciones corregidas
    # Relación con Profesor (si cada estudiante tiene un profesor guía)
    proyectos = relationship("Proyecto", back_populates="creador")
    