from fastapi import FastAPI,HTTPException,Depends,status
from pydantic import BaseModel,Field, EmailStr
from typing import Annotated,Optional,List
import models
from database import engine,SessionLocal
from sqlalchemy.orm import Session
from decimal import Decimal
from fastapi.middleware.cors import CORSMiddleware
from flask_cors import CORS


app = FastAPI()
models.Base.metadata.create_all(bind=engine)

# Configura los orígenes permitidos para CORS
origins = [
    "http://localhost:4200",  # URL de tu aplicación Angular
]


# Agrega el middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permitir solo los orígenes especificados
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Permitir todos los headers
)



# Modelos de validación Gestión de administradores
class AdministradorBase(BaseModel):
    cedula: str = Field(..., max_length=20)
    usuario: str = Field(..., max_length=50)
    password: str = Field(..., max_length=100)
    nombre: str = Field(..., max_length=100)
    apellido1: str = Field(..., max_length=100)
    apellido2: Optional[str] = Field(None, max_length=100)


class DireccionesAdministradorBase(BaseModel):
    id_admin: str = Field(..., max_length=20)
    provincia: str = Field(..., max_length=100)
    canton: str = Field(..., max_length=100)
    distrito: str = Field(..., max_length=100)

class TelefonosAdministradorBase(BaseModel):
    telefono: str = Field(..., max_length=20)
    cedula_admin: str = Field(..., max_length=100)

# class ComercioAfiliadoBase(BaseModel):
#     cedula_juridica: str = Field(..., max_length=20)
#     nombre: str = Field(..., max_length=100)
#     correo: EmailStr
#     SINPE: Optional[str] = Field(None, max_length=50)
#     id_tipo: int
#     cedula_admin: str = Field(..., max_length=20)

# class TipoComercioBase(BaseModel):
#     ID: Optional[int]
#     nombre: str = Field(..., max_length=100)

# class ProductoBase(BaseModel):
#     ID: Optional[int]
#     nombre: str = Field(..., max_length=100)
#     categoria: Optional[str] = Field(None, max_length=50)
#     precio: Decimal = Field(..., gt=0, max_digits=10, decimal_places=2)

# class PedidoBase(BaseModel):
#     num_pedido: Optional[int]
#     nombre: Optional[str] = Field(None, max_length=100)
#     estado: str = Field(..., max_length=20)
#     monto_total: Decimal = Field(..., gt=0, max_digits=10, decimal_places=2)
#     id_repartidor: Optional[int]
#     cedula_comercio: Optional[str] = Field(None, max_length=20)

# class RepartidorBase(BaseModel):
#     ID: Optional[int]
#     usuario: str = Field(..., max_length=50)
#     nombre: str = Field(..., max_length=100)
#     apellido1: str = Field(..., max_length=100)
#     apellido2: Optional[str] = Field(None, max_length=100)
#     correo: EmailStr

# class ProductosPedidosBase(BaseModel):
#     num_pedido: int
#     id_producto: int

# class PedidosClienteBase(BaseModel):
#     num_pedido: int
#     cedula_cliente: str = Field(..., max_length=20)
#     feedback: Optional[str]


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()




@app.post("/admin/", status_code=status.HTTP_201_CREATED)
async def create_admin(admin: AdministradorBase, db: Session = Depends(get_db)):
    # Crear un nuevo objeto de administrador
    new_admin = models.Administrador(
        cedula=admin.cedula,
        usuario=admin.usuario,
        password=admin.password,
        nombre=admin.nombre,
        apellido1=admin.apellido1,
        apellido2=admin.apellido2
    )

    # Agregar a la sesión y confirmar los cambios
    db.add(new_admin)
    try:
        db.commit()
        db.refresh(new_admin)
    except Exception as e:
        db.rollback()  # Revertir si hay un error
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el administrador")

    return new_admin


@app.post("/direccionadmin/", status_code=status.HTTP_201_CREATED)
async def create_direccion(direccion: DireccionesAdministradorBase, db: Session = Depends(get_db)):
    # Crear un nuevo objeto de dirección
    new_direccion = models.Direccion_Administrador(
        id_admin=direccion.id_admin,
        provincia=direccion.provincia,
        canton=direccion.canton,
        distrito=direccion.distrito
    )

    # Agregar a la sesión y confirmar los cambios
    db.add(new_direccion)
    try:
        db.commit()
        db.refresh(new_direccion)
    except Exception as e:
        db.rollback()  # Revertir si hay un error
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear la dirección")

    return new_direccion

@app.post("/telefonosadmin/", status_code=status.HTTP_201_CREATED)
async def create_telefono(telefono: TelefonosAdministradorBase, db: Session = Depends(get_db)):
    # Crear un nuevo objeto de teléfono
    new_telefono = models.Telefonos_Administrador(
        cedula_admin=telefono.cedula_admin,
        telefono=telefono.telefono
    )

    # Agregar a la sesión y confirmar los cambios
    db.add(new_telefono)
    try:
        db.commit()
        db.refresh(new_telefono)
    except Exception as e:
        db.rollback()  # Revertir si hay un error
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el teléfono")

    return new_telefono
# @app.get("/admin/", response_model=List[AdministradorBase])
# async def get_administradores(db: Session = Depends(get_db)):
#     # Consulta para obtener todos los administradores de la base de datos
#     administradores = db.query(models.Administrador).all()
#     return administradores
