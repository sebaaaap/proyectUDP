# models/cfg_equivalencia.py
from sqlalchemy import Column, Integer, ForeignKey, Date, String, Enum
from database.db import Base
import enum


class EstadoCFGEnum(str, enum.Enum):
    pendiente = "pendiente"
    aprobado = "aprobado"
    rechazado = "rechazado"

class CFGEquivalencia(Base):
    __tablename__ = "cfg_equivalencias"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"))
    id_curso_equivalente = Column(String)  # plan de estudios o curso equivalente
    creditos = Column(Integer)
    estado_aprobacion = Column(Enum(EstadoCFGEnum))
    fecha_aprobacion = Column(Date)


