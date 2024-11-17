from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, Text
from database import Base

"""
Administradores de la app
"""
class AdministradorApp(Base):
    __tablename__ = 'administradorapp'
    cedula = Column(String(20), primary_key=True)
    usuario = Column(String(50), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    nombre = Column(String(100), nullable=False)
    apellido1 = Column(String(100), nullable=False)
    apellido2 = Column(String(100), nullable=False)

class Direccion_AdministradorApp(Base):
    __tablename__ = 'direccionesadministradorapp'
    id = Column(Integer, primary_key=True, autoincrement=True)
    provincia = Column(String(100), nullable=False)
    canton = Column(String(100), nullable=False)
    distrito = Column(String(100), nullable=False)
    id_admin = Column(String(20), ForeignKey('administradorapp.cedula'), nullable=False)

class Telefonos_AdministradorApp(Base):
    __tablename__ = 'telefonosadministradorapp'
    id = Column(Integer, primary_key=True, autoincrement=True)
    telefono = Column(String(50), unique=True, nullable=False)
    cedula_admin = Column(String(20), ForeignKey('administradorapp.cedula'), nullable=False)

"""
Administradores de Comercio
"""
class AdministradorComercio(Base):
    __tablename__ = 'administradorcomercio'
    cedula = Column(String(20), primary_key=True)
    usuario = Column(String(50), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    nombre = Column(String(100), nullable=False)
    apellido1 = Column(String(100), nullable=False)
    apellido2 = Column(String(100), nullable=False)

class Direccion_AdministradorComercio(Base):
    __tablename__ = 'direccionesadministradorcomercio'
    id = Column(Integer, primary_key=True, autoincrement=True)
    provincia = Column(String(100), nullable=False)
    canton = Column(String(100), nullable=False)
    distrito = Column(String(100), nullable=False)
    id_admin = Column(String(20), ForeignKey('administradorcomercio.cedula'), nullable=False)

class Telefonos_AdministradorComercio(Base):
    __tablename__ = 'telefonosadministradorcomercio'
    id = Column(Integer, primary_key=True, autoincrement=True)
    telefono = Column(String(50), unique=True, nullable=False)
    cedula_admin = Column(String(20), ForeignKey('administradorcomercio.cedula'), nullable=False)

"""
Comercios Afiliados
"""
class Comercio_afiliado(Base):
    __tablename__ = 'comercioafiliado'
    cedula_juridica = Column(String(20), primary_key=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), nullable=False)
    SINPE = Column(String(50), nullable=False)
    id_tipo = Column(Integer, ForeignKey('tipo_comercioafiliado.ID'), nullable=False)
    cedula_admin_comercio = Column(String(20), ForeignKey('administradorcomercio.cedula'), nullable=False)  # Cambiado para vincularlo con AdministradorComercio

class Direccion_Comercio(Base):
    __tablename__ = 'direccionescomercioafiliado'
    id = Column(Integer, primary_key=True, autoincrement=True)
    provincia = Column(String(100), nullable=False)
    canton = Column(String(100), nullable=False)
    distrito = Column(String(100), nullable=False)
    id_comercio = Column(String(20), ForeignKey('comercioafiliado.cedula_juridica'), nullable=False)

class Tipo_Comercio(Base):
    __tablename__ = 'tipo_comercioafiliado'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)

class Telefono_Comercio(Base):
    __tablename__ = 'telefonocomercioafiliado'
    id = Column(Integer, primary_key=True, autoincrement=True)
    telefono = Column(String(50), unique=True, nullable=False)
    cedula_comercio = Column(String(20), ForeignKey('comercioafiliado.cedula_juridica'), nullable=False)
