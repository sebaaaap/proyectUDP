from sqlalchemy import Column, Integer, String, Date, JSON, Float
from sqlalchemy.orm import relationship
from database.db import Base

class Estudiante(Base):
    __tablename__ = "estudiantes"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    fecha_nacimiento = Column(Date)
    genero = Column(String)
    anio__ingreso = Column(Integer)
    carrera = Column(String)
    facultad = Column(String)
    promedio_general = Column(Float)
    semestre_actual = Column(String)
    experiencia = Column(JSON, nullable=True, default={}) 
    habilidades = Column(JSON)
    email = Column(String, nullable=False, unique=True)
    
    
    
 
    # Relaciones corregidas
    # Relación con Profesor (si cada estudiante tiene un profesor guía)
    proyectos = relationship("Proyecto", back_populates="creador")
    participaciones = relationship("Participacion", back_populates="alumno")