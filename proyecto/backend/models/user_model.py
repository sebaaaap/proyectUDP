from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String
from ..database.db import Base
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
    correo = Column(String, unique=True, index=True)
    rol = Column(SqlEnum(RolEnum), nullable=False)

    proyectos = relationship("Proyecto", back_populates="creador")
    postulaciones = relationship("Postulacion", back_populates="estudiante")