# Solución de Problemas - Proyecto UDP

## 🚨 Error: ERR_SOCKET_NOT_CONNECTED

### Problema
```
No se puede acceder a este sitio web
Es posible que la página web http://localhost:8000/login esté temporalmente inactiva o que se haya trasladado definitivamente a otra dirección.
ERR_SOCKET_NOT_CONNECTED
```

### Causas Posibles
1. **Servicios no iniciados**: Los contenedores Docker no están ejecutándose
2. **Problemas de permisos**: Docker no tiene permisos para ejecutar
3. **Puertos ocupados**: Otro servicio está usando el puerto 8000
4. **Errores en el código**: Problemas en la configuración del backend

## 🔧 Soluciones

### 1. Verificar Estado de Servicios
```bash
# Verificar si Docker está funcionando
sudo systemctl status docker

# Verificar contenedores activos
sudo docker ps

# Verificar todos los contenedores (incluyendo detenidos)
sudo docker ps -a
```

### 2. Iniciar Servicios Manualmente
```bash
# Navegar al directorio del proyecto
cd /home/diego/PROYECTO.IGS/proyectUDP/proyecto

# Detener servicios existentes
sudo docker-compose down

# Limpiar contenedores huérfanos
sudo docker system prune -f

# Iniciar servicios
sudo docker-compose up --build -d
```

### 3. Verificar Logs
```bash
# Ver logs del backend
sudo docker-compose logs backend

# Ver logs en tiempo real
sudo docker-compose logs -f backend

# Ver logs de todos los servicios
sudo docker-compose logs
```

### 4. Verificar Puertos
```bash
# Verificar qué está usando el puerto 8000
sudo netstat -tulpn | grep :8000

# Verificar qué está usando el puerto 5173
sudo netstat -tulpn | grep :5173
```

### 5. Solucionar Permisos de Docker
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar
newgrp docker

# Verificar permisos
docker ps
```

### 6. Verificar Configuración de Google OAuth
Asegúrate de que en Google Cloud Console tengas configuradas estas URLs:

**Authorized JavaScript origins:**
```
http://localhost:5173
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:8000/auth
http://localhost:5173/callback
```

## 🚀 Script de Inicio Automático

Usa el script `iniciar_servicios.sh` que creamos:

```bash
chmod +x iniciar_servicios.sh
./iniciar_servicios.sh
```

## 📋 Checklist de Verificación

- [ ] Docker está instalado y funcionando
- [ ] docker-compose está instalado
- [ ] Usuario tiene permisos para Docker
- [ ] Puertos 8000 y 5173 están libres
- [ ] Credenciales de Google OAuth están configuradas
- [ ] URLs de redirección están configuradas en Google Cloud Console
- [ ] Servicios están ejecutándose correctamente

## 🔍 Comandos de Diagnóstico

```bash
# Verificar estado de servicios
sudo docker-compose ps

# Verificar recursos del sistema
sudo docker stats

# Verificar redes Docker
sudo docker network ls

# Verificar volúmenes
sudo docker volume ls
```

## 📞 URLs de Acceso

Una vez que los servicios estén funcionando:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Login**: http://localhost:8000/login

## 🆘 Si Nada Funciona

1. **Reiniciar Docker**:
   ```bash
   sudo systemctl restart docker
   ```

2. **Reiniciar el sistema**:
   ```bash
   sudo reboot
   ```

3. **Verificar espacio en disco**:
   ```bash
   df -h
   ```

4. **Verificar memoria disponible**:
   ```bash
   free -h
   ``` 