#schemas
from pydantic import BaseModel
from datetime import date

class EstudianteBase(BaseModel):
    rut_estudiante: str
    nombres: str
    apellido1: str
    apellido2: str
    fecha_nacimiento: date | None = None
    nacionalidad: str | None = None
    genero: str | None = None
    anio_academico_ingreso: int | None = None
    periodo_academico_ingreso: int | None = None

class EstudianteOut(EstudianteBase):
    id_st: int

    class Config:
        orm_mode = True
