import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Admin } from '../../interfaces/Admin';
import { AdminServiceService } from '../../services/ServicioAdminAPI/admin-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { Telefono_admin } from '../../interfaces/Telefono_admin';
import { Direccion_Administrador } from '../../interfaces/Direccion_Administrador';
import { Telefono_comercio } from '../../interfaces/Telefono_comercio';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-gestionar-administradores',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule,HeaderAdminComponent],
  providers:[AdminServiceService],
  templateUrl: './gestionar-administradores.component.html',
  styleUrl: './gestionar-administradores.component.css'
})
export class GestionarAdministradoresComponent implements OnInit{

  adminForm: FormGroup;
  //telefonosAdminForm:FormArray
  editMode: boolean = false;
  activeTab: string = 'crear';
  telefonosFormArray:FormArray
  // currentAdmin: Admin = {
  //   password: '',
  //   usuario: '',
  //   cedula: '',
  //   nombre: '',
  //   apellido1: '',
  //   apellido2: ''
  // };

  // currentAdminDireccion: Direccion_Administrador = {
  //   id_admin: '',
  //   provincia: '',
  //   canton: '',
  //   distrito: ''
  // };


  currentAdmin: Admin | null = null;
  currentAdminDireccion: Direccion_Administrador | null = null;
  // administradores: Admin[] = [
  //   {
  //     password: 'contraseña123',
  //     usuario: 'jdoe',
  //     cedula: '1234567890',
  //     nombre: 'Juan',
  //     apellido1: 'Doe',
  //     apellido2: 'Pérez',
  //     provincia: 'San José',
  //     canton: 'Central',
  //     distrito: 'Carmen'
  //   },
  //   {
  //     password: 'admin2024',
  //     usuario: 'mlopez',
  //     cedula: '9876543210',
  //     nombre: 'María',
  //     apellido1: 'López',
  //     apellido2: 'González',
  //     provincia: 'Alajuela',
  //     canton: 'Central',
  //     distrito: 'Naranjo'
  //   },
  //   {
  //     password: '1234abcd',
  //     usuario: 'rhernandez',
  //     cedula: '5556667778',
  //     nombre: 'Roberto',
  //     apellido1: 'Hernández',
  //     apellido2: 'Vargas',
  //     provincia: 'Cartago',
  //     canton: 'Central',
  //     distrito: 'La Unión'
  //   },
  //   {
  //     password: 'password1234',
  //     usuario: 'acastro',
  //     cedula: '1112233445',
  //     nombre: 'Ana',
  //     apellido1: 'Castro',
  //     apellido2: 'Sánchez',
  //     provincia: 'Heredia',
  //     canton: 'Barva',
  //     distrito: 'Santo Domingo'
  //   }
  // ];


  administradores: Admin[] = [];

  direcciones_administrador: Direccion_Administrador[]= [];
  telefonos_admin :Telefono_admin[] = [];

  // telefonos_admin :Telefono_admin[]= [

  //   { cedula_admin: '1234567890', telefono: '888-1111' },
  //   { cedula_admin: '1234567890', telefono: '888-2222' },
  //   { cedula_admin: '9876543210', telefono: '777-1111' },
  //   { cedula_admin: '9876543210', telefono: '777-2222' },
  //   { cedula_admin: '5556667778', telefono: '666-1111' },
  //   { cedula_admin: '5556667778', telefono: '666-2222' },
  //   { cedula_admin: '1112233445', telefono: '555-1111' },
  //   { cedula_admin: '1112233445', telefono: '555-2222' }
  // ];


  constructor(private fb: FormBuilder, private adminService: AdminServiceService) {
    this.telefonosFormArray = this.fb.array([]);

    this.adminForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', [Validators.required]],
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      TelefonosAdmin: this.fb.array([
        this.createTelefonoFormGroup() // Crear el primer grupo por defecto
      ])

    });




  }

  ngOnInit(): void {
    this.getAllAdministradores();
    this.getAllDirecciones();
    this.getAllTelefonos();
  }


  // Obtener todos los administradores
getAllAdministradores(): void {
  this.adminService.getAdmins().subscribe(
    (data: Admin[]) => {
      this.administradores = data;
      console.log('Administradores cargados:', this.administradores);
    },
    error => {
      console.error('Error al cargar los administradores:', error);
    }
  );
}

// Obtener todas las direcciones de administradores
getAllDirecciones(): void {
  this.adminService.getDirecciones().subscribe(
    (data: Direccion_Administrador[]) => {
      this.direcciones_administrador = data;
      console.log('Direcciones cargadas:', this.direcciones_administrador);
    },
    error => {
      console.error('Error al cargar las direcciones:', error);
    }
  );
}

// Obtener todos los teléfonos de administradores
getAllTelefonos(): void {
  this.adminService.getTelefonos().subscribe(
    (data: Telefono_admin[]) => {
      this.telefonos_admin = data;
      console.log('Teléfonos cargados:', this.telefonos_admin);
    },
    error => {
      console.error('Error al cargar los teléfonos:', error);
    }
  );
}




    /*TELEFONOS */

    createTelefonoFormGroup(): FormGroup {
      return this.fb.group({
        telefono: ['', Validators.required]
      });
    }


    get telefonos() {
      return (this.adminForm.get('TelefonosAdmin') as FormArray);
    }

    addTelefonoRegister() {
      let telefonoGroup = this.fb.group({
        telefono: ['', Validators.required]
      });
      this.telefonos.push(telefonoGroup);
    }

    removeTelefonoRegister(index: number) {
      if(this.telefonos.length>1){
      this.telefonos.removeAt(index);
      }
    }

    getTelefonosByCedulaRegister(cedula: string): Telefono_admin[] {
      return this.telefonos_admin.filter(tel => tel.cedula_admin === cedula);
    }

    /*TAB ACTIVE */
    setActiveTab(tab: string) {
      this.activeTab = tab;
    }

    getDireccionByCedula(cedula: string): Direccion_Administrador | undefined {
      return this.direcciones_administrador.find(direccion => direccion.id_admin === cedula);
    }


    /*ADMINISTRADORES */
    saveAdmin() {
      console.log("editmode", this.editMode);

      if (this.adminForm.valid) {
        let adminData = this.adminForm.value;
        let cedulaAdmin = adminData.cedula;
        if (this.editMode == false) {


          let adminToAdd: Admin = {
            usuario: adminData.usuario,
            password: adminData.password,
            cedula: adminData.cedula,
            nombre: adminData.nombre,
            apellido1: adminData.apellido1,
            apellido2: adminData.apellido2
          };

          let direcciontoAdd: Direccion_Administrador = {
            id_admin: cedulaAdmin,
            provincia: adminData.provincia,
            canton: adminData.canton,
            distrito: adminData.distrito
          };

          this.adminService.createAdmin(adminToAdd).subscribe(
            response => {
              console.log('Administrador guardado en la API:', response);
              // this.administradores.push(adminToAdd);
              this.getAllAdministradores();
            },
            error => {
              console.error('Error al guardar el administrador en la API:', error);
            }
          );

          console.log('Datos enviados Direccion:', direcciontoAdd);
          this.adminService.createDirecciones(direcciontoAdd).subscribe(
            response => {
              console.log('Dirección guardada en la API:', response);
              // this.direcciones_administrador.push(direcciontoAdd);
              this.getAllDirecciones();
            },
            error => {
              console.error('Error al guardar la dirección en la API:', error);
            }
          );

          // Guardar los teléfonos con la cédula del administrador
          this.telefonos.value.forEach((tel: any) => {
            let telefonoToAdd: Telefono_admin = {
              cedula_admin: cedulaAdmin,
              telefono: tel.telefono
            };
            // this.telefonos_admin.push(telefonoToAdd);
            this.adminService.createTelefonos(telefonoToAdd).subscribe(
              response => {
                console.log('Teléfono guardado en la API:', response);
                this.getAllTelefonos();
              },
              error => {
                console.error('Error al guardar el teléfono en la API:', error);
              }
            );
          });

        } else if (this.editMode == true) {
          let adminData = this.adminForm.value;
          let adminToUpdate: Admin = {
            usuario: adminData.usuario,
            password: adminData.password,
            cedula: adminData.cedula,
            nombre: adminData.nombre,
            apellido1: adminData.apellido1,
            apellido2: adminData.apellido2
          };

          this.adminService.updateAdmin(adminToUpdate).subscribe(
            (response) => {
              console.log('Administrador actualizado:', response);
              this.getAllAdministradores(); // Refrescar lista de administradores
            },
            (error) => {
              console.error('Error al actualizar el administrador:', error);
            }
          );

          let direccionToUpdate: Direccion_Administrador = {
            id_admin: adminData.cedula,
            provincia: adminData.provincia,
            canton: adminData.canton,
            distrito: adminData.distrito
          };

          this.adminService.updateDireccion(direccionToUpdate).subscribe(
            (response) => {
              console.log('Dirección actualizada:', response);
              this.getAllDirecciones(); // Refrescar lista de direcciones
            },
            (error) => {
              console.error('Error al actualizar la dirección:', error);
            }
          );

        // // Recorre y actualiza cada teléfono del administrador
       // Crear un array para almacenar los teléfonos con la cédula del administrador
let telefonosToAddfinal: Telefono_admin[] = [];

// Iterar sobre todos los teléfonos en this.telefonos.value
this.telefonos.value.forEach((tel: any) => {
  let telefonoToAdd: Telefono_admin = {
    cedula_admin: cedulaAdmin,
    telefono: tel.telefono
  };

  // Agregar cada teléfono al array
  telefonosToAddfinal.push(telefonoToAdd);
});
console.log("telefonos to add final", telefonosToAddfinal)
let Json = JSON.stringify(telefonosToAddfinal)
console.log("telefonos to add final JSON", Json)

// Enviar todos los teléfonos a la API (puedes usar un solo método de la API para todos)
this.adminService.putTelefonos(cedulaAdmin,telefonosToAddfinal).subscribe(
  response => {
    console.log('Teléfonos actualizados en la API:', response);
    this.getAllTelefonos(); // Recargar la lista de teléfonos después de la actualización
  },
  error => {
    console.error('Error al actualizar los teléfonos en la API:', error);
  }
);






        }

        // Limpiar formularios después de guardar
        this.adminForm.reset();
        this.telefonosFormArray.clear();
      } else {
        console.log("Admin Form not valid");
        // this.mostrarErroresFormulario();
      }
    }


    editAdmin(cedula: string) {
      this.editMode = true;
      this.setActiveTab("crear");

      // Obtener los datos del administrador
      this.adminService.getOneAdmin(cedula).subscribe(
        (adminData) => {
          console.log('Datos del administrador obtenidos:', adminData);
          this.adminForm.patchValue({
            usuario: adminData.usuario,
            password: adminData.password,
            cedula: adminData.cedula,
            nombre: adminData.nombre,
            apellido1: adminData.apellido1,
            apellido2: adminData.apellido2
          });
        },
        (error) => {
          console.error('Error al obtener el administrador:', error);
        }
      );

      // Obtener los datos de dirección del administrador
      this.adminService.getDireccionAdmin(cedula).subscribe(
        (direccionData) => {
          console.log('Datos de dirección obtenidos:', direccionData);
          this.adminForm.patchValue({
            provincia: direccionData.provincia,
            canton: direccionData.canton,
            distrito: direccionData.distrito
          });
        },
        (error) => {
          console.error('Error al obtener la dirección:', error);
        }
      );

      // Obtener los teléfonos del administrador
      this.adminService.getTelefonosAdmin(cedula).subscribe(
        (telefonosData) => {
          console.log('Teléfonos obtenidos:', telefonosData);
          this.telefonosFormArray = this.adminForm.get('TelefonosAdmin') as FormArray;
          this.telefonosFormArray.clear(); // Limpiar el FormArray antes de agregar los nuevos teléfonos

          telefonosData.forEach((telefono) => {
            let telefonoGroup = this.fb.group({
              telefono: telefono.telefono
            });
            this.telefonosFormArray.push(telefonoGroup); // Agregar cada teléfono al FormArray
            //this.getAllTelefonos()
          });
        },
        (error) => {
          console.error('Error al obtener los teléfonos:', error);
        }
      );
    }


     // Método para actualizar el administrador
  updateAdmin() {

    if (this.adminForm.valid) {
      let adminData = this.adminForm.value;
      let adminToUpdate: Admin = {
        usuario: adminData.usuario,
        password: adminData.password,
        cedula: adminData.cedula,
        nombre: adminData.nombre,
        apellido1: adminData.apellido1,
        apellido2: adminData.apellido2
      };

      this.adminService.updateAdmin(adminToUpdate).subscribe(
        (response) => {
          console.log('Administrador actualizado:', response);
          this.getAllAdministradores(); // Refrescar lista de administradores
        },
        (error) => {
          console.error('Error al actualizar el administrador:', error);
        }
      );

      let direccionToUpdate: Direccion_Administrador = {
        id_admin: adminData.cedula,
        provincia: adminData.provincia,
        canton: adminData.canton,
        distrito: adminData.distrito
      };

      this.adminService.updateDireccion(direccionToUpdate).subscribe(
        (response) => {
          console.log('Dirección actualizada:', response);
          this.getAllDirecciones(); // Refrescar lista de direcciones
        },
        (error) => {
          console.error('Error al actualizar la dirección:', error);
        }
      );

      // Actualizar teléfonos
      this.telefonos.value.forEach((tel: any) => {
        let telefonoToUpdate: Telefono_admin = {
          cedula_admin: adminData.cedula,
          telefono: tel.telefono
        };

        this.adminService.updateTelefono(telefonoToUpdate).subscribe(
          (response) => {
            console.log('Teléfono actualizado:', response);
            this.getAllTelefonos(); // Refrescar lista de teléfonos
          },
          (error) => {
            console.error('Error al actualizar el teléfono:', error);
          }
        );
      });

      // Limpiar el formulario después de actualizar
      this.adminForm.reset();
      this.telefonos.clear();
      this.editMode = false
    }
  }





    deleteAdmin(cedula: string) {
      this.administradores = this.administradores.filter(emp => emp.cedula !== cedula);
      this.telefonos_admin = this.telefonos_admin.filter(tel => tel.cedula_admin !== cedula);
    }



    mostrarErroresFormulario() {
      Object.keys(this.adminForm.controls).forEach(field => {
        let control = this.adminForm.get(field);
        if (control && control.invalid) {
          let errors = control.errors;
          console.log(`Error en el campo '${field}':`, errors);
        }
      });

      // Revisar errores específicos en el array TelefonosAdmin
      let telefonosArray = this.adminForm.get('TelefonosAdmin') as FormArray;
      telefonosArray.controls.forEach((control, index) => {
        if (control.invalid) {
          console.log(`Error en el teléfono #${index + 1}:`, control.errors);
        }
      });
    }
  }
















