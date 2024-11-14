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


@app.get("/admin/", response_model=List[AdministradorBase])
async def get_administradores(db: Session = Depends(get_db)):
     # Consulta para obtener todos los administradores de la base de datos
     administradores = db.query(models.Administrador).all()
     return administradores

@app.get("/telefonosadmin/", response_model=List[TelefonosAdministradorBase])
async def get_administradores(db: Session = Depends(get_db)):
     # Consulta para obtener todos los administradores de la base de datos
     telefonosadmin = db.query(models.Telefonos_Administrador).all()
     return telefonosadmin


@app.get("/direccionadmin/", response_model=List[DireccionesAdministradorBase])
async def get_administradores(db: Session = Depends(get_db)):
     # Consulta para obtener todos los administradores de la base de datos
     telefonosadmin = db.query(models.Direccion_Administrador).all()
     return telefonosadmin


@app.put("/admin/{id_admin}", response_model=AdministradorBase)
async def update_admin(id_admin: str, admin: AdministradorBase, db: Session = Depends(get_db)):
    db_admin = db.query(models.Administrador).filter(models.Administrador.cedula == id_admin).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador no encontrado")

    db_admin.usuario = admin.usuario
    db_admin.password = admin.password
    db_admin.nombre = admin.nombre
    db_admin.apellido1 = admin.apellido1
    db_admin.apellido2 = admin.apellido2

    db.commit()
    db.refresh(db_admin)
    return db_admin


@app.put("/direccionadmin/{id_admin}", response_model=DireccionesAdministradorBase)
async def update_direccion(id_admin: str, direccion: DireccionesAdministradorBase, db: Session = Depends(get_db)):
    db_direccion = db.query(models.Direccion_Administrador).filter(models.Direccion_Administrador.id_admin == id_admin).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")

    db_direccion.provincia = direccion.provincia
    db_direccion.canton = direccion.canton
    db_direccion.distrito = direccion.distrito

    db.commit()
    db.refresh(db_direccion)
    return db_direccion


@app.put("/telefonosadmin/{id_admin}", response_model=List[TelefonosAdministradorBase])
async def update_telefono(id_admin: str, telefonos: List[TelefonosAdministradorBase], db: Session = Depends(get_db)):
    # Recuperar los teléfonos actuales asociados a este administrador
    db_telefonos = db.query(models.Telefonos_Administrador).filter(models.Telefonos_Administrador.cedula_admin == id_admin).all()

    # Si no se encuentran teléfonos, lanzar error
    if not db_telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teléfonos no encontrados")

    # Crear un conjunto con los números de teléfono recibidos para fácil búsqueda
    nuevos_telefonos = {telefono.telefono for telefono in telefonos}

    # Si recibimos menos teléfonos que los existentes, eliminamos los que ya no están en la lista
    if len(telefonos) < len(db_telefonos):
        for db_telefono in db_telefonos:
            if db_telefono.telefono not in nuevos_telefonos:
                db.delete(db_telefono)

    # Actualizar los teléfonos existentes y agregar nuevos si es necesario
    telefonos_actualizados = []
    for telefono in telefonos:
        # Buscar si el teléfono ya existe
        db_telefono = next((t for t in db_telefonos if t.telefono == telefono.telefono), None)
        if db_telefono:
            # Si existe, lo actualizamos (aunque en este caso no hay cambios)
            telefonos_actualizados.append(db_telefono)
        else:
            # Si no existe, creamos uno nuevo
            new_telefono = models.Telefonos_Administrador(
                cedula_admin=id_admin,
                telefono=telefono.telefono
            )
            db.add(new_telefono)
            telefonos_actualizados.append(new_telefono)

    db.commit()

    # Refrescar todos los teléfonos actualizados
    for telefono in telefonos_actualizados:
        db.refresh(telefono)

    return telefonos_actualizados


@app.get("/admin/{id_admin}", response_model=AdministradorBase)
async def get_admin(id_admin: str, db: Session = Depends(get_db)):
    # Consulta para obtener un administrador específico según la cédula
    db_admin = db.query(models.Administrador).filter(models.Administrador.cedula == id_admin).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador no encontrado")
    return db_admin


@app.get("/direccionadmin/{id_admin}", response_model=DireccionesAdministradorBase)
async def get_direccion_admin(id_admin: str, db: Session = Depends(get_db)):
    # Consulta para obtener la dirección asociada a un administrador específico según el ID
    db_direccion = db.query(models.Direccion_Administrador).filter(models.Direccion_Administrador.id_admin == id_admin).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")
    return db_direccion


@app.get("/telefonosadmin/{id_admin}", response_model=List[TelefonosAdministradorBase])
async def get_telefonos_admin(id_admin: str, db: Session = Depends(get_db)):
    # Consulta para obtener la lista de teléfonos asociados a un administrador específico
    db_telefonos = db.query(models.Telefonos_Administrador).filter(models.Telefonos_Administrador.cedula_admin == id_admin).all()
    if not db_telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teléfonos no encontrados")
    return db_telefonos


@app.delete("/admin/{id_admin}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_admin(id_admin: str, db: Session = Depends(get_db)):
    # Buscar el administrador por cédula
    db_admin = db.query(models.Administrador).filter(models.Administrador.cedula == id_admin).first()
    if db_admin is None:
        # Lanzar una excepción si el administrador no existe
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador no encontrado")

    # Eliminar el administrador de la base de datos
    db.delete(db_admin)
    db.commit()
    return {"detail": "Administrador eliminado exitosamente"}


# Método para eliminar todas las direcciones asociadas a un administrador
@app.delete("/direccionadmin/{id_admin}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_direcciones_admin(id_admin: str, db: Session = Depends(get_db)):
    # Buscar todas las direcciones asociadas al administrador
    direcciones = db.query(models.Direccion_Administrador).filter(models.Direccion_Administrador.id_admin == id_admin).all()

    if not direcciones:
        # Lanzar una excepción si no se encuentran direcciones
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron direcciones para el administrador")

    # Eliminar todas las direcciones encontradas
    for direccion in direcciones:
        db.delete(direccion)

    db.commit()  # Confirmar los cambios
    return {"detail": "Todas las direcciones del administrador han sido eliminadas exitosamente"}


# Método para eliminar todos los teléfonos asociados a un administrador
@app.delete("/telefonosadmin/{id_admin}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_telefonos_admin(id_admin: str, db: Session = Depends(get_db)):
    # Buscar todos los teléfonos asociados al administrador
    telefonos = db.query(models.Telefonos_Administrador).filter(models.Telefonos_Administrador.cedula_admin == id_admin).all()

    if not telefonos:
        # Lanzar una excepción si no se encuentran teléfonos
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron teléfonos para el administrador")

    # Eliminar todos los teléfonos encontrados
    for telefono in telefonos:
        db.delete(telefono)

    db.commit()  # Confirmar los cambios
    return {"detail": "Todos los teléfonos del administrador han sido eliminados exitosamente"}

