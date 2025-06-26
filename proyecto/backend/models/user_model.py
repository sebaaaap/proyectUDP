from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy import Enum as SqlEnum
import enum
from database.db import Base

class RolEnum(enum.Enum):
    estudiante = "estudiante"
    profesor = "profesor"

class Usuario(Base):
    __tablename__ = "usuarios"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    apellido = Column(String)
    correo = Column(String, unique=True, index=True)
    rol = Column(SqlEnum(RolEnum), nullable=False)

    # Relaciones existentes
    proyectos_creados = relationship(
        "Proyecto",
        foreign_keys="Proyecto.creador_id",
        back_populates="creador"
    )

    proyectos_asignados = relationship(
        "Proyecto",
        foreign_keys="Proyecto.profesor_id",
        back_populates="profesor"
    )

    postulaciones = relationship("Postulacion", back_populates="estudiante")
    
    # Nueva relación con votos de ranking
    votos_ranking = relationship("VotoRanking", back_populates="profesor")

class Estudiante(Base):
    __tablename__ = "estudiantes"
    id = Column(Integer, ForeignKey("usuarios.id"), primary_key=True)
    carrera_id = Column(Integer, ForeignKey("carreras.id"))
    semestre_actual = Column(Integer)
    promedio_general = Column(Float)

    usuario = relationship("Usuario", backref="estudiante_info")

class Profesor(Base):
    __tablename__ = "profesores"
    id = Column(Integer, ForeignKey("usuarios.id"), primary_key=True)
    facultad = Column(String)

    usuario = relationship("Usuario", backref="profesor_info")