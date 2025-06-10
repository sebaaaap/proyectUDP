# import firebase_admin
# from firebase_admin import credentials, storage
# import uuid
# import os
# from dotenv import load_dotenv
# from datetime import datetime
# # Cargar variables de entorno
# load_dotenv()

# from datetime import timedelta # Asegúrate de importar timedelta

# # Cargar variables de entorno (puede no ser necesario si docker-compose las establece todas)
# load_dotenv()

# # Variable global para el cliente de Firebase Storage
# storage_client = None

# # Inicializar Firebase (solo una vez en toda la aplicación)
# if not firebase_admin._apps:
#     try:
#         print(">>> Intentando inicializar Firebase Admin SDK...") # Debug
#         cred = credentials.Certificate("/app/llave.json")
#         firebase_admin.initialize_app(cred, {
#             'storageBucket': os.getenv('FIREBASE_BUCKET')
#         })
#         print(">>> Firebase Admin SDK inicializado exitosamente.") # Debug
#         # Obtén el cliente de Storage aquí después de la inicialización exitosa
#         storage_client = storage.bucket().client # Guarda el cliente si la inicialización fue bien
#         print(f">>> Cliente de Storage obtenido. Bucket inicializado con: {os.getenv('FIREBASE_BUCKET')}") # Debug
#     except Exception as e:
#         print(f">>> ERROR FATAL al inicializar Firebase Admin SDK: {e}") # Debug
#         # Re-lanzar la excepción para que se vea claramente al inicio
#         raise

# # >>>>>> CÓDIGO DE PRUEBA TEMPORAL <<<<<<
# print(">>> Iniciando prueba directa con google-cloud-storage...")
# try:
#     from google.cloud import storage as google_storage # Importa con alias para no colisionar con firebase_admin.storage
#     import json

#     # Lee el contenido del archivo de la llave de servicio
#     with open("/app/llave.json", 'r') as f:
#         key_data = json.load(f)

#     # >>> Debug: Imprime parte del email de la cuenta para verificar
#     if 'client_email' in key_data:
#         print(f">>> La llave cargada parece ser para la cuenta: {key_data['client_email']}")
#     else:
#         print(">>> Advertencia: La llave cargada no tiene client_email.")


#     # Intenta crear un cliente de Storage usando *explícitamente* la llave
#     storage_client_direct = google_storage.Client.from_service_account_json("/app/llave.json")
#     print(">>> Cliente de google-cloud-storage creado exitosamente con la llave.")

#     # Intenta obtener una referencia al bucket usando este cliente directo
#     bucket_name = os.getenv('FIREBASE_BUCKET') # Asegúrate de usar el nombre correcto
#     print(f">>> Intentando obtener bucket '{bucket_name}' con cliente directo...")

#     direct_bucket = storage_client_direct.get_bucket(bucket_name)
#     print(f">>> ¡Éxito! Bucket '{direct_bucket.name}' obtenido con cliente directo. Location: {direct_bucket.location}")

#     # Opcional: Intenta listar un prefijo para confirmar acceso (esto hará una llamada API real)
#     # blobs = list(direct_bucket.list_blobs(prefix='archivos_proyectos/', max_results=1))
#     # print(f">>> Se pudo listar {len(blobs)} blobs en el prefijo 'archivos_proyectos/'.")

# except Exception as e:
#     print(f">>> ERROR en la prueba directa con google-cloud-storage: {e}")

# print(">>> Fin de la prueba directa.")
# # >>>>>> FIN DEL CÓDIGO DE PRUEBA TEMPORAL <<<<<

# def subir_archivo_a_firebase(nombre_archivo: str, file_data: bytes, content_type: str) -> str:
#     try:
#         # Verificar si el cliente de storage se inicializó correctamente
#         if storage_client is None:
#              raise Exception("El cliente de Firebase Storage no se inicializó correctamente.") # Debería haber fallado antes, pero por si acaso

#         print(f">>> Subiendo archivo: {nombre_archivo} ({content_type})") # Debug

#         # Usa el cliente para obtener el bucket
#         # ¡Aquí está el punto clave de depuración! ¿Podemos obtener el bucket?
#         try:
#             bucket = storage.bucket()
#             print(f">>> Obtenido objeto bucket. Nombre: {bucket.name}") # Debug: Confirma el nombre del bucket que el SDK *cree* que tiene
#         except Exception as e:
#              print(f">>> ERROR al obtener el objeto bucket: {e}") # Debug
#              raise Exception(f"Error al obtener bucket de Storage: {str(e)}") # Re-lanzar con más contexto


#         nombre_unico = f"archivos_proyectos/{uuid.uuid4()}_{nombre_archivo}"
#         blob = bucket.blob(nombre_unico)

#         print(f">>> Intentando subir datos al blob: {nombre_unico}") # Debug
#         blob.upload_from_string(
#             file_data,
#             content_type=content_type,
#             timeout=300  # 5 minutos para archivos grandes
#         )
#         print(f">>> Archivo {nombre_unico} subido exitosamente.") # Debug

#         # Generar URL con token de acceso
#         # Asegúrate de importar timedelta
#         url = blob.generate_signed_url(
#             expiration=timedelta(days=365), # Usar timedelta aquí
#             method='GET'
#         )
#         print(f">>> URL firmada generada: {url}") # Debug

#         return url
#     except Exception as e:
#         # Registra o maneja el error aquí antes de re-lanzarlo
#         # Este print ya lo tienes, es el que vemos en los logs
#         print(f">>> Error al subir archivo a Firebase Storage: {e}")
#         raise Exception(f"Error Firebase: {str(e)}")