from sqlalchemy import Column, Integer, String
from database.db import Base

class CorreoProfesor(Base):
    __tablename__ = "correo_profesores"

    id = Column(Integer, primary_key=True, autoincrement=True)
    correo = Column(String, unique=True, nullable=False)