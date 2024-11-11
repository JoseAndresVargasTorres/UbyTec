from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, Text
from database import Base


# Modelos
class Administrador(Base):
    __tablename__ = 'administrador'
    cedula = Column(String(20), primary_key=True)
    usuario = Column(String(50), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    nombre = Column(String(100), nullable=False)
    apellido1 = Column(String(100), nullable=False)
    apellido2 = Column(String(100))


class Direccion_Administrador(Base):
    __tablename__ = 'direccionesadministrador'
    id = Column(Integer, primary_key=True , autoincrement=True)  # Agrega un ID como clave primaria
    provincia = Column(String(100), nullable=False)
    canton = Column(String(100), nullable=False)
    distrito = Column(String(100), nullable=False)
    id_admin = Column(String(20), ForeignKey('administrador.cedula'), nullable=False)

class Telefonos_Administrador(Base):
    __tablename__ = 'telefonosadministrador'
    id = Column(Integer, primary_key=True , autoincrement=True)  # Agrega un ID como clave primaria
    telefono = Column(String(50), unique=True, nullable=False)
    cedula_admin = Column(String(20), ForeignKey('administrador.cedula'), nullable=False)

# class ComercioAfiliado(Base):
#     __tablename__ = 'comercio_afiliado'
#     cedula_juridica = Column(String(20), primary_key=True)
#     nombre = Column(String(100), nullable=False)
#     correo = Column(String(100), nullable=False)
#     SINPE = Column(String(50))
#     id_tipo = Column(Integer, ForeignKey('tipo_comercio.ID'), nullable=False)
#     cedula_admin = Column(String(20), ForeignKey('administrador.cedula'), nullable=False)

# class TipoComercio(Base):
#     __tablename__ = 'tipo_comercio'
#     ID = Column(Integer, primary_key=True, autoincrement=True)
#     nombre = Column(String(100), nullable=False)

# class Producto(Base):
#     __tablename__ = 'producto'
#     ID = Column(Integer, primary_key=True, autoincrement=True)
#     nombre = Column(String(100), nullable=False)
#     categoria = Column(String(50))
#     precio = Column(Numeric(10, 2), nullable=False)

# class Pedido(Base):
#     __tablename__ = 'pedido'
#     num_pedido = Column(Integer, primary_key=True, autoincrement=True)
#     nombre = Column(String(100))
#     estado = Column(String(20), nullable=False)
#     monto_total = Column(Numeric(10, 2), nullable=False)
#     id_repartidor = Column(Integer, ForeignKey('repartidor.ID'))
#     cedula_comercio = Column(String(20), ForeignKey('comercio_afiliado.cedula_juridica'))

# class Repartidor(Base):
#     __tablename__ = 'repartidor'
#     ID = Column(Integer, primary_key=True, autoincrement=True)
#     usuario = Column(String(50), unique=True, nullable=False)
#     nombre = Column(String(100), nullable=False)
#     apellido1 = Column(String(100), nullable=False)
#     apellido2 = Column(String(100))
#     correo = Column(String(100), nullable=False)

# class ProductosPedidos(Base):
#     __tablename__ = 'productos_pedidos'
#     num_pedido = Column(Integer, ForeignKey('pedido.num_pedido'), primary_key=True)
#     id_producto = Column(Integer, ForeignKey('producto.ID'), primary_key=True)

# class PedidosCliente(Base):
#     __tablename__ = 'pedidos_cliente'
#     num_pedido = Column(Integer, ForeignKey('pedido.num_pedido'), primary_key=True)
#     cedula_cliente = Column(String(20), primary_key=True)
#     feedback = Column(Text)
