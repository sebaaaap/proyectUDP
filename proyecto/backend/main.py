from controllers.proyecto_filtro import router as proyecto_router
from controllers.evaluacion_proyecto import router as evaluacion_router
from fastapi.middleware.cors import CORSMiddleware
# main.py
from fastapi import FastAPI
from database.db import Base, engine  
from controllers import proyecto_controller, archivos_proyectos, user
from starlette.middleware.sessions import SessionMiddleware
from fastapi.staticfiles import StaticFiles
import models# Esto activa los modelos vía models/__init__.py






app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En desarrollo puedes usar "*". En producción, especifica el dominio de tu frontend.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base.metadata.drop_all(engine)
# Crear las tablas (si estás usando tu propio engine con SQLite o PostgreSQL)
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Hola mundo"}

app.include_router(proyecto_router)
app.include_router(evaluacion_router)
app.include_router(archivos_proyectos.router)
app.include_router(proyecto_controller.router, prefix="/proyectos", tags=["proyectos"])



app.include_router(user.router)
app.add_middleware(SessionMiddleware, secret_key="add any string...")
app.mount("/static", StaticFiles(directory="static"), name="static")
