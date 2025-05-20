from fastapi import APIRouter, HTTPException
from models.evaluacion import Evaluacion           
from models.proyecto import Proyecto
from models.estudiante import Estudiante
from schemas.evaluacion import EvaluacionCreate
from database.db import SessionLocal
from utils.notificacion import enviar_correo
from sqlalchemy.orm import joinedload
from datetime import datetime

router = APIRouter()

@router.post("/evaluaciones/")
def evaluar_proyecto(evaluacion: EvaluacionCreate):
    db = SessionLocal()
    try:
        nueva_eval = Evaluacion(
            id_proyecto=evaluacion.id_proyecto,
            id_profesor=evaluacion.id_profesor,
            puntaje=evaluacion.puntaje,
            comentarios=evaluacion.comentarios,
            fecha_evaluacion=datetime.now()
        )
        db.add(nueva_eval)
        db.commit()

        # Obtener correo del estudiante que creó el proyecto
        proyecto = db.query(Proyecto).options(joinedload(Proyecto.estudiante)).filter_by(id=evaluacion.id_proyecto).first()
        if not proyecto or not proyecto.estudiante:
            raise HTTPException(status_code=404, detail="Proyecto o estudiante no encontrado")

        destinatario = proyecto.estudiante.correo
        asunto = "Resultado de evaluación de tu proyecto"
        cuerpo = f"""Tu proyecto ha sido evaluado.
        
        Puntaje: {evaluacion.puntaje}
        Comentarios: {evaluacion.comentarios}"""
        
        enviar_correo(destinatario, asunto, cuerpo)

        return {"mensaje": "Evaluación registrada y notificación enviada"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()