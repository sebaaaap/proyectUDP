# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import Base, engine  
from controllers import proyecto_controller, archivos_proyectos
from controllers.proyecto_filtro import router as proyecto_router
from controllers.evaluacion_proyecto import router as evaluacion_router
from controllers.ranking_controller import router as ranking_router
import models  # Esto activa los modelos vía models/__init__.py

# Create FastAPI instance FIRST
app = FastAPI()

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En desarrollo puedes usar "*". En producción, especifica el dominio de tu frontend.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
# Base.metadata.drop_all(engine)
Base.metadata.create_all(bind=engine)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Hola mundo"}

# Include all routers AFTER app is created
app.include_router(ranking_router, prefix="/ranking", tags=["ranking"])
app.include_router(proyecto_router)
app.include_router(evaluacion_router)
app.include_router(archivos_proyectos.router)
app.include_router(proyecto_controller.router, prefix="/proyectos", tags=["proyectos"])