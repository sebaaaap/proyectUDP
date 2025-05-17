from pydantic import BaseModel
from datetime import date
from typing import Optional

class EvaluacionBase(BaseModel):
    id_proyecto: int
    id_prof: int
    puntaje: int
    comentarios: Optional[str]
    fecha_evaluacion: date
    ronda_evaluacion: int

class EvaluacionCreate(EvaluacionBase):
    pass

class EvaluacionOut(EvaluacionBase):
    id: int

    class Config:
        orm_mode = True
