from sqlalchemy.orm import relationship
from sqlalchemy import Column, ForeignKey, Integer, String
from database.db import Base
from sqlalchemy import Enum as SqlEnum
import enum

class RolEnum(enum.Enum):
    estudiante = "estudiante"
    profesor = "profesor"

class Usuario(Base):
    __tablename__ = "usuarios"
    __table_args__ = {"extend_existing": True}
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    apellido = Column(String)
    email = Column(String, unique=True, index=True)
    rol_plataforma = Column(SqlEnum(RolEnum), nullable=False)
    
    estudiante_id = Column(Integer, ForeignKey("estudiantes.id"), nullable=True)
    profesor_id = Column(Integer, ForeignKey("profesores.id"), nullable=True)

    estudiante = relationship("Estudiante", backref="usuario", uselist=False)
    profesor = relationship("Profesor", backref="usuario", uselist=False)

    # proyectos = relationship("Proyecto", back_populates="creador")
    # postulaciones = relationship("Postulacion", back_populates="estudiante")