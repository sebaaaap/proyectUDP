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
