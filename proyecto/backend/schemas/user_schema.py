from pydantic import BaseModel
from enum import Enum

class RolEnum(str, Enum):
    estudiante = "estudiante"
    profesor = "profesor"

class UsuarioBase(BaseModel):
    nombre: str
    apellido: str
    email: str
    rol_plataforma: RolEnum

class UsuarioResponse(UsuarioBase):
    id: int

    class Config:
        orm_mode = True
