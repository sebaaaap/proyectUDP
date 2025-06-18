from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime
import logging
import uuid  
import os
from pathlib import Path
from database.db import get_db
from models.archivos_proyecto import ArchivoProyecto
from models.proyecto_model import Proyecto
from models.postulacion_model import Postulacion, EstadoPostulacionEnum
from models.user_model import Usuario
from helpers.jwtAuth import verificar_token

router = APIRouter()
logger = logging.getLogger(__name__)

# Configuración para almacenar archivos
UPLOAD_FOLDER = Path("/app/uploads")  # Ruta dentro del contenedor Docker
UPLOAD_FOLDER.mkdir(exist_ok=True)
BASE_URL = "http://localhost:8000"

@router.post("/{id_proyecto}/archivos")
async def subir_archivo_proyecto(
    id_proyecto: int,
    descripcion: str = Form(...),
    archivo: UploadFile = File(...),
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    # 1. Verificar que el usuario existe
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 2. Verificar que el proyecto existe
    proyecto = db.query(Proyecto).get(id_proyecto)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    # 3. Verificar que el usuario está postulado y aceptado al proyecto
    postulacion = db.query(Postulacion).filter(
        Postulacion.proyecto_id == id_proyecto,
        Postulacion.usuario_id == usuario_db.id,
        Postulacion.estado == EstadoPostulacionEnum.aceptado
    ).first()
    
    if not postulacion and usuario_db.id != proyecto.creador_id:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para subir archivos a este proyecto"
        )

    # 4. Validar y guardar archivo
    try:
        contenido = await archivo.read()
        if len(contenido) > 5 * 1024 * 1024:  # 5MB límite
            raise HTTPException(status_code=413, detail="Archivo demasiado grande")

        # Generar nombre único
        file_ext = os.path.splitext(archivo.filename)[1]
        unique_name = f"{uuid.uuid4().hex}{file_ext}"
        file_path = UPLOAD_FOLDER / unique_name
        
        # Guardar archivo
        with open(file_path, "wb") as f:
            f.write(contenido)
        
        # 5. Crear registro en DB
        nuevo_archivo = ArchivoProyecto(
            id_proyecto=id_proyecto,
            nombre_archivo=archivo.filename,
            tipo_archivo=archivo.content_type,
            url=f"{BASE_URL}/archivos/{unique_name}",
            descripcion=descripcion,
            fecha_subida=datetime.utcnow(),
            id_estudiante=usuario_db.id
        )
        
        db.add(nuevo_archivo)
        db.commit()
        db.refresh(nuevo_archivo)
        
        return {
            "mensaje": "Archivo subido exitosamente",
            "archivo_id": nuevo_archivo.id,
            "nombre": nuevo_archivo.nombre_archivo,
            "url": nuevo_archivo.url
        }
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error subiendo archivo: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al subir archivo")

@router.get("/{id_proyecto}/archivos")
def obtener_archivos(
    id_proyecto: int,
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    # Verificar que el usuario existe
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # Verificar que el proyecto existe
    proyecto = db.query(Proyecto).get(id_proyecto)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    # Verificar que el usuario tiene acceso al proyecto
    postulacion = db.query(Postulacion).filter(
        Postulacion.proyecto_id == id_proyecto,
        Postulacion.usuario_id == usuario_db.id,
        Postulacion.estado == EstadoPostulacionEnum.aceptado
    ).first()
    
    if not postulacion and usuario_db.id != proyecto.creador_id and usuario_db.id != proyecto.profesor_id:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para ver los archivos de este proyecto"
        )

    archivos = db.query(ArchivoProyecto).filter(ArchivoProyecto.id_proyecto == id_proyecto).all()
    return archivos

@router.get("/{id_proyecto}/archivos/{id_archivo}/descargar")
async def descargar_archivo(
    id_proyecto: int,
    id_archivo: int,
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    """
    Descarga un archivo asociado a un proyecto.
    Verifica permisos antes de permitir la descarga.
    """
    # 1. Verificar que el usuario existe
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 2. Verificar que el proyecto existe
    proyecto = db.query(Proyecto).get(id_proyecto)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    # 3. Verificar que el archivo existe en la base de datos
    archivo = db.query(ArchivoProyecto).filter(
        ArchivoProyecto.id == id_archivo,
        ArchivoProyecto.id_proyecto == id_proyecto
    ).first()

    if not archivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Archivo no encontrado"
        )

    # 4. Verificar que el usuario tiene acceso al proyecto
    postulacion = db.query(Postulacion).filter(
        Postulacion.proyecto_id == id_proyecto,
        Postulacion.usuario_id == usuario_db.id,
        Postulacion.estado == EstadoPostulacionEnum.aceptado
    ).first()
    
    if not postulacion and usuario_db.id != proyecto.creador_id and usuario_db.id != proyecto.profesor_id:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para descargar archivos de este proyecto"
        )

    # 5. Obtener la ruta física del archivo
    unique_filename = archivo.url.split("/")[-1]  # Extrae el nombre único de la URL
    file_path = UPLOAD_FOLDER / unique_filename

    # 6. Verificar que el archivo existe físicamente
    if not file_path.is_file():
        logger.error(f"Archivo {file_path} no encontrado en el servidor")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El archivo no existe en el servidor"
        )

    # 7. Devolver el archivo como respuesta
    return FileResponse(
        path=file_path,
        filename=archivo.nombre_archivo,  # Nombre original para el usuario
        media_type=archivo.tipo_archivo  # MIME type
    )

@router.delete("/{id_proyecto}/archivos/{id_archivo}")
def eliminar_archivo(
    id_proyecto: int,
    id_archivo: int,
    usuario=Depends(verificar_token),
    db: Session = Depends(get_db)
):
    # 1. Verificar que el usuario existe
    usuario_db = db.query(Usuario).filter(Usuario.correo == usuario["sub"]).first()
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 2. Verificar que el proyecto existe
    proyecto = db.query(Proyecto).get(id_proyecto)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")

    # 3. Verificar que el archivo existe
    archivo = db.query(ArchivoProyecto).filter(
        ArchivoProyecto.id == id_archivo,
        ArchivoProyecto.id_proyecto == id_proyecto
    ).first()
    
    if not archivo:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    # 4. Verificar que el usuario tiene permiso para eliminar el archivo
    if archivo.id_estudiante != usuario_db.id and usuario_db.id != proyecto.creador_id:
        raise HTTPException(
            status_code=403,
            detail="No tienes permiso para eliminar este archivo"
        )

    # 5. Eliminar el archivo físico
    try:
        unique_filename = archivo.url.split("/")[-1]
        file_path = UPLOAD_FOLDER / unique_filename
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        logger.error(f"Error eliminando archivo físico: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al eliminar el archivo físico")

    # 6. Eliminar el registro de la base de datos
    db.delete(archivo)
    db.commit()
    return {"mensaje": "Archivo eliminado correctamente"}    