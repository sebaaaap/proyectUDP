from fastapi import APIRouter, Depends, HTTPException, Body, Request
from sqlalchemy.orm import Session
from database.db import get_db
from models.proyecto_model import Proyecto, EstadoProyectoDBEnum
from schemas.proyecto_schema import ProyectoCreate
from models.user_model import Usuario, RolEnum, Estudiante
from models.postulacion_model import Postulacion, EstadoPostulacionEnum
from models.ranking_model import ProyectoRanking
from helpers.jwtAuth import verificar_token
from schemas.postulacion_schema import PostulacionCreate
from pydantic import BaseModel
from typing import List
from services.notificacion_service import notificacion_service
import logging
from models.carreras_model import Carrera

logger = logging.getLogger(__name__)

router = APIRouter()
profesor_router = APIRouter()  # Router separado para profesores

# Modelo Pydantic para la calificación
class CalificacionRequest(BaseModel):
    calificacion: float

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
def postular(proyecto_id: int, datos: PostulacionCreate = Body(...), usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db or usuario_db.rol != RolEnum.estudiante:
        raise HTTPException(status_code=403, detail="Solo estudiantes pueden postular")

    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    if proyecto.creador_id == usuario_db.id:
        raise HTTPException(status_code=403, detail="No puedes postular a tu propio proyecto")

    postulacion_existente = db.query(Postulacion).filter_by(proyecto_id=proyecto_id, usuario_id=usuario_db.id).first()
    if postulacion_existente:
        raise HTTPException(status_code=400, detail="Ya postulaste")

    postulacion = Postulacion(
        proyecto_id=proyecto_id,
        usuario_id=usuario_db.id,
        estado=EstadoPostulacionEnum.pendiente,
        motivacion=datos.motivacion
    )
    db.add(postulacion)
    db.commit()

    # Después de db.commit() y antes del return
    # Notificar al creador del proyecto sobre la nueva postulación
    try:
        creador = db.query(Usuario).filter(Usuario.id == proyecto.creador_id).first()
        if creador:
            notificacion_service.notificar_nueva_postulacion_al_creador(
                creador_email=creador.correo,
                creador_nombre=f"{creador.nombre} {creador.apellido}",
                titulo_proyecto=proyecto.titulo,
                postulante_nombre=f"{usuario_db.nombre} {usuario_db.apellido}",
                motivacion=datos.motivacion
            )
    except Exception as e:
        logger.error(f"Error enviando notificación de nueva postulación: {e}")

    return {"mensaje": "Postulación enviada"}

# ruta para ver postulaciones
@router.get("/{proyecto_id}/postulaciones")
def ver_postulaciones(proyecto_id: int, usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    if usuario_db.id != proyecto.creador_id and usuario_db.rol != RolEnum.estudiante:
        raise HTTPException(status_code=403, detail="Acceso denegado")

    postulaciones = db.query(Postulacion).filter_by(proyecto_id=proyecto_id).all()
    resultado = []
    for p in postulaciones:
        usuario_postulante = db.query(Usuario).filter(Usuario.id == p.usuario_id).first()
        estudiante = db.query(Estudiante).filter(Estudiante.id == p.usuario_id).first()
        carrera_nombre = ""
        if estudiante and getattr(estudiante, 'carrera_id', None):
            carrera = db.query(Carrera).filter(Carrera.id == estudiante.carrera_id).first()
            carrera_nombre = carrera.nombre if carrera else ""
        resultado.append({
            "id": p.id,
            "nombre": f"{usuario_postulante.nombre} {usuario_postulante.apellido}" if usuario_postulante else "",
            "correo": usuario_postulante.correo if usuario_postulante else "",
            "carrera": carrera_nombre,
            "promedio_general": estudiante.promedio_general if estudiante else None,
            "motivacion": p.motivacion,
            "estado": p.estado.value
        })
    return resultado

# Endpoint de prueba
@router.get("/test")
def test_endpoint():
    return {"mensaje": "Endpoint de prueba funcionando"}

# Endpoint de prueba simple
@router.get("/test-simple")
def test_simple():
    return {"mensaje": "Endpoint simple funcionando"}

# NUEVO: Endpoint para que el profesor vea todas las postulaciones de sus proyectos
@profesor_router.get("/postulaciones")
def obtener_postulaciones_profesor(request: Request, db: Session = Depends(get_db)):
    # 1. Decodificar el token
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token requerido")
    token = auth_header.split(" ")[1]
    try:
        from jose import jwt
        import os
        SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
        ALGORITHM = os.getenv("ALGORITHM", "HS256")
        usuario = jwt.decode(token, SECRET_KEY, ALGORITHM)
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido")

    # 2. Buscar al profesor en la base de datos
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db or usuario_db.rol != RolEnum.profesor:
        raise HTTPException(status_code=403, detail="Solo los profesores pueden acceder a este endpoint")

    # 3. Obtener todos los proyectos donde el usuario es profesor
    proyectos_profesor = db.query(Proyecto).filter(Proyecto.profesor_id == usuario_db.id).all()
    proyecto_ids = [p.id for p in proyectos_profesor]
    if not proyecto_ids:
        return []

    # 4. Obtener todas las postulaciones de esos proyectos con info del estudiante y proyecto
    postulaciones = db.query(Postulacion, Usuario, Proyecto).join(
        Usuario, Postulacion.usuario_id == Usuario.id
    ).join(
        Proyecto, Postulacion.proyecto_id == Proyecto.id
    ).filter(Postulacion.proyecto_id.in_(proyecto_ids)).all()

    resultado = []
    for postulacion, estudiante, proyecto in postulaciones:
        resultado.append({
            "id": postulacion.id,
            "estudiante": f"{estudiante.nombre} {estudiante.apellido}",
            "email": estudiante.correo,
            "carrera": "Ingeniería Civil Informática",  # Puedes mejorar esto si tienes la carrera en la tabla
            "proyecto": proyecto.titulo,
            "fecha": postulacion.fecha_postulacion.strftime("%Y-%m-%d"),
            "estado": postulacion.estado.value,
            "descripcion": proyecto.descripcion,
            "motivacion": postulacion.motivacion,
            "comentario": None  # Si tienes campo comentario, agrégalo aquí
        })
    return resultado

# NUEVO: Endpoint para que el profesor apruebe o rechace una postulación
@router.patch("/postulaciones/{postulacion_id}/estado")
def cambiar_estado_postulacion(
    postulacion_id: int, 
    request: Request,
    datos: dict = Body(...),
    db: Session = Depends(get_db)
):
    estado = datos.get("estado")
    comentario = datos.get("comentario", "")
    
    if not estado:
        raise HTTPException(status_code=400, detail="Estado es requerido")
    
    try:
        estado_enum = EstadoPostulacionEnum(estado)
    except ValueError:
        raise HTTPException(status_code=400, detail="Estado inválido")
    
    # Verificar token manualmente - primero en cookies, luego en Authorization header
    token = request.cookies.get("access_token")
    
    # Si no hay token en cookies, buscar en Authorization header
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")

    try:
        from jose import jwt
        import os
        SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
        ALGORITHM = os.getenv("ALGORITHM", "HS256")
        usuario = jwt.decode(token, SECRET_KEY, ALGORITHM)
    except Exception as e:
        print(f"DEBUG: Error decodificando token: {e}")  # Debug log
        raise HTTPException(status_code=401, detail="Token inválido")
    
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    
    if not usuario_db or usuario_db.rol != RolEnum.profesor:
        raise HTTPException(status_code=403, detail="Solo los profesores pueden cambiar el estado de postulaciones")
    
    # Obtener la postulación
    postulacion = db.query(Postulacion).filter(Postulacion.id == postulacion_id).first()
    if not postulacion:
        raise HTTPException(status_code=404, detail="Postulación no encontrada")
    
    # Verificar que el profesor es el asignado al proyecto
    proyecto = db.query(Proyecto).filter(Proyecto.id == postulacion.proyecto_id).first()
    if not proyecto or proyecto.profesor_id != usuario_db.id:
        raise HTTPException(status_code=403, detail="No tienes autorización para modificar esta postulación")
    
    # Actualizar el estado
    postulacion.estado = estado_enum
    # Aquí podrías agregar un campo comentario si lo necesitas
    # postulacion.comentario = comentario
    
    db.commit()
    db.refresh(postulacion)
    
    # Después de db.commit() y antes del return
    # Enviar notificación al estudiante sobre el cambio de estado
    try:
        estudiante = db.query(Usuario).filter(Usuario.id == postulacion.usuario_id).first()
        creador = db.query(Usuario).filter(Usuario.id == proyecto.creador_id).first()
        
        if estudiante and creador:
            if estado_enum == EstadoPostulacionEnum.aceptado:
                notificacion_service.notificar_postulacion_aceptada(
                    estudiante_email=estudiante.correo,
                    estudiante_nombre=f"{estudiante.nombre} {estudiante.apellido}",
                    titulo_proyecto=proyecto.titulo,
                    creador_proyecto=f"{creador.nombre} {creador.apellido}"
                )
            elif estado_enum == EstadoPostulacionEnum.rechazado:
                notificacion_service.notificar_postulacion_rechazada(
                    estudiante_email=estudiante.correo,
                    estudiante_nombre=f"{estudiante.nombre} {estudiante.apellido}",
                    titulo_proyecto=proyecto.titulo,
                    creador_proyecto=f"{creador.nombre} {creador.apellido}",
                    motivo=comentario
                )
    except Exception as e:
        logger.error(f"Error enviando notificación de cambio de estado: {e}")
    
    return {"mensaje": f"Postulación {estado_enum.value} correctamente"}

# ruta para aceptar o rechazar postulaciones
@router.patch("/{proyecto_id}/estado")
def cambiar_estado(proyecto_id: int, estado: EstadoProyectoDBEnum, usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    if proyecto.profesor_id != usuario_db.id:
        raise HTTPException(status_code=403, detail="No autorizado para modificar el estado")

    proyecto.estado = estado
    db.commit()
    return {"mensaje": f"Proyecto marcado como {estado}"}

# ruta para ver los participantes de un proyecto
@router.get("/{proyecto_id}/integrantes")
def ver_integrantes(proyecto_id: int, usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    proyecto = db.query(Proyecto).filter_by(id=proyecto_id).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Permitir acceso si es creador, profesor o colaborador aceptado
    es_colaborador = db.query(Postulacion).filter(
        Postulacion.proyecto_id == proyecto_id,
        Postulacion.usuario_id == usuario_db.id,
        Postulacion.estado == "aceptado"
    ).first() is not None
    if usuario_db.id not in [proyecto.creador_id, proyecto.profesor_id] and not es_colaborador:
        raise HTTPException(status_code=403, detail="Acceso no autorizado")

    # Creador
    creador = db.query(Usuario).filter(Usuario.id == proyecto.creador_id).first()
    # Profesor
    profesor = db.query(Usuario).filter(Usuario.id == proyecto.profesor_id).first()
    # Colaboradores (aceptados)
    colaboradores = db.query(Usuario).join(Postulacion).filter(
        Postulacion.proyecto_id == proyecto_id,
        Postulacion.estado == "aceptado"
    ).all()
    return {
        "creador": {"nombre": f"{creador.nombre} {creador.apellido}", "correo": creador.correo} if creador else None,
        "profesor": {"nombre": f"{profesor.nombre} {profesor.apellido}", "correo": profesor.correo} if profesor else None,
        "colaboradores": [
            {"nombre": f"{u.nombre} {u.apellido}", "correo": u.correo} for u in colaboradores
        ]
    }

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

@router.get("/aprobados")
def listar_proyectos_aprobados(usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    # Obtener el usuario autenticado
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Obtener todos los proyectos aprobados
    proyectos = db.query(Proyecto).filter(Proyecto.estado == EstadoProyectoDBEnum.aprobado).all()
    
    resultado = []
    for p in proyectos:
        # Excluir proyectos donde el usuario es el creador
        if p.creador_id == usuario_db.id:
            continue
            
        # Excluir proyectos donde el usuario ya tiene una postulación aceptada
        postulacion_aceptada = db.query(Postulacion).filter(
            Postulacion.proyecto_id == p.id,
            Postulacion.usuario_id == usuario_db.id,
            Postulacion.estado == EstadoPostulacionEnum.aceptado
        ).first()
        
        if postulacion_aceptada:
            continue
        
        profesor = db.query(Usuario).filter(Usuario.id == p.profesor_id).first()
        resultado.append({
            "id": p.id,
            "titulo": p.titulo,
            "descripcion": p.descripcion,
            "profesor": f"{profesor.nombre} {profesor.apellido}" if profesor else "",
            "perfiles_requeridos": p.perfiles_requeridos,
            "area": p.problema,
            "estado": p.estado.value,
            "fecha_inicio": p.fecha_creacion.isoformat() if p.fecha_creacion else None,
            "creador_id": p.creador_id  # Agregar el ID del creador para referencia
        })
    return resultado

@profesor_router.patch("/proyectos/{proyecto_id}/estado")
def cambiar_estado_proyecto(
    proyecto_id: int,
    datos: dict = Body(...),
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    nuevo_estado = datos.get("estado")
    if not nuevo_estado:
        raise HTTPException(status_code=400, detail="Estado es requerido")

    # Verificar que el usuario es profesor
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db or usuario_db.rol != RolEnum.profesor:
        raise HTTPException(status_code=403, detail="Solo los profesores pueden acceder a este endpoint")

    # Buscar el proyecto y verificar que sea del profesor autenticado
    proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id, Proyecto.profesor_id == usuario_db.id).first()
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado o no autorizado")

    # Cambiar el estado
    proyecto.estado = nuevo_estado
    db.commit()
    db.refresh(proyecto)

    # Después de db.commit() y antes del return
    # Enviar notificación al estudiante creador sobre el cambio de estado del proyecto
    try:
        creador = db.query(Usuario).filter(Usuario.id == proyecto.creador_id).first()
        profesor = db.query(Usuario).filter(Usuario.id == proyecto.profesor_id).first()
        
        if creador and profesor:
            if nuevo_estado == "aprobado":
                notificacion_service.notificar_proyecto_aprobado(
                    estudiante_email=creador.correo,
                    estudiante_nombre=f"{creador.nombre} {creador.apellido}",
                    titulo_proyecto=proyecto.titulo,
                    profesor_nombre=f"{profesor.nombre} {profesor.apellido}",
                    comentarios=datos.get("comentarios", "")
                )
            elif nuevo_estado == "rechazado":
                notificacion_service.notificar_proyecto_rechazado(
                    estudiante_email=creador.correo,
                    estudiante_nombre=f"{creador.nombre} {creador.apellido}",
                    titulo_proyecto=proyecto.titulo,
                    profesor_nombre=f"{profesor.nombre} {profesor.apellido}",
                    comentarios=datos.get("comentarios", "")
                )
    except Exception as e:
        logger.error(f"Error enviando notificación de estado de proyecto: {e}")

    return {"mensaje": f"Proyecto marcado como {nuevo_estado}"}

# NUEVO: Endpoint para obtener proyectos donde el usuario autenticado es profesor responsable
@router.get("/usuario/profesor")
def obtener_proyectos_profesor(usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if usuario_db.rol != RolEnum.profesor:
        raise HTTPException(status_code=403, detail="Solo los profesores pueden acceder a este endpoint")

    # Obtener todos los proyectos donde el usuario es profesor responsable
    proyectos = db.query(Proyecto).filter(Proyecto.profesor_id == usuario_db.id).all()
    
    resultado = []
    for proyecto in proyectos:
        # Obtener información del creador del proyecto
        creador = db.query(Usuario).filter(Usuario.id == proyecto.creador_id).first()
        
        # Contar postulaciones por estado
        postulaciones_pendientes = db.query(Postulacion).filter(
            Postulacion.proyecto_id == proyecto.id,
            Postulacion.estado == EstadoPostulacionEnum.pendiente
        ).count()
        
        postulaciones_aceptadas = db.query(Postulacion).filter(
            Postulacion.proyecto_id == proyecto.id,
            Postulacion.estado == EstadoPostulacionEnum.aceptado
        ).count()
        
        resultado.append({
            "id": proyecto.id,
            "titulo": proyecto.titulo,
            "descripcion": proyecto.descripcion,
            "resumen": proyecto.resumen,
            "problema": proyecto.problema,
            "justificacion": proyecto.justificacion,
            "impacto": proyecto.impacto,
            "estado": proyecto.estado.value,
            "perfiles_requeridos": proyecto.perfiles_requeridos,
            "creador": {
                "id": creador.id,
                "nombre": f"{creador.nombre} {creador.apellido}",
                "email": creador.correo
            } if creador else None,
            "fecha_creacion": proyecto.created_at.isoformat() if hasattr(proyecto, 'created_at') else None,
            "postulaciones_pendientes": postulaciones_pendientes,
            "postulaciones_aceptadas": postulaciones_aceptadas
        })
    
    return resultado

# NUEVO: Endpoint para calificar proyectos
@router.patch("/{proyecto_id}/calificar")
async def calificar_proyecto(
    proyecto_id: int,
    calificacion_data: CalificacionRequest,
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Califica un proyecto. Si la calificación es >= 6.0, lo agrega al ranking automáticamente.
    """
    try:
        # Validar que la calificación esté en el rango correcto
        if not (1.0 <= calificacion_data.calificacion <= 7.0):
            raise HTTPException(
                status_code=400, 
                detail="La calificación debe estar entre 1.0 y 7.0"
            )
        
        # Verificar que el usuario sea profesor
        usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
        if not usuario_db or usuario_db.rol != RolEnum.profesor:
            raise HTTPException(
                status_code=403, 
                detail="Solo los profesores pueden calificar proyectos"
            )
        
        # Buscar el proyecto
        proyecto = db.query(Proyecto).filter(Proyecto.id == proyecto_id).first()
        if not proyecto:
            raise HTTPException(status_code=404, detail="Proyecto no encontrado")
        
        # Verificar que el profesor esté asignado al proyecto
        if proyecto.profesor_id != usuario_db.id:
            raise HTTPException(
                status_code=403, 
                detail="No tienes permisos para calificar este proyecto"
            )
        
        # Verificar que el proyecto esté aprobado
        if proyecto.estado != EstadoProyectoDBEnum.aprobado:
            raise HTTPException(
                status_code=400, 
                detail="Solo se pueden calificar proyectos aprobados"
            )
        
        # Actualizar la calificación del proyecto
        proyecto.calificacion_final = calificacion_data.calificacion
        
        # Si la calificación es >= 6.0, agregar al ranking (si no está ya)
        if calificacion_data.calificacion >= 6.0:
            # Verificar si ya existe en el ranking
            ranking_existente = db.query(ProyectoRanking).filter(
                ProyectoRanking.proyecto_id == proyecto_id
            ).first()
            
            if ranking_existente:
                # Actualizar calificación en ranking existente
                ranking_existente.calificacion_final = calificacion_data.calificacion
                ranking_existente.activo = True
            else:
                # Crear nueva entrada en el ranking
                nuevo_ranking = ProyectoRanking(
                    proyecto_id=proyecto_id,
                    calificacion_final=calificacion_data.calificacion,
                    activo=True
                )
                db.add(nuevo_ranking)
        else:
            # Si la calificación es < 6.0, remover del ranking si estaba
            ranking_existente = db.query(ProyectoRanking).filter(
                ProyectoRanking.proyecto_id == proyecto_id
            ).first()
            
            if ranking_existente:
                ranking_existente.activo = False
        
        # Guardar cambios
        db.commit()
        db.refresh(proyecto)
        
        # Preparar respuesta
        mensaje = f"Proyecto calificado con {calificacion_data.calificacion}"
        if calificacion_data.calificacion >= 6.0:
            mensaje += " y agregado al ranking"
        
        return {
            "mensaje": mensaje,
            "calificacion": calificacion_data.calificacion,
            "en_ranking": calificacion_data.calificacion >= 6.0
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")

# Endpoint para que un estudiante vea todas sus propias postulaciones
@router.get("/postulaciones/mis")
def mis_postulaciones(usuario=Depends(verificar_token), db: Session = Depends(get_db)):
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db or usuario_db.rol != RolEnum.estudiante:
        raise HTTPException(status_code=403, detail="Solo estudiantes pueden ver sus postulaciones")
    postulaciones = db.query(Postulacion).filter_by(usuario_id=usuario_db.id).all()
    return [
        {
            "id": p.id,
            "proyectoId": p.proyecto_id,
            "estado": p.estado.value,
            "fechaPostulacion": p.fecha_postulacion.strftime("%Y-%m-%d"),
            "motivacion": p.motivacion
        }
        for p in postulaciones
    ]

# Endpoint para que el creador del proyecto acepte o rechace postulaciones a su propio proyecto
@router.patch("/postulaciones/{postulacion_id}/estado-creador")
def cambiar_estado_postulacion_creador(
    postulacion_id: int,
    datos: dict = Body(...),
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    estado = datos.get("estado")
    comentario = datos.get("comentario", "")
    if not estado:
        raise HTTPException(status_code=400, detail="Estado es requerido")
    try:
        estado_enum = EstadoPostulacionEnum(estado)
    except ValueError:
        raise HTTPException(status_code=400, detail="Estado inválido")
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db or usuario_db.rol != RolEnum.estudiante:
        raise HTTPException(status_code=403, detail="Solo el creador del proyecto puede cambiar el estado de postulaciones")
    # Obtener la postulación
    postulacion = db.query(Postulacion).filter(Postulacion.id == postulacion_id).first()
    if not postulacion:
        raise HTTPException(status_code=404, detail="Postulación no encontrada")
    # Verificar que el usuario autenticado es el creador del proyecto
    proyecto = db.query(Proyecto).filter(Proyecto.id == postulacion.proyecto_id).first()
    if not proyecto or proyecto.creador_id != usuario_db.id:
        raise HTTPException(status_code=403, detail="No tienes autorización para modificar esta postulación")
    # Actualizar el estado
    postulacion.estado = estado_enum
    db.commit()
    db.refresh(postulacion)
    # Notificar al postulante si es aceptado o rechazado (opcional)
    try:
        estudiante = db.query(Usuario).filter(Usuario.id == postulacion.usuario_id).first()
        if estudiante:
            if estado_enum == EstadoPostulacionEnum.aceptado:
                notificacion_service.notificar_postulacion_aceptada(
                    estudiante_email=estudiante.correo,
                    estudiante_nombre=f"{estudiante.nombre} {estudiante.apellido}",
                    titulo_proyecto=proyecto.titulo,
                    creador_proyecto=f"{usuario_db.nombre} {usuario_db.apellido}"
                )
            elif estado_enum == EstadoPostulacionEnum.rechazado:
                notificacion_service.notificar_postulacion_rechazada(
                    estudiante_email=estudiante.correo,
                    estudiante_nombre=f"{estudiante.nombre} {estudiante.apellido}",
                    titulo_proyecto=proyecto.titulo,
                    creador_proyecto=f"{usuario_db.nombre} {usuario_db.apellido}",
                    motivo=comentario
                )
    except Exception as e:
        logger.error(f"Error enviando notificación de cambio de estado (creador): {e}")
    return {"mensaje": f"Postulación {estado_enum.value} correctamente"}
