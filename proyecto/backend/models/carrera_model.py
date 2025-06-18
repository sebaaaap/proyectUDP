from sqlalchemy import Column, Integer, String
from database.db import Base

class Carrera(Base):
    __tablename__ = "carreras"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    facultad = Column(String, nullable=False) 