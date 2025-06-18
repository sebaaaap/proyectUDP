from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from models.carrera_model import Carrera

router = APIRouter()

@router.get("/carreras")
def get_carreras(db: Session = Depends(get_db)):
    """
    Obtiene la lista de todas las carreras disponibles
    """
    carreras = db.query(Carrera).all()
    return [
        {
            "id": carrera.id,
            "nombre": carrera.nombre,
            "facultad": carrera.facultad
        }
        for carrera in carreras
    ]

@router.get("/facultades")
def get_facultades(db: Session = Depends(get_db)):
    """
    Obtiene la lista de todas las facultades disponibles
    """
    # Obtener facultades únicas de la tabla de carreras
    facultades = db.query(Carrera.facultad).distinct().all()
    return [facultad[0] for facultad in facultades] 