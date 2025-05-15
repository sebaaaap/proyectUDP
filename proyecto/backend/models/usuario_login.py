import enum
from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SqlEnum, UniqueConstraint
from database.db import Base

class TipoUsuarioEnum(str, enum.Enum):
    estudiante = "estudiante"
    profesor = "profesor"

class UsuarioLogin(Base):
    __tablename__ = "usuarios_login"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    tipo = Column(SqlEnum(TipoUsuarioEnum), nullable=False)
    id_referencia = Column(Integer, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

    __table_args__ = (
        UniqueConstraint('tipo', 'id_referencia', name='uq_tipo_idref'),
    )
