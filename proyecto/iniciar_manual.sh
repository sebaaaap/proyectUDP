#!/bin/bash

echo "🚀 Inicio Manual de Servicios - Proyecto UDP"
echo "============================================="

# Función para mostrar errores
error_exit() {
    echo "❌ ERROR: $1"
    exit 1
}

# Función para mostrar éxito
success_msg() {
    echo "✅ $1"
}

# 1. Verificar Docker
echo "1. Verificando Docker..."
if ! sudo docker --version &> /dev/null; then
    error_exit "Docker no está instalado"
fi
success_msg "Docker está instalado"

# 2. Verificar docker-compose
echo "2. Verificando docker-compose..."
if ! sudo docker-compose --version &> /dev/null; then
    error_exit "docker-compose no está instalado"
fi
success_msg "docker-compose está instalado"

# 3. Detener servicios existentes
echo "3. Deteniendo servicios existentes..."
sudo docker-compose down
success_msg "Servicios detenidos"

# 4. Limpiar recursos
echo "4. Limpiando recursos..."
sudo docker system prune -f
success_msg "Recursos limpiados"

# 5. Verificar archivos de configuración
echo "5. Verificando archivos de configuración..."
if [ ! -f "docker-compose.yml" ]; then
    error_exit "docker-compose.yml no encontrado"
fi
if [ ! -f "backend/main.py" ]; then
    error_exit "backend/main.py no encontrado"
fi
success_msg "Archivos de configuración encontrados"

# 6. Construir e iniciar servicios
echo "6. Construyendo e iniciando servicios..."
sudo docker-compose up --build -d
if [ $? -eq 0 ]; then
    success_msg "Servicios iniciados correctamente"
else
    error_exit "Error al iniciar servicios"
fi

# 7. Esperar a que los servicios estén listos
echo "7. Esperando a que los servicios estén listos..."
sleep 15

# 8. Verificar estado
echo "8. Verificando estado de servicios..."
sudo docker-compose ps

# 9. Verificar puertos
echo "9. Verificando puertos..."
echo "Puerto 8000 (Backend):"
sudo netstat -tulpn | grep :8000 || echo "   No está en uso"
echo "Puerto 5173 (Frontend):"
sudo netstat -tulpn | grep :5173 || echo "   No está en uso"

# 10. Mostrar logs del backend
echo "10. Logs del backend:"
sudo docker-compose logs --tail=10 backend

echo ""
echo "🎉 Proceso completado!"
echo ""
echo "🌐 URLs de acceso:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "🔍 Para ver logs en tiempo real:"
echo "   sudo docker-compose logs -f"
echo ""
echo "🛑 Para detener servicios:"
echo "   sudo docker-compose down" 