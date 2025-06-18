from database.db import Base
from sqlalchemy import Column, Integer, String

class Carrera(Base):
    __tablename__ = "carreras"
    id = Column(Integer, primary_key=True)
    nombre = Column(String, unique=True)
    facultad = Column(String)