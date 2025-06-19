from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles

from database.db import Base, engine
from controllers import proyecto, archivos_proyectos, user, utils
from controllers.proyecto import router as proyecto_router
from controllers.archivos_proyectos import router as archivos_router

import models  # Asegura la creación de las tablas

# ✅ Crear la instancia principal de FastAPI (solo una vez)
app = FastAPI(title="Proyecto UDP API", version="1.0.0")

# ✅ Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Puertos del frontend en desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Configurar middleware de sesiones
app.add_middleware(SessionMiddleware, secret_key="add any string...")

# ✅ Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# ✅ Ruta básica de prueba
@app.get("/")
def read_root():
    return {"message": "Hola mundo - API Proyecto UDP"}

# ✅ Incluir routers
app.include_router(user.router)
app.include_router(utils.router)
app.include_router(proyecto_router, prefix="/proyectos", tags=["proyectos"])
app.include_router(archivos_router, prefix="/proyectos", tags=["archivos"])

# ✅ Servir archivos estáticos (si tienes una carpeta /static)
app.mount("/static", StaticFiles(directory="static"), name="static")
