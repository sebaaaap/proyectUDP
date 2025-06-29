from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import text

from starlette.requests import Request
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
import logging
from models.user_model import Usuario, RolEnum, Estudiante, Profesor
from database.db import get_db
from helpers.jwtAuth import verificar_usuario, crear_token, decode_token
from schemas.user_schema import PerfilProfesor, PerfilEstudiante
from services.notificacion_service import notificacion_service 


logger = logging.getLogger(__name__)

router = APIRouter()

# Validar que las credenciales estén configuradas
# if not GOOGLE_CLIENT_ID or GOOGLE_CLIENT_ID == "tu-client-id.apps.googleusercontent.com":
#     logger.error("GOOGLE_CLIENT_ID no está configurado correctamente")
#     raise ValueError("GOOGLE_CLIENT_ID debe estar configurado en las variables de entorno")

# if not GOOGLE_CLIENT_SECRET or GOOGLE_CLIENT_SECRET == "tu-client-secret":
#     logger.error("GOOGLE_CLIENT_SECRET no está configurado correctamente")
#     raise ValueError("GOOGLE_CLIENT_SECRET debe estar configurado en las variables de entorno")

oauth = OAuth()
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    client_kwargs={
        'scope': 'email openid profile',
        'redirect_uri': 'http://localhost:8000/auth'
    }
)

@router.get("/login")
async def login(request: Request):
    try:
        url = request.url_for('auth')
        return await oauth.google.authorize_redirect(request, url)
    except Exception as e:
        logger.error(f"Error en login: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno en autenticación")

@router.get('/auth')
async def auth(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        # Redirigir al frontend con el error
        return RedirectResponse(url=f"http://localhost:5173/login?error={e.error}")

    userinfo = token.get('userinfo')
    if not userinfo:
        return RedirectResponse('http://localhost:5173/login')

    email = userinfo['email']
    nombre_completo = userinfo.get('name', '')
    nombre = ' '.join(nombre_completo.split(' ')[0:2])
    apellido = ' '.join(nombre_completo.split(' ')[2:4])

    # Verificar si el correo pertenece a un profesor para asignarle el rol
    profesor = db.execute(
        text("SELECT 1 FROM correo_profesores WHERE correo = :correo"),
        {"correo": email}
    ).fetchone()
    # Asignarle el rol dependiendo de lo anterior
    rol = RolEnum.profesor if profesor else RolEnum.estudiante

    usuario = db.query(Usuario).filter(Usuario.correo == email).first()

    if not usuario:
        # Crear nuevo usuario en la base de datos
        usuario = Usuario(
            nombre=nombre,
            apellido=apellido,
            correo=email,
            rol=rol
        )
        db.add(usuario)
        db.commit()
        db.refresh(usuario)

        # Después de db.refresh(usuario) y antes de generar el token
        # Enviar notificación de cuenta creada
        try:
            notificacion_service.notificar_cuenta_creada(
                nombre=usuario.nombre,
                apellido=usuario.apellido,
                email=usuario.correo,
                rol=usuario.rol.value
            )
        except Exception as e:
            logger.error(f"Error enviando notificación de cuenta creada: {e}")
            # No fallar el proceso de registro por un error de notificación

    # Generar el token SIEMPRE
    token = crear_token({
        "sub": usuario.correo,
        "rol": usuario.rol.value,
        "nombre": usuario.nombre,
        "apellido": usuario.apellido,
    })

    # Preparar redirección según el rol guardado en la base de datos y estado del perfil
    if usuario.rol == RolEnum.estudiante:
        estudiante = db.query(Estudiante).filter_by(id=usuario.id).first()
        if not estudiante:
            redirect_url = "http://localhost:5173/completar-perfil-estudiante"
        else:
            redirect_url = "http://localhost:5173/home"

    elif usuario.rol == RolEnum.profesor:
        profesor = db.query(Profesor).filter_by(id=usuario.id).first()
        if not profesor:
            redirect_url = "http://localhost:5173/completar-perfil-profesor"
        else:
            redirect_url = "http://localhost:5173/home"

    # Crear respuesta con redirección y cookie
    response = RedirectResponse(url=redirect_url)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,  # True en producción
        samesite="lax",
        max_age=60 * 60 * 24
    )
    return response

@router.post("/completar-perfil/estudiante")
def completar_perfil_estudiante(
    perfil: PerfilEstudiante,
    db: Session = Depends(get_db),
    usuario_data=Depends(verificar_usuario)
):
    if usuario_data["rol"] != "estudiante":
        raise HTTPException(status_code=403, detail="Solo los estudiantes pueden usar este endpoint")

    usuario = db.query(Usuario).filter(Usuario.correo == usuario_data["sub"]).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if db.query(Estudiante).filter(Estudiante.id == usuario.id).first():
        raise HTTPException(status_code=400, detail="Perfil de estudiante ya registrado")

    estudiante = Estudiante(
        id=usuario.id,
        carrera_id=perfil.carrera_id,
        semestre_actual=perfil.semestre_actual,
        promedio_general=perfil.promedio_general
    )
    db.add(estudiante)
    db.commit()
    return {"mensaje": "Perfil de estudiante completado"}

@router.post("/completar-perfil/profesor")
def completar_perfil_profesor(
    perfil: PerfilProfesor,
    db: Session = Depends(get_db),
    usuario_data=Depends(verificar_usuario)
):
    if usuario_data["rol"] != "profesor":
        raise HTTPException(status_code=403, detail="Solo los profesores pueden usar este endpoint")

    usuario = db.query(Usuario).filter(Usuario.correo == usuario_data["sub"]).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if db.query(Profesor).filter(Profesor.id == usuario.id).first():
        raise HTTPException(status_code=400, detail="Perfil de profesor ya registrado")

    profesor = Profesor(
        id=usuario.id,
        facultad=perfil.facultad
    )
    db.add(profesor)
    db.commit()
    return {"mensaje": "Perfil de profesor completado"}

@router.get("/me")
async def obtener_usuario_actual(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")

    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    correo = payload.get("sub")
    usuario = db.query(Usuario).filter(Usuario.correo == correo).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    return {
        "nombre": usuario.nombre,
        "apellido": usuario.apellido,
        "correo": usuario.correo,
        "rol": usuario.rol.value
    }
