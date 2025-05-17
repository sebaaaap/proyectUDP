from pydantic import BaseModel

class ProfesorBase(BaseModel):
    rut: str
    nombre1: str
    nombre2: str
    apellido1: str
    apellido2: str
    email: str
    facultad: str
    departamento: str

class ProfesorCreate(ProfesorBase):
    pass

class ProfesorOut(ProfesorBase):
    id: int

    class Config:
        orm_mode = True