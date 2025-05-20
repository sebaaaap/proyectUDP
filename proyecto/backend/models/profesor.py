from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import *
from database.db import Base

class Profesor(Base):
    __tablename__ = "profesores"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    rut = Column(String, unique=True, nullable=False)
    nombre1 = Column(String)
    nombre2 = Column(String)
    apellido1 = Column(String)
    apellido2 = Column(String)
    telefono = Column(String)
    facultad = Column(String)
    especialidad = Column(String)
    departamento = Column(String)

    proyecto = relationship("Proyecto", back_populates="profesor")
    # evaluacion = relationship("Evaluacion", back_populates="profesor")