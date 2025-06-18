from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from starlette.requests import Request
from starlette.responses import RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from models.user_model import Usuario, RolEnum
from helpers.jwtAuth import crear_token
from database.db import get_db
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Validar que las credenciales estén configuradas
if not GOOGLE_CLIENT_ID or GOOGLE_CLIENT_ID == "tu-client-id.apps.googleusercontent.com":
    logger.error("GOOGLE_CLIENT_ID no está configurado correctamente")
    raise ValueError("GOOGLE_CLIENT_ID debe estar configurado en las variables de entorno")

if not GOOGLE_CLIENT_SECRET or GOOGLE_CLIENT_SECRET == "tu-client-secret":
    logger.error("GOOGLE_CLIENT_SECRET no está configurado correctamente")
    raise ValueError("GOOGLE_CLIENT_SECRET debe estar configurado en las variables de entorno")

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
        logger.error(f"Error de OAuth: {str(e)}")
        return RedirectResponse('/?error=auth_failed')
    except Exception as e:
        logger.error(f"Error inesperado en auth: {str(e)}")
        return RedirectResponse('/?error=unexpected_error')

    userinfo = token.get('userinfo')
    if not userinfo:
        logger.error("No se obtuvo información del usuario")
        return RedirectResponse('/?error=no_user_info')

    email = userinfo['email']
    nombre_completo = userinfo.get('name', '')
    nombre = ' '.join(nombre_completo.split(' ')[0:2]) if nombre_completo else ''
    apellido = ' '.join(nombre_completo.split(' ')[2:4]) if nombre_completo else ''

    # Verificar si el correo pertenece a un profesor para asignarle el rol
    try:
        profesor = db.execute(
            text("SELECT 1 FROM profesores WHERE email = :email"),
            {"email": email}
        ).fetchone()
        rol_plataforma = RolEnum.profesor if profesor else RolEnum.estudiante
    except Exception as e:
        logger.error(f"Error verificando rol de profesor: {str(e)}")
        rol_plataforma = RolEnum.estudiante  # Default a estudiante si hay error

    try:
        usuario = db.query(Usuario).filter(Usuario.email == email).first()

        if not usuario:
            usuario = Usuario(
                nombre=nombre,
                apellido=apellido,
                email=email,
                rol_plataforma=rol_plataforma
            )
            db.add(usuario)
            db.commit()
            db.refresh(usuario)

        token_jwt = crear_token({
            "sub": usuario.email,
            "rol_plataforma": usuario.rol_plataforma.value,
        })

        # Redirigir al frontend con el token en la URL
        frontend_url = f"http://localhost:5173/callback#token={token_jwt}"
        return RedirectResponse(url=frontend_url)
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error creando/obteniendo usuario: {str(e)}")
        return RedirectResponse('/?error=user_creation_failed')