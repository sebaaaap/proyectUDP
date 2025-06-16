from pydantic import BaseModel
from enum import Enum

class RolEnum(str, Enum):
    estudiante = "estudiante"
    profesor = "profesor"

class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    correo: str
    rol: RolEnum

class UsuarioResponse(UsuarioBase):
    id: int

    class Config:
        orm_mode = True

class PerfilEstudiante(BaseModel):
    carrera_id: int
    semestre_actual: int
    promedio_general: float

class PerfilProfesor(BaseModel):
    facultad: str