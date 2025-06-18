from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.proyecto_model import Proyecto
from schemas.proyecto_schema import ProyectoCreate, EstadoProyectoDBEnum
from models.user_model import Usuario, RolEnum
from models.postulacion_model import Postulacion, EstadoPostulacionEnum
from helpers.jwtAuth import verificar_token

router = APIRouter()

# ruta para crear un proyecto
@router.post("/crear")
def crear_proyecto(proyecto_data: ProyectoCreate, usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db or usuario_db.rol != RolEnum.estudiante:
        raise HTTPException(status_code=403, detail="Solo los estudiantes pueden crear proyectos")

    nuevo_proyecto = Proyecto(
        **proyecto_data.dict(exclude={"profesor_id", "perfiles_requeridos"}),
        creador_id=usuario_db.id,
        profesor_id=proyecto_data.profesor_id,
        perfiles_requeridos=[p.dict() for p in proyecto_data.perfiles_requeridos]
    )
    db.add(nuevo_proyecto)
    db.commit()
    db.refresh(nuevo_proyecto)
    return {"mensaje": "Proyecto creado", "proyecto": nuevo_proyecto}

# ruta para postular a un proyecto esta vista hacer Q!!!!!!
@router.post("/{proyecto_id}/postular")
def postular(proyecto_id: int, usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["correo"]).first()
    if usuario_db.rol != RolEnum.estudiante:
        raise HTTPException(status_code=403, detail="Solo estudiantes pueden postular")

    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
    if not proyecto or proyecto.creador_id == usuario_db.id:
        raise HTTPException(status_code=403, detail="No puedes postular a tu propio proyecto")

    if db.query(Postulacion).filter_by(proyecto_id=proyecto_id, estudiante_id=usuario_db.id).first():
        raise HTTPException(status_code=400, detail="Ya postulaste")

    postulacion = Postulacion(proyecto_id=proyecto_id, estudiante_id=usuario_db.id, estado="pendiente")
    db.add(postulacion)
    db.commit()
    return {"mensaje": "Postulación enviada"}

# ruta para ver postulaciones
@router.get("/{proyecto_id}/postulaciones")
def ver_postulaciones(proyecto_id: int, usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["correo"]).first()
    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()

    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    if usuario_db.id != proyecto.creador_id and usuario_db.rol != RolEnum.estudiante:
        raise HTTPException(status_code=403, detail="Acceso denegado")

    postulaciones = db.query(Postulacion).filter_by(proyecto_id=proyecto_id).all()
    return postulaciones

# ruta para aceptar o rechazar postulaciones
@router.patch("/{proyecto_id}/estado")
def cambiar_estado(proyecto_id: int, estado: EstadoProyectoDBEnum, usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["correo"]).first()
    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()

    if proyecto.profesor_id != usuario_db.id:
        raise HTTPException(status_code=403, detail="No autorizado para modificar el estado")

    proyecto.estado = estado
    db.commit()
    return {"mensaje": f"Proyecto marcado como {estado}"}

# ruta para ver los participantes de un proyecto
@router.get("/{proyecto_id}/integrantes")
def ver_integrantes(proyecto_id: int, usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    proyecto = db.query(Proyecto).filter_by(id=proyecto_id).first()
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["correo"]).first()

    if usuario_db.id not in [proyecto.creador_id, proyecto.profesor_id]:
        raise HTTPException(status_code=403, detail="Acceso no autorizado")

    aceptados = db.query(Usuario).join(Postulacion).filter(
        Postulacion.proyecto_id == proyecto_id,
        Postulacion.estado == "aceptado"
    ).all()
    return aceptados

@router.get("/usuario")
def obtener_proyectos_usuario(usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Obtener proyectos donde el usuario es creador
    proyectos_creados = db.query(Proyecto).filter(Proyecto.creador_id == usuario_db.id).all()
    
    # Obtener proyectos donde el usuario está postulado y aceptado
    proyectos_postulados = (
        db.query(Proyecto)
        .join(Postulacion, Proyecto.id == Postulacion.proyecto_id)
        .filter(
            Postulacion.usuario_id == usuario_db.id,
            Postulacion.estado == EstadoPostulacionEnum.aceptado
        )
        .all()
    )

    # Combinar y eliminar duplicados
    todos_proyectos = list(set(proyectos_creados + proyectos_postulados))
    
    return todos_proyectos


