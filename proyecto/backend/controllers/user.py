rom fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from starlette.requests import Request
from starlette.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from ..models.user_model import Usuario, RolEnum, Estudiante, Profesor
from ..database.db import get_db
from ..helpers.jwtAuth import verificar_usuario, crear_token, decode_token
from ..schemas.user_schema import PerfilProfesor, PerfilEstudiante


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
    frontend_url = f"http://localhost:3000/home#token={token_jwt}"
    return RedirectResponse(url=frontend_url)

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