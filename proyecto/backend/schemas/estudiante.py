#schemas
from pydantic import BaseModel
from datetime import date
from typing import Optional, Dict, Any

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
    email: EmailStr

class EstudianteOut(EstudianteBase):
    id_st: int

    class Config:
        orm_mode = True

class EstudianteCreate(EstudianteBase):
    password: str

class EstudianteResponse(EstudianteBase):
    id: int

    class Config:
        from_attributes = True

class EstudianteLogin(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    estudiante: EstudianteResponse