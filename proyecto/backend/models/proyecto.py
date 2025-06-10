from sqlalchemy import Column, Integer, String, Text, JSON, Date, Float  # Elimina el símbolo º
from sqlalchemy import Enum as SqlEnum  # Importa SqlEnum para el ENUM de SQL
from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
import enum  # Necesario para definir el Enum
from database.db import Base  

class EstadoProyectoDBEnum(enum.Enum):
    propuesto = "propuesto"
    en_desarrollo = "en_desarrollo"
    finalizado = "finalizado"

class Proyecto(Base):
    __tablename__ = "proyectos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String, nullable=False)
    descripcion = Column(Text)
    problema = Column(Text)
    objetivo_general = Column(Text) 
    area_conocimiento = Column(String)
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)
    estado = Column(SqlEnum(EstadoProyectoDBEnum, name="estado_proyecto_enum"), default=EstadoProyectoDBEnum.propuesto)
    presupuesto_asignado = Column(Float, nullable=True)
    informacion_adicional = Column(JSON, nullable=True, default={}) 
    objetivo_especificos = Column(JSON, nullable=True, default={}) 

    # Claves foráneas corregidas
    id_prof = Column(Integer, ForeignKey("profesores.id"))
    id_estudiante_creador = Column(Integer, ForeignKey("estudiantes.id"), nullable=True)  # Cambiado a Integer


    # Relaciones corregidas
    profesor = relationship("Profesor")
    creador = relationship("Estudiante", back_populates="proyectos_creados")  # Nueva relación
    
    archivos = relationship(
        "ArchivoProyecto", 
        back_populates="proyecto", 
        cascade="all, delete-orphan",
        overlaps="participacion,archivos"
    )
    
    participantes = relationship(
        "Participacion", 
        back_populates="proyecto_rel",
        cascade="all, delete-orphan"
    )
