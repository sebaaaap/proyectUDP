from fastapi import APIRouter, Depends
from pydantic.class_validators import List
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..models.carreras_model import Carrera
from ..models.user_model import Usuario, RolEnum


router = APIRouter()

@router.get("/carreras")
def obtener_carreras(db: Session = Depends(get_db)):
    carreras = db.query(Carrera).all()
    return [{"id": c.id, "nombre": c.nombre, "facultad": c.facultad} for c in carreras]

@router.get("/profesores")
def obtener_profesores(db: Session = Depends(get_db)):
    profesores = db.query(Usuario).filter(Usuario.rol == RolEnum.profesor).all()
    return [{"id": prof.id, "nombre": f"{prof.nombre} {prof.apellido}", "correo": prof.correo} for prof in profesores]

@router.get("/facultades", response_model=List[str])
def obtener_facultades(db: Session = Depends(get_db)):
    facultades = db.query(Carrera.facultad).distinct().all()
    return [f[0] for f in facultades]