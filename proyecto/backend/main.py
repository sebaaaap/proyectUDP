from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles

from database.db import Base, engine  
from controllers import user, utils, proyecto
from controllers.proyecto import router as proyecto_router, profesor_router
from controllers.archivos_proyectos import router as archivos_router
from controllers.ranking import router as ranking_router  # Importar el router de ranking

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

# Endpoint de prueba para postulaciones
@app.get("/test-postulaciones")
def test_postulaciones():
    return {"mensaje": "Endpoint de postulaciones funcionando"}

# Incluir routers
app.include_router(user.router)
app.include_router(utils.router)
app.include_router(proyecto_router, prefix="/proyectos", tags=["proyectos"])
app.include_router(profesor_router, prefix="/profesor", tags=["profesor"])
app.include_router(archivos_router, prefix="/proyectos", tags=["archivos"])
app.include_router(ranking_router, prefix="/ranking", tags=["ranking"])  # Agregar router de ranking

# Servir archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")