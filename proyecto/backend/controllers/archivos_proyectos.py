# from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
# from fastapi.responses import FileResponse
# from sqlalchemy.orm import Session
# from datetime import datetime
# import logging
# import uuid  
# import os
# from pathlib import Path
# from database.db import get_db
# from services.firebase import *
# from models.archivos_proyecto import ArchivoProyecto
# from models.proyecto import Proyecto
# from models.participacion import Participacion, EstadoParticipacionEnum
# from models.estudiante import Estudiante


# router = APIRouter()
# logger = logging.getLogger(__name__)

# UPLOAD_FOLDER = Path("/app/uploads")  # Ruta dentro del contenedor
# UPLOAD_FOLDER.mkdir(exist_ok=True)
# BASE_URL = "http://localhost:8000"

# @router.post("/proyectos/{id_proyecto}/archivos")
# async def subir_archivo_proyecto(
#     id_proyecto: int,
#     descripcion: str = Form(...),
#     estudiante_id: int = Form(...),
#     archivo: UploadFile = File(...),
#     db: Session = Depends(get_db)
# ):
#     # 1. Verificar que el proyecto exista
#     proyecto = db.query(Proyecto).get(id_proyecto)
#     if not proyecto:
#         raise HTTPException(status_code=404, detail="Proyecto no encontrado")

#     # 2. Verificar que el estudiante existe
#     estudiante = db.query(Estudiante).get(estudiante_id)
#     if not estudiante:
#         raise HTTPException(status_code=404, detail="Estudiante no encontrado")

#     # 3. Verificar participación aprobada
#     participacion = db.query(Participacion).filter(
#         Participacion.id_proyecto == id_proyecto,
#         Participacion.id_estudiante == estudiante_id,
#         Participacion.estado_aprobacion == EstadoParticipacionEnum.aprobado
#     ).first()
    
#     if not participacion:
#         raise HTTPException(
#             status_code=403,
#             detail="El estudiante no tiene permisos para subir archivos a este proyecto"
#         )

#     # 4. Validar y guardar archivo
#     try:
#         contenido = await archivo.read()
#         if len(contenido) > 5 * 1024 * 1024:
#             raise HTTPException(status_code=413, detail="Archivo demasiado grande")

#         # Generar nombre único
#         file_ext = os.path.splitext(archivo.filename)[1]
#         unique_name = f"{uuid.uuid4().hex}{file_ext}"
#         file_path = UPLOAD_FOLDER / unique_name
        
#         # Guardar archivo
#         with open(file_path, "wb") as f:
#             f.write(contenido)
        
#         # 5. Crear registro en DB
#         nuevo_archivo = ArchivoProyecto(
#             id_proyecto=id_proyecto,
#             id_estudiante=estudiante_id,
#             nombre_archivo=archivo.filename,
#             tipo_archivo=archivo.content_type,
#             url=f"{BASE_URL}/archivos/{unique_name}",
#             descripcion=descripcion,
#             fecha_subida=datetime.utcnow()
#         )
        
#         db.add(nuevo_archivo)
#         db.commit()
        
#         return {
#             "mensaje": "Archivo subido exitosamente",
#             "archivo_id": nuevo_archivo.id,
#             "nombre": nuevo_archivo.nombre_archivo,
#             "url": nuevo_archivo.url
#         }
        
#     except Exception as e:
#         db.rollback()
#         logger.error(f"Error subiendo archivo: {str(e)}")
#         raise HTTPException(status_code=500, detail="Error al subir archivo")
    

# @router.get("/proyectos/{id_proyecto}/archivos/{id_archivo}/descargar")
# async def descargar_archivo(
#     id_proyecto: int,
#     id_archivo: int,
#     db: Session = Depends(get_db)
# ):
#     """
#     Descarga un archivo asociado a un proyecto.
#     Verifica permisos antes de permitir la descarga.
#     """
#     # 1. Verificar que el archivo existe en la base de datos
#     archivo = db.query(ArchivoProyecto).filter(
#         ArchivoProyecto.id == id_archivo,
#         ArchivoProyecto.id_proyecto == id_proyecto
#     ).first()

#     if not archivo:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Archivo no encontrado"
#         )

#     # 2. Obtener la ruta física del archivo (asumiendo que guardaste el nombre único)
#     unique_filename = archivo.url.split("/")[-1]  # Extrae el nombre único de la URL
#     file_path = UPLOAD_FOLDER / unique_filename

#     # 3. Verificar que el archivo existe físicamente
#     if not file_path.is_file():
#         logger.error(f"Archivo {file_path} no encontrado en el servidor")
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="El archivo no existe en el servidor"
#         )

#     # 4. Devolver el archivo como respuesta
#     return FileResponse(
#         path=file_path,
#         filename=archivo.nombre_archivo,  # Nombre original para el usuario
#         media_type=archivo.tipo_archivo  # MIME type
#     )    