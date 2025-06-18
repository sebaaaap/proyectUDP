import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = "proyectUDP@gmail.com"  
SMTP_PASSWORD = "utzkuhzxpcylfgya" 

def enviar_correo(destinatario, asunto, cuerpo):
    mensaje = MIMEMultipart()
    mensaje["From"] = SMTP_EMAIL
    mensaje["To"] = destinatario
    mensaje["Subject"] = asunto

    mensaje.attach(MIMEText(cuerpo, "plain"))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.sendmail(SMTP_EMAIL, destinatario, mensaje.as_string())
            logger.info(f"Correo enviado exitosamente a {destinatario}")
    except Exception as e:
        logger.error(f"Error al enviar correo a {destinatario}: {e}")
        raise