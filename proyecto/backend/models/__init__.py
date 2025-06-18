# # para importar modelos mas facil
# from .estudiante import Estudiante
# from .profesor import Profesor
# from .proyecto import Proyecto
# from .participacion import Participacion
# from .evaluacion import Evaluacion
# from .cfg_equivalencias import CFGEquivalencia
# from .archivos_proyecto import ArchivoProyecto
# # from .usuario_login import UsuarioLogin

from .user_model import Usuario, RolEnum, Estudiante, Profesor
from .proyecto_model import Proyecto, EstadoProyectoDBEnum
from .postulacion_model import Postulacion, EstadoPostulacionEnum
from .carreras_model import Carrera
from .correoprofe_model import CorreoProfesor
# from .archivos_proyecto import ArchivoProyecto
# from .evaluacion_model import Evaluacion
# from .cfg_equivalencias import CFGEquivalencia
# from .participacion_model import Participacion, EstadoParticipacionEnum

