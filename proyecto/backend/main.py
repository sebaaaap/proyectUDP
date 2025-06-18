from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles

from database.db import Base, engine  
from controllers import proyecto_controller, archivos_proyectos, user, utils, proyecto
# from controllers.proyecto_filtro import router as proyecto_filtro_router
# from controllers.evaluacion_proyecto import router as evaluacion_router
from controllers.proyecto import router as proyecto_controller
from controllers.archivos_proyectos import router as archivos_router


# Importar modelos para activar la creación de tablas
import models

app = FastAPI(title="Proyecto UDP API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En desarrollo puedes usar "*". En producción, especifica el dominio de tu frontend.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar sesiones
app.add_middleware(SessionMiddleware, secret_key="add any string...")

# Crear las tablas de la base de datos


Base.metadata.create_all(bind=engine)

# Ruta de prueba
@app.get("/")
def read_root():
    return {"message": "Hola mundo - API Proyecto UDP"}

# Incluir routers
# app.include_router(proyecto_filtro_router)
# app.include_router(evaluacion_router)
# app.include_router(archivos_proyectos.router)
# app.include_router(proyecto_controller.router, prefix="/proyectos", tags=["proyectos"])
app.include_router(user.router)
app.include_router(utils.router)


app.include_router(proyecto.router, prefix="/proyectos", tags=["proyectos"])
app.include_router(archivos_router, prefix="/proyectos", tags=["archivos"])

# Servir archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")
