FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instala dependencias del sistema necesarias para psycopg2 y otras
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && apt-get clean

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Prepara carpeta de archivos
RUN mkdir -p /app/uploads

COPY . .

# Crear directorio para uploads si no existe
RUN mkdir -p uploads

# Ejecutar el script de seed al iniciar
CMD python scripts/seed_carreras.py && uvicorn main:app --host 0.0.0.0 --port 8000 --reload
