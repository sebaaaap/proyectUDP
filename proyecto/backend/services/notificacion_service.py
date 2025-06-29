import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import Optional, List
from datetime import datetime
import os
from jinja2 import Environment, FileSystemLoader
from pathlib import Path

logger = logging.getLogger(__name__)

class NotificacionService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_email = os.getenv("SMTP_EMAIL", "proyectUDP1@gmail.com")
        self.smtp_password = os.getenv("SMTP_PASSWORD", "svnfbngxjnvcuorl")
        
        # Configurar Jinja2 para templates
        template_dir = Path(__file__).parent.parent / "templates" / "emails"
        self.jinja_env = Environment(loader=FileSystemLoader(template_dir))
    
    def _enviar_correo_base(self, destinatario: str, asunto: str, cuerpo_html: str, cuerpo_texto: Optional[str] = None):
        """Método base para enviar correos"""
        try:
            mensaje = MIMEMultipart("alternative")
            mensaje["From"] = self.smtp_email
            mensaje["To"] = destinatario
            mensaje["Subject"] = asunto
            
            # Agregar versión texto si se proporciona
            if cuerpo_texto:
                parte_texto = MIMEText(cuerpo_texto, "plain", "utf-8")
                mensaje.attach(parte_texto)
            
            # Agregar versión HTML
            parte_html = MIMEText(cuerpo_html, "html", "utf-8")
            mensaje.attach(parte_html)
            
            # Enviar correo
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_email, self.smtp_password)
                server.sendmail(self.smtp_email, destinatario, mensaje.as_string())
            
            logger.info(f"✅ Correo enviado exitosamente a {destinatario}: {asunto}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error al enviar correo a {destinatario}: {str(e)}")
            return False
    
    def notificar_cuenta_creada(self, nombre: str, apellido: str, email: str, rol: str):
        """Notifica cuando se crea una cuenta exitosamente"""
        try:
            template = self.jinja_env.get_template("cuenta_creada.html")
            cuerpo_html = template.render(
                nombre=nombre,
                apellido=apellido,
                rol=rol,
                fecha=datetime.now().strftime("%d/%m/%Y %H:%M"),
                url_plataforma="http://localhost:5173"
            )
            
            asunto = f"¡Bienvenido a la Plataforma de Proyectos UDP, {nombre}!"
            
            return self._enviar_correo_base(email, asunto, cuerpo_html)
            
        except Exception as e:
            logger.error(f"Error al notificar cuenta creada: {str(e)}")
            return False
    
    def notificar_proyecto_aprobado(self, estudiante_email: str, estudiante_nombre: str, 
                                  titulo_proyecto: str, profesor_nombre: str, comentarios: Optional[str] = None):
        """Notifica cuando un proyecto es aprobado"""
        try:
            template = self.jinja_env.get_template("proyecto_aprobado.html")
            cuerpo_html = template.render(
                estudiante_nombre=estudiante_nombre,
                titulo_proyecto=titulo_proyecto,
                profesor_nombre=profesor_nombre,
                comentarios=comentarios,
                fecha=datetime.now().strftime("%d/%m/%Y %H:%M"),
                url_proyecto="http://localhost:5173/mis-proyectos"
            )
            
            asunto = f"🎉 ¡Tu proyecto '{titulo_proyecto}' ha sido APROBADO!"
            
            return self._enviar_correo_base(estudiante_email, asunto, cuerpo_html)
            
        except Exception as e:
            logger.error(f"Error al notificar proyecto aprobado: {str(e)}")
            return False
    
    def notificar_proyecto_rechazado(self, estudiante_email: str, estudiante_nombre: str,
                                   titulo_proyecto: str, profesor_nombre: str, comentarios: Optional[str] = None):
        """Notifica cuando un proyecto es rechazado"""
        try:
            template = self.jinja_env.get_template("proyecto_rechazado.html")
            cuerpo_html = template.render(
                estudiante_nombre=estudiante_nombre,
                titulo_proyecto=titulo_proyecto,
                profesor_nombre=profesor_nombre,
                comentarios=comentarios,
                fecha=datetime.now().strftime("%d/%m/%Y %H:%M"),
                url_proyectos="http://localhost:5173/crear-proyecto"
            )
            
            asunto = f"📝 Proyecto '{titulo_proyecto}' requiere modificaciones"
            
            return self._enviar_correo_base(estudiante_email, asunto, cuerpo_html)
            
        except Exception as e:
            logger.error(f"Error al notificar proyecto rechazado: {str(e)}")
            return False
    
    def notificar_postulacion_aceptada(self, estudiante_email: str, estudiante_nombre: str,
                                     titulo_proyecto: str, creador_proyecto: str):
        """Notifica cuando una postulación es aceptada"""
        try:
            template = self.jinja_env.get_template("postulacion_aceptada.html")
            cuerpo_html = template.render(
                estudiante_nombre=estudiante_nombre,
                titulo_proyecto=titulo_proyecto,
                creador_proyecto=creador_proyecto,
                fecha=datetime.now().strftime("%d/%m/%Y %H:%M"),
                url_proyecto="http://localhost:5173/mis-proyectos"
            )
            
            asunto = f"🎉 ¡Tu postulación al proyecto '{titulo_proyecto}' fue ACEPTADA!"
            
            return self._enviar_correo_base(estudiante_email, asunto, cuerpo_html)
            
        except Exception as e:
            logger.error(f"Error al notificar postulación aceptada: {str(e)}")
            return False
    
    def notificar_postulacion_rechazada(self, estudiante_email: str, estudiante_nombre: str,
                                      titulo_proyecto: str, creador_proyecto: str, motivo: Optional[str] = None):
        """Notifica cuando una postulación es rechazada"""
        try:
            template = self.jinja_env.get_template("postulacion_rechazada.html")
            cuerpo_html = template.render(
                estudiante_nombre=estudiante_nombre,
                titulo_proyecto=titulo_proyecto,
                creador_proyecto=creador_proyecto,
                motivo=motivo,
                fecha=datetime.now().strftime("%d/%m/%Y %H:%M"),
                url_proyectos="http://localhost:5173/proyectos-disponibles"
            )
            
            asunto = f"📋 Actualización sobre tu postulación al proyecto '{titulo_proyecto}'"
            
            return self._enviar_correo_base(estudiante_email, asunto, cuerpo_html)
            
        except Exception as e:
            logger.error(f"Error al notificar postulación rechazada: {str(e)}")
            return False
    
    def notificar_nueva_postulacion_al_creador(self, creador_email: str, creador_nombre: str,
                                             titulo_proyecto: str, postulante_nombre: str, motivacion: str):
        """Notifica al creador del proyecto sobre una nueva postulación"""
        try:
            template = self.jinja_env.get_template("nueva_postulacion.html")
            cuerpo_html = template.render(
                creador_nombre=creador_nombre,
                titulo_proyecto=titulo_proyecto,
                postulante_nombre=postulante_nombre,
                motivacion=motivacion,
                fecha=datetime.now().strftime("%d/%m/%Y %H:%M"),
                url_postulaciones="http://localhost:5173/mis-proyectos"
            )
            
            asunto = f"📬 Nueva postulación para tu proyecto '{titulo_proyecto}'"
            
            return self._enviar_correo_base(creador_email, asunto, cuerpo_html)
            
        except Exception as e:
            logger.error(f"Error al notificar nueva postulación: {str(e)}")
            return False

# Instancia global del servicio
notificacion_service = NotificacionService()
