from sqlalchemy import Column, Integer, ForeignKey, Date, Text
from database.db import Base

class Evaluacion(Base):
    __tablename__ = "evaluaciones"

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_proyecto = Column(Integer, ForeignKey("proyectos.id"))
    id_profesor = Column(Integer, ForeignKey("profesores.id"))
    puntaje = Column(Integer)
    comentarios = Column(Text)
    fecha_evaluacion = Column(Date)
    
