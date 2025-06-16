from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.db import get_db
from ..models.proyecto_model import Proyecto
from ..schemas.proyecto_schema import ProyectoCreate
from ..models.user_model import Usuario, RolEnum
from ..models.postulacion_model import Postulacion, EstadoPostulacionEnum
from ..helpers.jwtAuth import verificar_token

router = APIRouter()

# ruta para crear un proyecto
@router.post("/crear")
def crear_proyecto(
    proyecto_data: ProyectoCreate,
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    # Buscar usuario(id) en DB
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["correo"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    nuevo_proyecto = Proyecto(
        **proyecto_data.dict(),
        usuario_id=usuario_db.id  # Asociar al creador
    )

    db.add(nuevo_proyecto)
    db.commit()
    db.refresh(nuevo_proyecto)
    return {"mensaje": "Proyecto creado exitosamente"}

# ruta para postular a un proyecto
@router.post("/{proyecto_id}/postular")
def postular_a_proyecto(
    proyecto_id: int,
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["correo"]).first()

    if usuario_db.rol != RolEnum.estudiante:
        raise HTTPException(status_code=403, detail="Solo los estudiantes pueden postular a proyectos")

    postulacion_existente = db.query(Postulacion).filter_by(
        usuario_id=usuario_db.id, proyecto_id=proyecto_id
    ).first()

    if postulacion_existente:
        raise HTTPException(status_code=400, detail="Ya postulaste a este proyecto")

    nueva = Postulacion(usuario_id=usuario_db.id, proyecto_id=proyecto_id)
    db.add(nueva)
    db.commit()
    return {"mensaje": "Postulación enviada"}

# ruta para ver postulaciones
@router.get("/{proyecto_id}/postulaciones")
def ver_postulaciones(
    proyecto_id: int,
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["correo"]).first()

    proyecto = db.query(Proyecto).filter_by(id=proyecto_id, usuario_id=usuario_db.id).first()
    if not proyecto:
        raise HTTPException(status_code=403, detail="No eres el creador del proyecto")

    postulaciones = db.query(Postulacion).filter_by(proyecto_id=proyecto_id).all()
    return postulaciones

# ruta para aceptar o rechazar postulaciones
@router.put("/postulaciones/{postulacion_id}")
def actualizar_estado_postulacion(
    postulacion_id: int,
    nuevo_estado: EstadoPostulacionEnum,
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["correo"]).first()
    postulacion = db.query(Postulacion).get(postulacion_id)

    proyecto = db.query(Proyecto).filter_by(id=postulacion.proyecto_id).first()
    if proyecto.usuario_id != usuario_db.id:
        raise HTTPException(status_code=403, detail="No eres el creador del proyecto")

    postulacion.estado = nuevo_estado
    db.commit()
    return {"mensaje": f"Postulación {nuevo_estado.value}"}

# ruta para ver los participantes de un proyecto
@router.get("/{proyecto_id}/participantes")
def ver_participantes(
    proyecto_id: int,
    db: Session = Depends(get_db)
):
    postulaciones = db.query(Postulacion).filter_by(
        proyecto_id=proyecto_id,
        estado=EstadoPostulacionEnum.aceptado
    ).all()

    return [{"id": p.estudiante.id, "nombre": p.estudiante.nombre, "correo": p.estudiante.correo}
            for p in postulaciones]
