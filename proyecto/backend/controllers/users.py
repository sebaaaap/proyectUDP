from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt, JWTError
from passlib.context import CryptContext
from datetime import datetime, timedelta

from database.db import get_db
from database.models import Estudiante

from proyecto.backend.schemas.user import (
    EstudianteCreate,
    EstudianteResponse,
    EstudianteLogin,
    LoginResponse,
)

ALGORITHM = "HS256"
ACCESS_TOKEN_DURATION = 30
SECRET_KEY = "clave_secreta_muy_segura"

oauth2 = OAuth2PasswordBearer(tokenUrl="estudiantes/login")
crypt = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={status.HTTP_404_NOT_FOUND: {"message": "Estudiante not found"}}
)


# Funciones auxiliares
def hash_password(password: str) -> str:
    return crypt.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return crypt.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_DURATION)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_estudiante_by_email(db: Session, email: str):
    return db.query(Estudiante).filter(Estudiante.email == email).first()


def get_estudiante_by_rut(db: Session, rut: str):
    return db.query(Estudiante).filter(Estudiante.rut_estudiante == rut).first()


async def get_current_estudiante(token: str = Depends(oauth2), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    estudiante = get_estudiante_by_email(db, email=email)
    if estudiante is None:
        raise credentials_exception

    return estudiante


# Endpoints
@router.post("/register", response_model=EstudianteResponse, status_code=status.HTTP_201_CREATED)
async def register_estudiante(estudiante: EstudianteCreate, db: Session = Depends(get_db)):

    existing_estudiante_email = get_estudiante_by_email(db, estudiante.email)
    if existing_estudiante_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    existing_estudiante_rut = get_estudiante_by_rut(db, estudiante.rut_estudiante)
    if existing_estudiante_rut:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="RUT already registered"
        )

    # Crear nuevo estudiante
    hashed_password = hash_password(estudiante.password)

    db_estudiante = Estudiante(
        rut_estudiante=estudiante.rut_estudiante,
        nombre1=estudiante.nombre1,
        nombre2=estudiante.nombre2,
        apellido1=estudiante.apellido1,
        apellido2=estudiante.apellido2,
        fecha_nacimiento=estudiante.fecha_nacimiento,
        nacionalidad=estudiante.nacionalidad,
        genero=estudiante.genero,
        anio_ingreso=estudiante.anio_ingreso,
        telefono=estudiante.telefono,
        carrera=estudiante.carrera,
        facultad=estudiante.facultad,
        promedio_general=estudiante.promedio_general,
        semestre_actual=estudiante.semestre_actual,
        experiencia=estudiante.experiencia,
        habilidades=estudiante.habilidades,
        email=estudiante.email,
        password=hashed_password
    )

    db.add(db_estudiante)
    db.commit()
    db.refresh(db_estudiante)

    return db_estudiante


@router.post("/login", response_model=LoginResponse)
async def login_estudiante(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    estudiante = get_estudiante_by_email(db, form_data.username)

    if not estudiante or not verify_password(form_data.password, estudiante.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": estudiante.email})

    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        estudiante=EstudianteResponse.from_orm(estudiante)
    )

@router.get("/all", response_model=list[EstudianteResponse])
async def get_all_estudiantes(db: Session = Depends(get_db)):
    estudiantes = db.query(Estudiante).all()
    return estudiantes