from sqlalchemy import Column, Integer, String, Text, Date, Float, Enum as SqlEnum, ForeignKey
from sqlalchemy.orm import relationship
from database.db import Base
import enum

class EstadoProyectoDBEnum(enum.Enum):
    propuesto = "propuesto"
    en_desarrollo = "en_desarrollo"
    finalizado = "finalizado"

class Proyecto(Base):
    __tablename__ = "proyectos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    titulo = Column(String, nullable=False)
    descripcion = Column(Text)
    area_conocimiento = Column(String)
    facultad_relacionada = Column(String)
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)
    estado = Column(SqlEnum(EstadoProyectoDBEnum, name="estado_proyecto_enum"), default=EstadoProyectoDBEnum.propuesto)
    presupuesto_asignado = Column(Float, nullable=True)

    # Claves foráneas corregidas
    id_prof = Column(Integer, ForeignKey("profesores.id"))
    id_estudiante_creador = Column(Integer, ForeignKey("estudiantes.id"), nullable=True)  # Cambiado a Integer


    # Relaciones corregidas
    profesor = relationship("Profesor")
    creador = relationship("Estudiante", back_populates="proyectos_creados")  # Nueva relación
    archivos = relationship("ArchivoProyecto", back_populates="proyecto", cascade="all, delete-orphan")
