# Configuración de Google OAuth para Proyecto UDP

## 🚨 Problema Actual
El error `OAuth client was not found` y `Error 401: invalid_client` indica que las credenciales de Google OAuth no están configuradas correctamente.

## 📋 Pasos para Solucionar

### 1. Crear Proyecto en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita las siguientes APIs:
   - Google+ API
   - Google OAuth2 API

### 2. Configurar OAuth 2.0 Credentials
1. Ve a **APIs & Services > Credentials**
2. Haz clic en **"Create Credentials" > "OAuth 2.0 Client IDs"**
3. Selecciona **"Web application"**
4. Configura las URLs autorizadas:

#### Authorized JavaScript origins:
```
http://localhost:5173
http://localhost:3000
```

#### Authorized redirect URIs:
```
http://localhost:8000/auth
http://localhost:5173/callback
```

### 3. Obtener Credenciales Reales
Después de crear el cliente OAuth, obtendrás:
- **Client ID**: `123456789-abcdefg.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-abcdefghijklmnop`

### 4. Configurar Variables de Entorno

#### Opción A: Archivo .env en backend/
```bash
# backend/.env
GOOGLE_CLIENT_ID=tu-client-id-real.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu-client-secret-real
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/proyectUDP
JWT_SECRET_KEY=supersecreto_udp_2024
```

#### Opción B: Modificar docker-compose.yml
```yaml
environment:
  - GOOGLE_CLIENT_ID=tu-client-id-real.apps.googleusercontent.com
  - GOOGLE_CLIENT_SECRET=tu-client-secret-real
  - JWT_SECRET_KEY=supersecreto_udp_2024
```

### 5. Verificar Configuración
```bash
cd backend
python check_config.py  # Si existe el script
```

### 6. Reiniciar Servicios
```bash
# Detener servicios
sudo docker-compose down

# Limpiar
sudo docker system prune -f

# Iniciar servicios
sudo docker-compose up --build -d

# Verificar estado
sudo docker-compose ps

# Ver logs
sudo docker-compose logs backend
```

### 7. Probar Autenticación
1. Ve a `http://localhost:5173`
2. Haz clic en "Iniciar Sesión con Google"
3. Deberías ser redirigido a Google para autorización
4. Después de autorizar, serás redirigido de vuelta a la aplicación

## 🔧 Correcciones Aplicadas

### Backend
- ✅ Corregido import de `io` en `proyecto_controller.py`
- ✅ Agregado campo `estado` en modelo `Proyecto`
- ✅ Eliminado archivo duplicado `proyecto_model.py`
- ✅ Mejorado controlador de autenticación con validaciones
- ✅ Reemplazado `print` statements con logging apropiado

### Frontend
- ✅ Corregido router con ruta de callback
- ✅ Corregido problema de navegación infinita en `Home.jsx`
- ✅ Eliminado `console.log` statements de debug

### Docker
- ✅ Agregados comentarios explicativos
- ✅ Mejorada configuración con `restart: unless-stopped`

## 🚨 Solución de Problemas Comunes

### Error: "OAuth client was not found"
- Verifica que el Client ID sea correcto
- Confirma que el proyecto esté activo en Google Cloud Console

### Error: "redirect_uri_mismatch"
- Verifica que las URLs de redirección en Google Cloud Console coincidan exactamente
- Asegúrate de incluir `http://localhost:8000/auth` y `http://localhost:5173/callback`

### Error: "invalid_client"
- Verifica que el Client Secret sea correcto
- Confirma que las credenciales estén configuradas en las variables de entorno

## 📝 Notas Importantes

- **Nunca** subas las credenciales reales a Git
- Usa archivos `.env` para desarrollo local
- En producción, usa variables de entorno del servidor
- Las URLs de redirección deben coincidir exactamente (incluyendo http/https)
- El proyecto debe estar activo en Google Cloud Console

## 🎯 Estado Actual del Proyecto

Después de aplicar todas las correcciones:
- ✅ Arquitectura sólida y funcional
- ✅ Manejo de errores mejorado
- ✅ Código limpio sin debug statements
- ✅ Configuración de Docker optimizada
- ⚠️ **Pendiente**: Configurar credenciales reales de Google OAuth

# Verificar si Docker funciona
sudo docker ps

# Verificar si hay contenedores corriendo
sudo docker ps -a

# Verificar logs del backend
sudo docker-compose logs backend

# Iniciar todos los servicios
./iniciar_manual.sh 