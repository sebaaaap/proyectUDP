from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from starlette.requests import Request
from starlette.responses import RedirectResponse, JSONResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from models.user_model import Usuario, RolEnum
from helpers.jwtAuth import crear_token
from database.db import get_db

router = APIRouter()


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
    url = request.url_for('auth')
    return await oauth.google.authorize_redirect(request, url)


# En tu router de autenticación (FastAPI)
@router.get('/auth')
async def auth(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        return RedirectResponse('/?error=auth_failed')

    userinfo = token.get('userinfo')
    if not userinfo:
        return RedirectResponse('/?error=no_user_info')

    email = userinfo['email']
    nombre_completo = userinfo.get('name', '')
    nombre = ' '.join(nombre_completo.split(' ')[0:2])
    apellido = ' '.join(nombre_completo.split(' ')[2:4])

    # Verificar si el correo pertenece a un profesor para asignarle el rol
    profesor = db.execute(
        text("SELECT 1 FROM profesores WHERE email = :email"),
        {"email": email}
    ).fetchone()
    rol_plataforma = RolEnum.profesor if profesor else RolEnum.estudiante

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
    frontend_url = f"http://localhost:3000/callback#token={token_jwt}"
    return RedirectResponse(url=frontend_url)