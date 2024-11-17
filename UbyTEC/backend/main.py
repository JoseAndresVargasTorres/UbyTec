from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, Field, EmailStr
from typing import Annotated, Optional, List
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from decimal import Decimal
from fastapi.middleware.cors import CORSMiddleware
from flask_cors import CORS
from insertlist import init_database

# Inicialización de la aplicación
app = FastAPI()

# Definición de tags para la documentación
tags_metadata = [
    {
        "name": "Administrador App",
        "description": "Operaciones relacionadas con administradores de la aplicación, incluyendo sus direcciones y teléfonos"
    },
    {
        "name": "Administrador Comercio",
        "description": "Operaciones relacionadas con administradores de comercios, incluyendo sus direcciones y teléfonos"
    },
    {
        "name": "Comercios Afiliados",
        "description": "Operaciones relacionadas con comercios afiliados, incluyendo sus direcciones y teléfonos"
    },
    {
        "name": "Tipos de Comercio",
        "description": "Gestión de los diferentes tipos de comercio disponibles"
    }
]

app.openapi_tags = tags_metadata

init_database()  # Inicializar la base de datos con datos de prueba
models.Base.metadata.create_all(bind=engine)

# Configuración de CORS
origins = [
    "http://localhost:4200",  # URL de la aplicación Angular
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#######################
# Modelos de Pydantic #
#######################

# Modelos para Administrador de App
class AdministradorAppBase(BaseModel):
    cedula: str = Field(..., max_length=20)
    usuario: str = Field(..., max_length=50)
    password: str = Field(..., max_length=100)
    nombre: str = Field(..., max_length=100)
    apellido1: str = Field(..., max_length=100)
    apellido2: str = Field(..., max_length=100)

class DireccionesAdministradorAppBase(BaseModel):
    id_admin: str = Field(..., max_length=20)
    provincia: str = Field(..., max_length=100)
    canton: str = Field(..., max_length=100)
    distrito: str = Field(..., max_length=100)

class TelefonosAdministradorAppBase(BaseModel):
    telefono: str = Field(..., max_length=20)
    cedula_admin: str = Field(..., max_length=100)

# Modelos para Administrador de Comercio
class AdministradorComercioBase(BaseModel):
    cedula: str = Field(..., max_length=20)
    usuario: str = Field(..., max_length=50)
    password: str = Field(..., max_length=100)
    nombre: str = Field(..., max_length=100)
    apellido1: str = Field(..., max_length=100)
    apellido2: str = Field(..., max_length=100)

class DireccionesAdministradorComercioBase(BaseModel):
    id_admin: str = Field(..., max_length=20)
    provincia: str = Field(..., max_length=100)
    canton: str = Field(..., max_length=100)
    distrito: str = Field(..., max_length=100)

class TelefonosAdministradorComercioBase(BaseModel):
    telefono: str = Field(..., max_length=20)
    cedula_admin: str = Field(..., max_length=100)

# Modelos para Comercio Afiliado
class ComercioAfiliadoBase(BaseModel):
    cedula_juridica: str = Field(..., max_length=20)
    nombre: str = Field(..., max_length=100)
    correo: EmailStr
    SINPE: str = Field(..., max_length=50)
    id_tipo: int
    cedula_admin_comercio: str = Field(..., max_length=20)  # Cambiado para reflejar la relación con AdminComercio

class DireccionesComercioBase(BaseModel):
    id_comercio: str = Field(..., max_length=20)
    provincia: str = Field(..., max_length=100)
    canton: str = Field(..., max_length=100)
    distrito: str = Field(..., max_length=100)

class TelefonosComercioAfiliadoBase(BaseModel):
    telefono: str = Field(..., max_length=20)
    cedula_comercio: str = Field(..., max_length=100)

# Modelo para Tipo de Comercio
class TipoComercioBase(BaseModel):
    ID: int
    nombre: str = Field(..., max_length=100)

# Configuración de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



################################
# Endpoints para Administrador App #
################################

# CREATE - Administrador App
@app.post("/adminapp/",
          response_model=AdministradorAppBase,
          status_code=status.HTTP_201_CREATED,
          tags=["Administrador App"],
          summary="Crear nuevo administrador de la aplicación",
          response_description="Administrador App creado exitosamente")
async def create_admin_app(admin: AdministradorAppBase, db: Session = Depends(get_db)):
    """Crea un nuevo administrador de la aplicación"""
    new_admin = models.AdministradorApp(
        cedula=admin.cedula,
        usuario=admin.usuario,
        password=admin.password,
        nombre=admin.nombre,
        apellido1=admin.apellido1,
        apellido2=admin.apellido2
    )
    db.add(new_admin)
    try:
        db.commit()
        db.refresh(new_admin)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el administrador")
    return new_admin

@app.post("/adminapp/direcciones/",
          status_code=status.HTTP_201_CREATED,
          tags=["Administrador App"])
async def create_direccion_admin_app(direccion: DireccionesAdministradorAppBase, db: Session = Depends(get_db)):
    """Crea una nueva dirección para un administrador de la aplicación"""
    new_direccion = models.Direccion_AdministradorApp(
        id_admin=direccion.id_admin,
        provincia=direccion.provincia,
        canton=direccion.canton,
        distrito=direccion.distrito
    )
    db.add(new_direccion)
    try:
        db.commit()
        db.refresh(new_direccion)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear la dirección")
    return new_direccion

@app.post("/adminapp/telefonos/",
          status_code=status.HTTP_201_CREATED,
          tags=["Administrador App"])
async def create_telefono_admin_app(telefono: TelefonosAdministradorAppBase, db: Session = Depends(get_db)):
    """Crea un nuevo teléfono para un administrador de la aplicación"""
    new_telefono = models.Telefonos_AdministradorApp(
        cedula_admin=telefono.cedula_admin,
        telefono=telefono.telefono
    )
    db.add(new_telefono)
    try:
        db.commit()
        db.refresh(new_telefono)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el teléfono")
    return new_telefono

# READ - Administrador App
@app.get("/adminapp/",
         response_model=List[AdministradorAppBase],
         tags=["Administrador App"])
async def get_admin_apps(db: Session = Depends(get_db)):
    """Obtiene todos los administradores de la aplicación"""
    return db.query(models.AdministradorApp).all()

@app.get("/adminapp/{id_admin}",
         response_model=AdministradorAppBase,
         tags=["Administrador App"])
async def get_admin_app(id_admin: str, db: Session = Depends(get_db)):
    """Obtiene un administrador de la aplicación específico por su ID"""
    db_admin = db.query(models.AdministradorApp).filter(models.AdministradorApp.cedula == id_admin).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador no encontrado")
    return db_admin

@app.get("/adminapp/telefonos/",
         response_model=List[TelefonosAdministradorAppBase],
         tags=["Administrador App"])
async def get_telefonos_admin_apps(db: Session = Depends(get_db)):
    """Obtiene todos los teléfonos de administradores de la aplicación"""
    return db.query(models.Telefonos_AdministradorApp).all()

@app.get("/adminapp/telefonos/{id_admin}",
         response_model=List[TelefonosAdministradorAppBase],
         tags=["Administrador App"])
async def get_telefonos_admin_app(id_admin: str, db: Session = Depends(get_db)):
    """Obtiene los teléfonos de un administrador de la aplicación específico"""
    db_telefonos = db.query(models.Telefonos_AdministradorApp).filter(
        models.Telefonos_AdministradorApp.cedula_admin == id_admin
    ).all()
    if not db_telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teléfonos no encontrados")
    return db_telefonos

@app.get("/adminapp/direcciones/",
         response_model=List[DireccionesAdministradorAppBase],
         tags=["Administrador App"])
async def get_direcciones_admin_apps(db: Session = Depends(get_db)):
    """Obtiene todas las direcciones de administradores de la aplicación"""
    return db.query(models.Direccion_AdministradorApp).all()

@app.get("/adminapp/direcciones/{id_admin}",
         response_model=DireccionesAdministradorAppBase,
         tags=["Administrador App"])
async def get_direccion_admin_app(id_admin: str, db: Session = Depends(get_db)):
    """Obtiene la dirección de un administrador de la aplicación específico"""
    db_direccion = db.query(models.Direccion_AdministradorApp).filter(
        models.Direccion_AdministradorApp.id_admin == id_admin
    ).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")
    return db_direccion

# UPDATE - Administrador App
@app.put("/adminapp/{id_admin}",
         response_model=AdministradorAppBase,
         tags=["Administrador App"])
async def update_admin_app(id_admin: str, admin: AdministradorAppBase, db: Session = Depends(get_db)):
    """Actualiza los datos de un administrador de la aplicación"""
    db_admin = db.query(models.AdministradorApp).filter(models.AdministradorApp.cedula == id_admin).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador no encontrado")

    for key, value in admin.dict().items():
        setattr(db_admin, key, value)

    db.commit()
    db.refresh(db_admin)
    return db_admin

@app.put("/adminapp/direcciones/{id_admin}",
         response_model=DireccionesAdministradorAppBase,
         tags=["Administrador App"])
async def update_direccion_admin_app(id_admin: str, direccion: DireccionesAdministradorAppBase, db: Session = Depends(get_db)):
    """Actualiza la dirección de un administrador de la aplicación"""
    db_direccion = db.query(models.Direccion_AdministradorApp).filter(
        models.Direccion_AdministradorApp.id_admin == id_admin
    ).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")

    db_direccion.provincia = direccion.provincia
    db_direccion.canton = direccion.canton
    db_direccion.distrito = direccion.distrito

    db.commit()
    db.refresh(db_direccion)
    return db_direccion

@app.put("/adminapp/telefonos/{id_admin}",
         response_model=List[TelefonosAdministradorAppBase],
         tags=["Administrador App"])
async def update_telefonos_admin_app(
    id_admin: str,
    telefonos: List[TelefonosAdministradorAppBase],
    db: Session = Depends(get_db)
):
    """
    Actualiza los teléfonos de un administrador de la aplicación.
    Maneja tres casos:
    1. Si se reciben menos teléfonos que los existentes: se mantienen/actualizan los recibidos y se eliminan los demás
    2. Si se recibe la misma cantidad: se actualizan todos
    3. Si se reciben más teléfonos: se actualizan los existentes y se crean los nuevos
    """
    try:
        # Verificar que el administrador existe
        admin = db.query(models.AdministradorApp).filter(
            models.AdministradorApp.cedula == id_admin
        ).first()
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Administrador no encontrado"
            )

        # Obtener teléfonos actuales
        db_telefonos = db.query(models.Telefonos_AdministradorApp).filter(
            models.Telefonos_AdministradorApp.cedula_admin == id_admin
        ).all()

        # Crear conjuntos para comparación
        nuevos_telefonos = {telefono.telefono for telefono in telefonos}
        telefonos_actuales = {telefono.telefono for telefono in db_telefonos}

        # Caso 1: Si hay menos teléfonos en la nueva lista
        if len(nuevos_telefonos) < len(telefonos_actuales):
            telefonos_a_eliminar = telefonos_actuales - nuevos_telefonos
            for db_telefono in db_telefonos:
                if db_telefono.telefono in telefonos_a_eliminar:
                    db.delete(db_telefono)

        # Casos 2 y 3: Actualizar existentes y/o crear nuevos
        telefonos_actualizados = []
        for telefono in telefonos:
            # Buscar si el teléfono ya existe
            telefono_existente = next(
                (t for t in db_telefonos if t.telefono == telefono.telefono),
                None
            )

            if telefono_existente:
                # Caso 2: Actualizar teléfono existente
                telefono_existente.cedula_admin = id_admin
                telefono_existente.telefono = telefono.telefono
                telefonos_actualizados.append(telefono_existente)
            else:
                # Caso 3: Crear nuevo teléfono
                nuevo_telefono = models.Telefonos_AdministradorApp(
                    cedula_admin=id_admin,
                    telefono=telefono.telefono
                )
                db.add(nuevo_telefono)
                telefonos_actualizados.append(nuevo_telefono)

        # Confirmar cambios
        db.commit()

        # Refrescar todos los registros
        for telefono in telefonos_actualizados:
            db.refresh(telefono)

        # Obtener y devolver la lista final actualizada
        telefonos_finales = db.query(models.Telefonos_AdministradorApp).filter(
            models.Telefonos_AdministradorApp.cedula_admin == id_admin
        ).all()

        return [
            TelefonosAdministradorAppBase(
                telefono=t.telefono,
                cedula_admin=t.cedula_admin
            ) for t in telefonos_finales
        ]

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al actualizar los teléfonos: {str(e)}"
        )


    
# DELETE - Administrador App
@app.delete("/adminapp/{id_admin}",
            status_code=status.HTTP_204_NO_CONTENT,
            tags=["Administrador App"])
async def delete_admin_app(id_admin: str, db: Session = Depends(get_db)):
    """Elimina un administrador de la aplicación"""
    db_admin = db.query(models.AdministradorApp).filter(models.AdministradorApp.cedula == id_admin).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador no encontrado")

    db.delete(db_admin)
    db.commit()
    return {"detail": "Administrador eliminado exitosamente"}

@app.delete("/adminapp/direcciones/{id_admin}",
            status_code=status.HTTP_204_NO_CONTENT,
            tags=["Administrador App"])
async def delete_direcciones_admin_app(id_admin: str, db: Session = Depends(get_db)):
    """Elimina las direcciones de un administrador de la aplicación"""
    direcciones = db.query(models.Direccion_AdministradorApp).filter(
        models.Direccion_AdministradorApp.id_admin == id_admin
    ).all()
    if not direcciones:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                          detail="No se encontraron direcciones para el administrador")

    for direccion in direcciones:
        db.delete(direccion)

    db.commit()
    return {"detail": "Todas las direcciones del administrador han sido eliminadas exitosamente"}

@app.delete("/adminapp/telefonos/{id_admin}",
            status_code=status.HTTP_204_NO_CONTENT,
            tags=["Administrador App"])
async def delete_telefonos_admin_app(id_admin: str, db: Session = Depends(get_db)):
    """Elimina los teléfonos de un administrador de la aplicación"""
    telefonos = db.query(models.Telefonos_AdministradorApp).filter(
        models.Telefonos_AdministradorApp.cedula_admin == id_admin
    ).all()
    if not telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                          detail="No se encontraron teléfonos para el administrador")

    for telefono in telefonos:
        db.delete(telefono)

    db.commit()
    return {"detail": "Todos los teléfonos del administrador han sido eliminados exitosamente"}


################################
# Endpoints para Administrador Comercio #
################################

# CREATE - Administrador Comercio
@app.post("/admincomercio/",
          response_model=AdministradorComercioBase,
          status_code=status.HTTP_201_CREATED,
          tags=["Administrador Comercio"],
          summary="Crear nuevo administrador de comercio",
          response_description="Administrador de Comercio creado exitosamente")
async def create_admin_comercio(admin: AdministradorComercioBase, db: Session = Depends(get_db)):
    """Crea un nuevo administrador de comercio"""
    new_admin = models.AdministradorComercio(
        cedula=admin.cedula,
        usuario=admin.usuario,
        password=admin.password,
        nombre=admin.nombre,
        apellido1=admin.apellido1,
        apellido2=admin.apellido2
    )
    db.add(new_admin)
    try:
        db.commit()
        db.refresh(new_admin)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el administrador de comercio")
    return new_admin

@app.post("/admincomercio/direccion/",
          status_code=status.HTTP_201_CREATED,
          tags=["Administrador Comercio"])
async def create_direccion_admin_comercio(direccion: DireccionesAdministradorComercioBase, db: Session = Depends(get_db)):
    """Crea una nueva dirección para un administrador de comercio"""
    new_direccion = models.Direccion_AdministradorComercio(
        id_admin=direccion.id_admin,
        provincia=direccion.provincia,
        canton=direccion.canton,
        distrito=direccion.distrito
    )
    db.add(new_direccion)
    try:
        db.commit()
        db.refresh(new_direccion)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear la dirección")
    return new_direccion

@app.post("/admincomercio/telefono/",
          status_code=status.HTTP_201_CREATED,
          tags=["Administrador Comercio"])
async def create_telefono_admin_comercio(telefono: TelefonosAdministradorComercioBase, db: Session = Depends(get_db)):
    """Crea un nuevo teléfono para un administrador de comercio"""
    new_telefono = models.Telefonos_AdministradorComercio(
        cedula_admin=telefono.cedula_admin,
        telefono=telefono.telefono
    )
    db.add(new_telefono)
    try:
        db.commit()
        db.refresh(new_telefono)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el teléfono")
    return new_telefono

# READ - Administrador Comercio
@app.get("/admincomercio/",
         response_model=List[AdministradorComercioBase],
         tags=["Administrador Comercio"])
async def get_admin_comercios(db: Session = Depends(get_db)):
    """Obtiene todos los administradores de comercio"""
    return db.query(models.AdministradorComercio).all()

@app.get("/admincomercio/{id_admin}",
         response_model=AdministradorComercioBase,
         tags=["Administrador Comercio"])
async def get_admin_comercio(id_admin: str, db: Session = Depends(get_db)):
    """Obtiene un administrador de comercio específico por su ID"""
    db_admin = db.query(models.AdministradorComercio).filter(models.AdministradorComercio.cedula == id_admin).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador de comercio no encontrado")
    return db_admin

@app.get("/admincomercio/telefonos/",
         response_model=List[TelefonosAdministradorComercioBase],
         tags=["Administrador Comercio"])
async def get_telefonos_admin_comercios(db: Session = Depends(get_db)):
    """Obtiene todos los teléfonos de administradores de comercio"""
    return db.query(models.Telefonos_AdministradorComercio).all()

@app.get("/admincomercio/telefonos/{id_admin}",
         response_model=List[TelefonosAdministradorComercioBase],
         tags=["Administrador Comercio"])
async def get_telefonos_admin_comercio(id_admin: str, db: Session = Depends(get_db)):
    """Obtiene los teléfonos de un administrador de comercio específico"""
    db_telefonos = db.query(models.Telefonos_AdministradorComercio).filter(
        models.Telefonos_AdministradorComercio.cedula_admin == id_admin
    ).all()
    if not db_telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teléfonos no encontrados")
    return db_telefonos

@app.get("/admincomercio/direcciones/",
         response_model=List[DireccionesAdministradorComercioBase],
         tags=["Administrador Comercio"])
async def get_direcciones_admin_comercios(db: Session = Depends(get_db)):
    """Obtiene todas las direcciones de administradores de comercio"""
    return db.query(models.Direccion_AdministradorComercio).all()

@app.get("/admincomercio/direccion/{id_admin}",
         response_model=DireccionesAdministradorComercioBase,
         tags=["Administrador Comercio"])
async def get_direccion_admin_comercio(id_admin: str, db: Session = Depends(get_db)):
    """Obtiene la dirección de un administrador de comercio específico"""
    db_direccion = db.query(models.Direccion_AdministradorComercio).filter(
        models.Direccion_AdministradorComercio.id_admin == id_admin
    ).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")
    return db_direccion

# UPDATE - Administrador Comercio
@app.put("/admincomercio/{id_admin}",
         response_model=AdministradorComercioBase,
         tags=["Administrador Comercio"])
async def update_admin_comercio(id_admin: str, admin: AdministradorComercioBase, db: Session = Depends(get_db)):
    """Actualiza los datos de un administrador de comercio"""
    db_admin = db.query(models.AdministradorComercio).filter(models.AdministradorComercio.cedula == id_admin).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador de comercio no encontrado")

    for key, value in admin.dict().items():
        setattr(db_admin, key, value)

    db.commit()
    db.refresh(db_admin)
    return db_admin

@app.put("/admincomercio/direccion/{id_admin}",
         response_model=DireccionesAdministradorComercioBase,
         tags=["Administrador Comercio"])
async def update_direccion_admin_comercio(id_admin: str, direccion: DireccionesAdministradorComercioBase, db: Session = Depends(get_db)):
    """Actualiza la dirección de un administrador de comercio"""
    db_direccion = db.query(models.Direccion_AdministradorComercio).filter(
        models.Direccion_AdministradorComercio.id_admin == id_admin
    ).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")

    db_direccion.provincia = direccion.provincia
    db_direccion.canton = direccion.canton
    db_direccion.distrito = direccion.distrito

    db.commit()
    db.refresh(db_direccion)
    return db_direccion

@app.put("/admincomercio/telefonos/{id_admin}",
         response_model=List[TelefonosAdministradorComercioBase],
         tags=["Administrador Comercio"])
async def update_telefonos_admin_comercio(id_admin: str, telefonos: List[TelefonosAdministradorComercioBase], db: Session = Depends(get_db)):
    """Actualiza los teléfonos de un administrador de comercio"""
    db_telefonos = db.query(models.Telefonos_AdministradorComercio).filter(
        models.Telefonos_AdministradorComercio.cedula_admin == id_admin
    ).all()
    if not db_telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teléfonos no encontrados")

    nuevos_telefonos = {telefono.telefono for telefono in telefonos}

    # Eliminar teléfonos que ya no están en la lista
    if len(telefonos) < len(db_telefonos):
        for db_telefono in db_telefonos:
            if db_telefono.telefono not in nuevos_telefonos:
                db.delete(db_telefono)

    # Actualizar o agregar nuevos teléfonos
    telefonos_actualizados = []
    for telefono in telefonos:
        db_telefono = next((t for t in db_telefonos if t.telefono == telefono.telefono), None)
        if db_telefono:
            telefonos_actualizados.append(db_telefono)
        else:
            new_telefono = models.Telefonos_AdministradorComercio(
                cedula_admin=id_admin,
                telefono=telefono.telefono
            )
            db.add(new_telefono)
            telefonos_actualizados.append(new_telefono)

    db.commit()
    for telefono in telefonos_actualizados:
        db.refresh(telefono)

    return telefonos_actualizados

# DELETE - Administrador Comercio
@app.delete("/admincomercio/{id_admin}",
            status_code=status.HTTP_204_NO_CONTENT,
            tags=["Administrador Comercio"])
async def delete_admin_comercio(id_admin: str, db: Session = Depends(get_db)):
    """Elimina un administrador de comercio"""
    db_admin = db.query(models.AdministradorComercio).filter(models.AdministradorComercio.cedula == id_admin).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador de comercio no encontrado")

    db.delete(db_admin)
    db.commit()
    return {"detail": "Administrador de comercio eliminado exitosamente"}

@app.delete("/admincomercio/direccion/{id_admin}",
            status_code=status.HTTP_204_NO_CONTENT,
            tags=["Administrador Comercio"])
async def delete_direcciones_admin_comercio(id_admin: str, db: Session = Depends(get_db)):
    """Elimina las direcciones de un administrador de comercio"""
    direcciones = db.query(models.Direccion_AdministradorComercio).filter(
        models.Direccion_AdministradorComercio.id_admin == id_admin
    ).all()
    if not direcciones:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                          detail="No se encontraron direcciones para el administrador de comercio")

    for direccion in direcciones:
        db.delete(direccion)

    db.commit()
    return {"detail": "Todas las direcciones del administrador de comercio han sido eliminadas exitosamente"}

@app.delete("/admincomercio/telefonos/{id_admin}",
            status_code=status.HTTP_204_NO_CONTENT,
            tags=["Administrador Comercio"])
async def delete_telefonos_admin_comercio(id_admin: str, db: Session = Depends(get_db)):
    """Elimina los teléfonos de un administrador de comercio"""
    telefonos = db.query(models.Telefonos_AdministradorComercio).filter(
        models.Telefonos_AdministradorComercio.cedula_admin == id_admin
    ).all()
    if not telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                          detail="No se encontraron teléfonos para el administrador de comercio")

    for telefono in telefonos:
        db.delete(telefono)

    db.commit()
    return {"detail": "Todos los teléfonos del administrador de comercio han sido eliminados exitosamente"}


################################
# Endpoints para Comercios Afiliados #
################################

# CREATE - Comercios Afiliados
@app.post("/comercios/",
          response_model=ComercioAfiliadoBase,
          status_code=status.HTTP_201_CREATED,
          tags=["Comercios Afiliados"],
          summary="Crear nuevo comercio afiliado",
          response_description="Comercio afiliado creado exitosamente")
async def create_comercio(comercio: ComercioAfiliadoBase, db: Session = Depends(get_db)):
    """Crea un nuevo comercio afiliado"""
    new_comercio = models.Comercio_afiliado(
        cedula_juridica=comercio.cedula_juridica,
        nombre=comercio.nombre,
        correo=comercio.correo,
        SINPE=comercio.SINPE,
        id_tipo=comercio.id_tipo,
        cedula_admin_comercio=comercio.cedula_admin_comercio
    )
    db.add(new_comercio)
    try:
        db.commit()
        db.refresh(new_comercio)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el comercio afiliado")
    return new_comercio

@app.post("/comercios/direccion/",
          status_code=status.HTTP_201_CREATED,
          tags=["Comercios Afiliados"])
async def create_direccion_comercio(direccion: DireccionesComercioBase, db: Session = Depends(get_db)):
    """Crea una nueva dirección para un comercio afiliado"""
    new_direccion = models.Direccion_Comercio(
        id_comercio=direccion.id_comercio,
        provincia=direccion.provincia,
        canton=direccion.canton,
        distrito=direccion.distrito
    )
    db.add(new_direccion)
    try:
        db.commit()
        db.refresh(new_direccion)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear la dirección")
    return new_direccion

@app.post("/comercios/telefonos/",
          status_code=status.HTTP_201_CREATED,
          tags=["Comercios Afiliados"])
async def create_telefonos_comercio(telefonos: List[TelefonosComercioAfiliadoBase], db: Session = Depends(get_db)):
    """Crea nuevos teléfonos para un comercio afiliado"""
    created_telefonos = []
    try:
        for telefono_data in telefonos:
            new_telefono = models.Telefono_Comercio(
                cedula_comercio=telefono_data.cedula_comercio,
                telefono=telefono_data.telefono
            )
            db.add(new_telefono)
            created_telefonos.append(new_telefono)

        db.commit()
        for telefono in created_telefonos:
            db.refresh(telefono)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear los teléfonos: {str(e)}"
        )
    return created_telefonos

# READ - Comercios Afiliados
@app.get("/comercios/",
         response_model=List[ComercioAfiliadoBase],
         tags=["Comercios Afiliados"])
async def get_comercios(db: Session = Depends(get_db)):
    """Obtiene todos los comercios afiliados"""
    return db.query(models.Comercio_afiliado).all()

@app.get("/comercios/{id_comercio}",
         response_model=ComercioAfiliadoBase,
         tags=["Comercios Afiliados"])
async def get_comercio(id_comercio: str, db: Session = Depends(get_db)):
    """Obtiene un comercio afiliado específico por su ID"""
    db_comercio = db.query(models.Comercio_afiliado).filter(
        models.Comercio_afiliado.cedula_juridica == id_comercio
    ).first()
    if db_comercio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comercio afiliado no encontrado")
    return db_comercio

@app.get("/comercios/telefonos/",
         response_model=List[TelefonosComercioAfiliadoBase],
         tags=["Comercios Afiliados"])
async def get_telefonos_comercios(db: Session = Depends(get_db)):
    """Obtiene todos los teléfonos de comercios afiliados"""
    return db.query(models.Telefono_Comercio).all()

@app.get("/comercios/telefonos/{id_comercio}",
         response_model=List[TelefonosComercioAfiliadoBase],
         tags=["Comercios Afiliados"])
async def get_telefonos_comercio(id_comercio: str, db: Session = Depends(get_db)):
    """Obtiene los teléfonos de un comercio afiliado específico"""
    db_telefonos = db.query(models.Telefono_Comercio).filter(
        models.Telefono_Comercio.cedula_comercio == id_comercio
    ).all()
    if not db_telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teléfonos no encontrados")
    return db_telefonos

@app.get("/comercios/direcciones/",
         response_model=List[DireccionesComercioBase],
         tags=["Comercios Afiliados"])
async def get_direcciones_comercios(db: Session = Depends(get_db)):
    """Obtiene todas las direcciones de comercios afiliados"""
    return db.query(models.Direccion_Comercio).all()

@app.get("/comercios/direccion/{id_comercio}",
         response_model=DireccionesComercioBase,
         tags=["Comercios Afiliados"])
async def get_direccion_comercio(id_comercio: str, db: Session = Depends(get_db)):
    """Obtiene la dirección de un comercio afiliado específico"""
    db_direccion = db.query(models.Direccion_Comercio).filter(
        models.Direccion_Comercio.id_comercio == id_comercio
    ).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")
    return db_direccion

# UPDATE - Comercios Afiliados
@app.put("/comercios/{id_comercio}",
         response_model=ComercioAfiliadoBase,
         tags=["Comercios Afiliados"])
async def update_comercio(id_comercio: str, comercio: ComercioAfiliadoBase, db: Session = Depends(get_db)):
    """Actualiza los datos de un comercio afiliado"""
    db_comercio = db.query(models.Comercio_afiliado).filter(
        models.Comercio_afiliado.cedula_juridica == id_comercio
    ).first()
    if db_comercio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comercio afiliado no encontrado")

    for key, value in comercio.dict().items():
        setattr(db_comercio, key, value)

    try:
        db.commit()
        db.refresh(db_comercio)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al actualizar el comercio afiliado")
    return db_comercio

@app.put("/comercios/direccion/{id_comercio}",
         response_model=DireccionesComercioBase,
         tags=["Comercios Afiliados"])
async def update_direccion_comercio(id_comercio: str, direccion: DireccionesComercioBase, db: Session = Depends(get_db)):
    """Actualiza la dirección de un comercio afiliado"""
    db_direccion = db.query(models.Direccion_Comercio).filter(
        models.Direccion_Comercio.id_comercio == id_comercio
    ).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")

    db_direccion.provincia = direccion.provincia
    db_direccion.canton = direccion.canton
    db_direccion.distrito = direccion.distrito

    try:
        db.commit()
        db.refresh(db_direccion)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al actualizar la dirección")
    return db_direccion

@app.put("/comercios/telefonos/{id_comercio}",
         response_model=List[TelefonosComercioAfiliadoBase],
         tags=["Comercios Afiliados"])
async def update_telefonos_comercio(id_comercio: str, telefonos: List[TelefonosComercioAfiliadoBase], db: Session = Depends(get_db)):
    """Actualiza los teléfonos de un comercio afiliado"""
    # Verificar que el comercio existe
    if not db.query(models.Comercio_afiliado).filter(models.Comercio_afiliado.cedula_juridica == id_comercio).first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comercio afiliado no encontrado")

    # Obtener teléfonos actuales
    db_telefonos = db.query(models.Telefono_Comercio).filter(
        models.Telefono_Comercio.cedula_comercio == id_comercio
    ).all()

    try:
        # Eliminar teléfonos existentes
        for telefono in db_telefonos:
            db.delete(telefono)

        # Crear nuevos teléfonos
        nuevos_telefonos = []
        for telefono in telefonos:
            new_telefono = models.Telefono_Comercio(
                cedula_comercio=id_comercio,
                telefono=telefono.telefono
            )
            db.add(new_telefono)
            nuevos_telefonos.append(new_telefono)

        db.commit()

        # Refrescar los nuevos registros
        for telefono in nuevos_telefonos:
            db.refresh(telefono)

        return nuevos_telefonos

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Error al actualizar los teléfonos: {str(e)}")

# DELETE - Comercios Afiliados
@app.delete("/comercios/{id_comercio}",
            status_code=status.HTTP_204_NO_CONTENT,
            tags=["Comercios Afiliados"])
async def delete_comercio(id_comercio: str, db: Session = Depends(get_db)):
    """Elimina un comercio afiliado"""
    db_comercio = db.query(models.Comercio_afiliado).filter(
        models.Comercio_afiliado.cedula_juridica == id_comercio
    ).first()
    if db_comercio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comercio afiliado no encontrado")

    try:
        db.delete(db_comercio)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al eliminar el comercio afiliado")
    return {"detail": "Comercio afiliado eliminado exitosamente"}

@app.delete("/comercios/direccion/{id_comercio}",
            status_code=status.HTTP_204_NO_CONTENT,
            tags=["Comercios Afiliados"])
async def delete_direccion_comercio(id_comercio: str, db: Session = Depends(get_db)):
    """Elimina la dirección de un comercio afiliado"""
    db_direccion = db.query(models.Direccion_Comercio).filter(
        models.Direccion_Comercio.id_comercio == id_comercio
    ).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")

    try:
        db.delete(db_direccion)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al eliminar la dirección")
    return {"detail": "Dirección del comercio afiliado eliminada exitosamente"}

@app.delete("/comercios/telefonos/{id_comercio}",
            status_code=status.HTTP_204_NO_CONTENT,
            tags=["Comercios Afiliados"])
async def delete_telefonos_comercio(id_comercio: str, db: Session = Depends(get_db)):
    """Elimina todos los teléfonos de un comercio afiliado"""
    db_telefonos = db.query(models.Telefono_Comercio).filter(
        models.Telefono_Comercio.cedula_comercio == id_comercio
    ).all()
    if not db_telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron teléfonos para el comercio")

    try:
        for telefono in db_telefonos:
            db.delete(telefono)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al eliminar los teléfonos")
    return {"detail": "Teléfonos del comercio afiliado eliminados exitosamente"}

################################
# Endpoints para Tipos de Comercio #
################################

# CREATE - Tipo de Comercio
@app.post("/tiposcomercio/",
          response_model=TipoComercioBase,
          status_code=status.HTTP_201_CREATED,
          tags=["Tipos de Comercio"],
          summary="Crear nuevo tipo de comercio",
          response_description="Tipo de comercio creado exitosamente")
async def create_tipo_comercio(tipo: TipoComercioBase, db: Session = Depends(get_db)):
    """Crea un nuevo tipo de comercio"""
    new_tipo = models.Tipo_Comercio(
        nombre=tipo.nombre
    )
    db.add(new_tipo)
    try:
        db.commit()
        db.refresh(new_tipo)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al crear el tipo de comercio"
        )
    return new_tipo

# READ - Tipo de Comercio
@app.get("/tiposcomercio/",
         response_model=List[TipoComercioBase],
         tags=["Tipos de Comercio"])
async def get_tipos_comercio(db: Session = Depends(get_db)):
    """Obtiene todos los tipos de comercio"""
    return db.query(models.Tipo_Comercio).all()

@app.get("/tiposcomercio/{id_tipo}",
         response_model=TipoComercioBase,
         tags=["Tipos de Comercio"])
async def get_tipo_comercio(id_tipo: int, db: Session = Depends(get_db)):
    """Obtiene un tipo de comercio específico por su ID"""
    db_tipo = db.query(models.Tipo_Comercio).filter(models.Tipo_Comercio.ID == id_tipo).first()
    if db_tipo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tipo de comercio no encontrado"
        )
    return db_tipo

# UPDATE - Tipo de Comercio
@app.put("/tiposcomercio/{id_tipo}",
         response_model=TipoComercioBase,
         tags=["Tipos de Comercio"])
async def update_tipo_comercio(id_tipo: int, tipo: TipoComercioBase, db: Session = Depends(get_db)):
    """Actualiza un tipo de comercio"""
    db_tipo = db.query(models.Tipo_Comercio).filter(models.Tipo_Comercio.ID == id_tipo).first()
    if db_tipo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tipo de comercio no encontrado"
        )

    db_tipo.nombre = tipo.nombre

    try:
        db.commit()
        db.refresh(db_tipo)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al actualizar el tipo de comercio"
        )
    return db_tipo

# DELETE - Tipo de Comercio
@app.delete("/tiposcomercio/{id_tipo}",
            status_code=status.HTTP_204_NO_CONTENT,
            tags=["Tipos de Comercio"])
async def delete_tipo_comercio(id_tipo: int, db: Session = Depends(get_db)):
    """Elimina un tipo de comercio"""
    db_tipo = db.query(models.Tipo_Comercio).filter(models.Tipo_Comercio.ID == id_tipo).first()
    if db_tipo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tipo de comercio no encontrado"
        )

    try:
        # Verificar si hay comercios usando este tipo
        comercios_asociados = db.query(models.Comercio_afiliado).filter(
            models.Comercio_afiliado.id_tipo == id_tipo
        ).first()

        if comercios_asociados:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No se puede eliminar el tipo de comercio porque hay comercios asociados"
            )

        db.delete(db_tipo)
        db.commit()
    except HTTPException as he:
        raise he
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al eliminar el tipo de comercio"
        )
    return {"detail": "Tipo de comercio eliminado exitosamente"}
