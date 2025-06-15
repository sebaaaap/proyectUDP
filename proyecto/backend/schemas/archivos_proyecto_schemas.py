from pydantic import BaseModel
from datetime import datetime

class ArchivoProyectoResponse(BaseModel):
    id: int
    nombre_archivo: str
    tipo_archivo: str | None = None
    url: str
    fecha_subida: datetime
    descripcion: str | None = None
    id_estudiante: int


class Config:
    orm_mode = True
