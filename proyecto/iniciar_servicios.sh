#!/bin/bash

echo "🚀 Iniciando servicios del Proyecto UDP..."
echo "=========================================="

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar si docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose no está instalado. Por favor instala docker-compose primero."
    exit 1
fi

# Verificar permisos de Docker
if ! docker ps &> /dev/null; then
    echo "⚠️  Problema de permisos con Docker. Intentando con sudo..."
    sudo docker ps &> /dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Docker funciona con sudo"
        DOCKER_CMD="sudo docker"
        COMPOSE_CMD="sudo docker-compose"
    else
        echo "❌ No se puede acceder a Docker. Verifica la instalación."
        exit 1
    fi
else
    echo "✅ Docker funciona correctamente"
    DOCKER_CMD="docker"
    COMPOSE_CMD="docker-compose"
fi

# Detener servicios existentes
echo "🛑 Deteniendo servicios existentes..."
$COMPOSE_CMD down

# Limpiar contenedores huérfanos
echo "🧹 Limpiando contenedores huérfanos..."
$DOCKER_CMD system prune -f

# Construir e iniciar servicios
echo "🔨 Construyendo e iniciando servicios..."
$COMPOSE_CMD up --build -d

# Verificar estado de los servicios
echo "📊 Verificando estado de los servicios..."
sleep 10

$COMPOSE_CMD ps

echo ""
echo "🌐 URLs de acceso:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "🔍 Para ver logs: $COMPOSE_CMD logs -f"
echo "🛑 Para detener: $COMPOSE_CMD down" 