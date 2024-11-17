from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from sqlalchemy import inspect

def create_tables():
    """Crear todas las tablas definidas en los modelos"""
    models.Base.metadata.create_all(bind=engine)

def tables_exist():
    """Verificar si todas las tablas necesarias existen"""
    inspector = inspect(engine)
    required_tables = [
        'administradorapp',
        'direccionesadministradorapp',
        'telefonosadministradorapp',
        'administradorcomercio',
        'direccionesadministradorcomercio',
        'telefonosadministradorcomercio',
        'tipo_comercioafiliado',
        'comercioafiliado',
        'direccionescomercioafiliado',
        'telefonocomercioafiliado'
    ]
    existing_tables = inspector.get_table_names()
    return all(table in existing_tables for table in required_tables)

def clean_database():
    """Limpiar todas las tablas de la base de datos"""
    db = SessionLocal()
    try:
        # Eliminar datos en orden para respetar las restricciones de clave foránea
        db.query(models.Telefono_Comercio).delete()
        db.query(models.Direccion_Comercio).delete()
        db.query(models.Comercio_afiliado).delete()
        db.query(models.Telefonos_AdministradorComercio).delete()
        db.query(models.Direccion_AdministradorComercio).delete()
        db.query(models.AdministradorComercio).delete()
        db.query(models.Telefonos_AdministradorApp).delete()
        db.query(models.Direccion_AdministradorApp).delete()
        db.query(models.AdministradorApp).delete()
        db.query(models.Tipo_Comercio).delete()
        db.commit()
        print("Base de datos limpiada exitosamente.")
    except Exception as e:
        print(f"Error al limpiar la base de datos: {str(e)}")
        db.rollback()
        raise e
    finally:
        db.close()

def init_database():
    """Inicializar la base de datos con datos de prueba"""
    if not tables_exist():
        create_tables()

    db = SessionLocal()
    try:
        # Verificar si ya existen datos
        if db.query(models.AdministradorApp).first() is not None:
            print("La base de datos ya contiene datos. Saltando la inicialización.")
            return

        # Crear administradores de la app
        admin_apps = [
            models.AdministradorApp(
                cedula="101110111",
                usuario="adminapp1",
                password="pass123",
                nombre="Juan",
                apellido1="Pérez",
                apellido2="García"
            ),
            models.AdministradorApp(
                cedula="202220222",
                usuario="adminapp2",
                password="pass456",
                nombre="María",
                apellido1="González",
                apellido2="López"
            )
        ]

        # Insertar administradores de la app
        for admin in admin_apps:
            db.add(admin)
        db.commit()

        # Crear direcciones de administradores de la app
        direcciones_admin_app = [
            models.Direccion_AdministradorApp(
                id_admin="101110111",
                provincia="San José",
                canton="Central",
                distrito="Catedral"
            ),
            models.Direccion_AdministradorApp(
                id_admin="202220222",
                provincia="Alajuela",
                canton="Central",
                distrito="San José"
            )
        ]

        # Insertar direcciones de administradores de la app
        for direccion in direcciones_admin_app:
            db.add(direccion)
        db.commit()

        # Crear teléfonos de administradores de la app
        telefonos_admin_app = []
        for admin in admin_apps:
            for i in range(2):
                telefono = models.Telefonos_AdministradorApp(
                    telefono=f"8{admin.cedula[:3]}{i+1}2345{i}",
                    cedula_admin=admin.cedula
                )
                telefonos_admin_app.append(telefono)

        # Insertar teléfonos de administradores de la app
        for telefono in telefonos_admin_app:
            db.add(telefono)
        db.commit()

        # Crear administradores de comercio
        admin_comercios = [
            models.AdministradorComercio(
                cedula="303330333",
                usuario="admincom1",
                password="pass789",
                nombre="Carlos",
                apellido1="Rodríguez",
                apellido2="Martínez"
            ),
            models.AdministradorComercio(
                cedula="404440444",
                usuario="admincom2",
                password="pass012",
                nombre="Ana",
                apellido1="Fernández",
                apellido2="Sánchez"
            )
        ]

        # Insertar administradores de comercio
        for admin in admin_comercios:
            db.add(admin)
        db.commit()

        # Crear direcciones de administradores de comercio
        direcciones_admin_comercio = [
            models.Direccion_AdministradorComercio(
                id_admin="303330333",
                provincia="Heredia",
                canton="Central",
                distrito="Mercedes"
            ),
            models.Direccion_AdministradorComercio(
                id_admin="404440444",
                provincia="Cartago",
                canton="Central",
                distrito="Oriental"
            )
        ]

        # Insertar direcciones de administradores de comercio
        for direccion in direcciones_admin_comercio:
            db.add(direccion)
        db.commit()

        # Crear teléfonos de administradores de comercio
        telefonos_admin_comercio = []
        for admin in admin_comercios:
            for i in range(2):
                telefono = models.Telefonos_AdministradorComercio(
                    telefono=f"8{admin.cedula[:3]}{i+1}6789{i}",
                    cedula_admin=admin.cedula
                )
                telefonos_admin_comercio.append(telefono)

        # Insertar teléfonos de administradores de comercio
        for telefono in telefonos_admin_comercio:
            db.add(telefono)
        db.commit()

        # Crear tipos de comercio
        tipos_comercio = [
            models.Tipo_Comercio(nombre="Restaurante"),
            models.Tipo_Comercio(nombre="Supermercado"),
            models.Tipo_Comercio(nombre="Farmacia"),
            models.Tipo_Comercio(nombre="Tienda de ropa")
        ]

        # Insertar tipos de comercio
        for tipo in tipos_comercio:
            db.add(tipo)
        db.commit()

        # Refrescar tipos para obtener sus IDs
        for tipo in tipos_comercio:
            db.refresh(tipo)

        # Crear comercios afiliados
        comercios = [
            models.Comercio_afiliado(
                cedula_juridica="3101111111",
                nombre="Restaurante El Buen Sabor",
                correo="buensabor@email.com",
                SINPE="8111111111",
                id_tipo=tipos_comercio[0].ID,
                cedula_admin_comercio=admin_comercios[0].cedula
            ),
            models.Comercio_afiliado(
                cedula_juridica="3102222222",
                nombre="Super Economico",
                correo="supereconomico@email.com",
                SINPE="8222222222",
                id_tipo=tipos_comercio[1].ID,
                cedula_admin_comercio=admin_comercios[0].cedula
            ),
            models.Comercio_afiliado(
                cedula_juridica="3103333333",
                nombre="Farmacia Salud Total",
                correo="saludtotal@email.com",
                SINPE="8333333333",
                id_tipo=tipos_comercio[2].ID,
                cedula_admin_comercio=admin_comercios[1].cedula
            ),
            models.Comercio_afiliado(
                cedula_juridica="3104444444",
                nombre="Modas Elegantes",
                correo="modaselegantes@email.com",
                SINPE="8444444444",
                id_tipo=tipos_comercio[3].ID,
                cedula_admin_comercio=admin_comercios[1].cedula
            )
        ]

        # Insertar comercios
        for comercio in comercios:
            db.add(comercio)
        db.commit()

        # Crear direcciones de comercios
        direcciones_comercio = [
            models.Direccion_Comercio(
                id_comercio="3101111111",
                provincia="San José",
                canton="Escazú",
                distrito="San Rafael"
            ),
            models.Direccion_Comercio(
                id_comercio="3102222222",
                provincia="Alajuela",
                canton="Grecia",
                distrito="Central"
            ),
            models.Direccion_Comercio(
                id_comercio="3103333333",
                provincia="Heredia",
                canton="Santo Domingo",
                distrito="Santa Rosa"
            ),
            models.Direccion_Comercio(
                id_comercio="3104444444",
                provincia="Cartago",
                canton="La Unión",
                distrito="Tres Ríos"
            )
        ]

        # Insertar direcciones de comercios
        for direccion in direcciones_comercio:
            db.add(direccion)
        db.commit()

        # Crear teléfonos de comercios con formato único
        telefonos_comercio = []
        for idx, comercio in enumerate(comercios):
            for i in range(2):
                telefono = models.Telefono_Comercio(
                    telefono=f"2{comercio.cedula_juridica[3:6]}{i+1}{idx+1}4567",
                    cedula_comercio=comercio.cedula_juridica
                )
                telefonos_comercio.append(telefono)

        # Insertar teléfonos de comercios con manejo de errores individual
        for telefono in telefonos_comercio:
            try:
                db.add(telefono)
                db.commit()
            except Exception as e:
                db.rollback()
                print(f"Error al insertar teléfono {telefono.telefono}: {str(e)}")
                continue

        print("Base de datos inicializada exitosamente con datos de prueba.")

    except Exception as e:
        print(f"Error durante la inicialización de la base de datos: {str(e)}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    clean_database()
    init_database()
