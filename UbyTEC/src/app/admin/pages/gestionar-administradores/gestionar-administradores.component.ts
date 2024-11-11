import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Admin } from '../../interfaces/Admin';
import { AdminServiceService } from '../../services/ServicioAdminAPI/admin-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { Telefono_admin } from '../../interfaces/Telefono_admin';
import { Direccion_Administrador } from '../../interfaces/Direccion_Administrador';

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


  telefonos_admin :Telefono_admin[]= [

    { cedula_admin: '1234567890', telefono: '888-1111' },
    { cedula_admin: '1234567890', telefono: '888-2222' },
    { cedula_admin: '9876543210', telefono: '777-1111' },
    { cedula_admin: '9876543210', telefono: '777-2222' },
    { cedula_admin: '5556667778', telefono: '666-1111' },
    { cedula_admin: '5556667778', telefono: '666-2222' },
    { cedula_admin: '1112233445', telefono: '555-1111' },
    { cedula_admin: '1112233445', telefono: '555-2222' }
  ];


  constructor(private fb: FormBuilder, private adminService: AdminServiceService) {
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
    // this.loadEmpleados(); // Llama a la función para obtener los empleados
  }

  // loadEmpleados(): void {
  //   this.adminService.getEmpleados().subscribe({
  //     next: (data) => {
  //       this.administradores = data; // Asigna los datos obtenidos
  //       console.log('Administradores obtenidos de la API:', this.administradores);
  //     },
  //     error: (error) => {
  //       console.error('Error al obtener los administradores:', error);
  //     }
  //   });
  // }

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


    createAdmin() {
      if(this.adminForm.valid) {
        let adminData = this.adminForm.value;
        let cedulaAdmin = adminData.cedula;

        let adminToAdd: Admin = {
          usuario: adminData.usuario,
          password: adminData.password,
          cedula: adminData.cedula,
          nombre: adminData.nombre,
          apellido1: adminData.apellido1,
          apellido2: adminData.apellido2
        };

        let direcciontoAdd: Direccion_Administrador = {
          id_admin: adminData.usuario,
          provincia: adminData.provincia,
          canton: adminData.canton,
          distrito: adminData.distrito
        };

        this.adminService.createAdmin(adminToAdd).subscribe(
          response => {
            console.log('Administrador guardado en la API:', response);
            this.administradores.push(adminToAdd);
          },
          error => {
            console.error('Error al guardar el administrador en la API:', error);
          }
        );


        console.log('Datos enviados Direccion:', direcciontoAdd);
        this.adminService.createDirecciones(direcciontoAdd).subscribe(
          response => {
            console.log('Dirección guardada en la API:', response);
            this.direcciones_administrador.push(direcciontoAdd);
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
          this.telefonos_admin.push(telefonoToAdd);
          this.adminService.createTelefonos(telefonoToAdd).subscribe(
            response => {
              console.log('Teléfono guardado en la API:', response);
            },
            error => {
              console.error('Error al guardar el teléfono en la API:', error);
            }
          );
        });

        // Limpiar formularios después de guardar
        this.adminForm.reset();
        this.telefonos.clear();
      } else {
        console.log("Admin Form not valid");
        //this.mostrarErroresFormulario();
      }
    }



    editAdmin(admin: Admin) {
      this.editMode = true;
      this.adminForm.patchValue({
        usuario: admin.usuario,
        password: admin.password,
        cedula: admin.cedula,
        nombre: admin.nombre,
        apellido1: admin.apellido1,
        apellido2: admin.apellido2,

      });

      this.telefonos.clear();
      this.getTelefonosByCedulaRegister(admin.cedula).forEach(tel => {
        this.telefonos.push(this.fb.group({
          telefono: [tel.telefono, Validators.required]
        }));
      });

      this.setActiveTab('crear');
    }

    deleteAdmin(cedula: string) {
      this.administradores = this.administradores.filter(emp => emp.cedula !== cedula);
      this.telefonos_admin = this.telefonos_admin.filter(tel => tel.cedula_admin !== cedula);
    }



    mostrarErroresFormulario() {
      Object.keys(this.adminForm.controls).forEach(field => {
        const control = this.adminForm.get(field);
        if (control && control.invalid) {
          const errors = control.errors;
          console.log(`Error en el campo '${field}':`, errors);
        }
      });

      // Revisar errores específicos en el array TelefonosAdmin
      const telefonosArray = this.adminForm.get('TelefonosAdmin') as FormArray;
      telefonosArray.controls.forEach((control, index) => {
        if (control.invalid) {
          console.log(`Error en el teléfono #${index + 1}:`, control.errors);
        }
      });
    }
  }
















