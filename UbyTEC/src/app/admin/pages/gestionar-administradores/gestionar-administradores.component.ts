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
import Swal from 'sweetalert2';


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
  currentAdmin: Admin | null = null;
  currentAdminDireccion: Direccion_Administrador | null = null;
  administradores: Admin[] = [];
  direcciones_administrador: Direccion_Administrador[]= [];
  telefonos_admin :Telefono_admin[] = [];


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

  //Inicialización de todos los objetos ocupados por la pestaña gestión administradores

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
  //Teléfono Form Methods
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

    private createNewAdmin(adminData:any,cedulaAdmin:string){
      let adminToAdd = this.buildAdminObject(adminData);
      let direccionToAdd = this.buildDireccionObject(adminData, cedulaAdmin);

      this.saveAdminToAPI(adminToAdd);
      this.saveDireccionToAPI(direccionToAdd);
      this.saveTelefonosToAPI(this.telefonos.value, cedulaAdmin);
    }

    private updateExistingAdmin(adminData: any): void {
      let adminToUpdate = this.buildAdminObject(adminData);
      let direccionToUpdate = this.buildDireccionObject(adminData, adminData.cedula);
      let telefonosToUpdate = this.buildTelefonosArray(this.telefonos.value, adminData.cedula);

      this.updateAdminInAPI(adminToUpdate);
      this.updateDireccionInAPI(direccionToUpdate);
      this.updateTelefonosInAPI(adminData.cedula, telefonosToUpdate);
    }



    private buildAdminObject(data: any): Admin {
      return {
        usuario: data.usuario,
        password: data.password,
        cedula: data.cedula,
        nombre: data.nombre,
        apellido1: data.apellido1,
        apellido2: data.apellido2
      };
    }

    private buildDireccionObject(data: any, cedulaAdmin: string): Direccion_Administrador {
      return {
        id_admin: cedulaAdmin,
        provincia: data.provincia,
        canton: data.canton,
        distrito: data.distrito
      };
    }

    private buildTelefonosArray(telefonos: any[], cedulaAdmin: string): Telefono_admin[] {
      return telefonos.map(tel => ({
        cedula_admin: cedulaAdmin,
        telefono: tel.telefono
      }));
    }


    // API Save Methods
  private saveAdminToAPI(admin: Admin): void {
    this.adminService.createAdmin(admin).subscribe({
      next: (response) => {
        console.log('Administrador guardado en la API:', response);
        this.getAllAdministradores();
      },
      error: (error) => console.error('Error al guardar el administrador en la API:', error)
    });
  }

  private saveDireccionToAPI(direccion: Direccion_Administrador): void {
    this.adminService.createDirecciones(direccion).subscribe({
      next: (response) => {
        console.log('Dirección guardada en la API:', response);
        this.getAllDirecciones();
      },
      error: (error) => console.error('Error al guardar la dirección en la API:', error)
    });
  }

  private saveTelefonosToAPI(telefonos: any[], cedulaAdmin: string): void {
    telefonos.forEach(tel => {
      let telefonoToAdd: Telefono_admin = {
        cedula_admin: cedulaAdmin,
        telefono: tel.telefono
      };
      this.adminService.createTelefonos(telefonoToAdd).subscribe({
        next: (response) => {
          console.log('Teléfono guardado en la API:', response);
          this.getAllTelefonos();
        },
        error: (error) => console.error('Error al guardar el teléfono en la API:', error)
      });
    });
  }


  // API Update Methods
  private updateAdminInAPI(admin: Admin): void {
    this.adminService.updateAdmin(admin).subscribe({
      next: (response) => {
        console.log('Administrador actualizado:', response);
        this.getAllAdministradores();
      },
      error: (error) => console.error('Error al actualizar el administrador:', error)
    });
  }

  private updateDireccionInAPI(direccion: Direccion_Administrador): void {
    this.adminService.updateDireccion(direccion).subscribe({
      next: (response) => {
        console.log('Dirección actualizada:', response);
        this.getAllDirecciones();
      },
      error: (error) => console.error('Error al actualizar la dirección:', error)
    });
  }

  private updateTelefonosInAPI(cedula: string, telefonos: Telefono_admin[]): void {
    this.adminService.putTelefonos(cedula, telefonos).subscribe({
      next: (response) => {
        console.log('Teléfonos actualizados en la API:', response);
        this.getAllTelefonos();
      },
      error: (error) => console.error('Error al actualizar los teléfonos en la API:', error)
    });
  }


  // Public Methods
  saveAdmin(): void {
    if (this.adminForm.valid) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: this.editMode ? 'Se actualizará la información del administrador' : 'Se creará un nuevo administrador',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          let adminData = this.adminForm.value;
          let cedulaAdmin = adminData.cedula;

          if (!this.editMode) {
            this.createNewAdmin(adminData, cedulaAdmin);
          } else {
            this.updateExistingAdmin(adminData);
          }

          this.resetForm();

          Swal.fire({
            title: 'Éxito',
            text: this.editMode ? 'Administrador actualizado correctamente' : 'Administrador creado correctamente',
            icon: 'success'
          });
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, complete todos los campos requeridos',
        icon: 'error'
      });
      this.mostrarErroresFormulario();
    }
  }



  editAdmin(cedula: string): void {
    this.editMode = true;
    this.setActiveTab("crear");
    this.loadAdminData(cedula);
  }


  private loadAdminData(cedula: string): void {
    this.loadAdminDetails(cedula);
    this.loadAdminDireccion(cedula);
    this.loadAdminTelefonos(cedula);
  }

  private loadAdminDetails(cedula: string): void {
    this.adminService.getOneAdmin(cedula).subscribe({
      next: (adminData) => {
        this.patchAdminForm(adminData);
      },
      error: (error) => console.error('Error al obtener el administrador:', error)
    });
  }

  private loadAdminDireccion(cedula: string): void {
    this.adminService.getDireccionAdmin(cedula).subscribe({
      next: (direccionData) => {
        this.patchDireccionForm(direccionData);
      },
      error: (error) => console.error('Error al obtener la dirección:', error)
    });
  }

  private loadAdminTelefonos(cedula: string): void {
    this.adminService.getTelefonosAdmin(cedula).subscribe({
      next: (telefonosData) => {
        this.updateTelefonosFormArray(telefonosData);
      },
      error: (error) => console.error('Error al obtener los teléfonos:', error)
    });
  }



  private patchAdminForm(adminData: Admin): void {
    this.adminForm.patchValue({
      usuario: adminData.usuario,
      password: adminData.password,
      cedula: adminData.cedula,
      nombre: adminData.nombre,
      apellido1: adminData.apellido1,
      apellido2: adminData.apellido2
    });
  }

  private patchDireccionForm(direccionData: Direccion_Administrador): void {
    this.adminForm.patchValue({
      provincia: direccionData.provincia,
      canton: direccionData.canton,
      distrito: direccionData.distrito
    });
  }

  private updateTelefonosFormArray(telefonosData: Telefono_admin[]): void {
    this.telefonosFormArray = this.adminForm.get('TelefonosAdmin') as FormArray;
    this.telefonosFormArray.clear();

    telefonosData.forEach((telefono) => {
      this.telefonosFormArray.push(this.fb.group({
        telefono: telefono.telefono
      }));
    });
  }



  deleteallInfoAdmin(cedula: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará toda la información del administrador y no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTelefonosProcess(cedula);
      }
    });
  }

  // Proceso de eliminación de teléfonos
private deleteTelefonosProcess(cedula: string): void {
  this.adminService.deleteTelefonosAdmin(cedula).subscribe({
    next: () => {
      console.log('Teléfonos eliminados correctamente');
      this.deleteDireccionProcess(cedula);
    },
    error: (error) => {
      console.error('Error al eliminar los teléfonos:', error);
      this.handleDeleteError('teléfonos');
    }
  });
}

// Proceso de eliminación de dirección
private deleteDireccionProcess(cedula: string): void {
  this.adminService.deleteDireccionesAdmin(cedula).subscribe({
    next: () => {
      console.log('Dirección eliminada correctamente');
      this.deleteAdminProcess(cedula);
    },
    error: (error) => {
      console.error('Error al eliminar la dirección:', error);
      this.handleDeleteError('dirección');
    }
  });
}

// Proceso de eliminación del administrador
private deleteAdminProcess(cedula: string): void {
  this.adminService.deleteAdmin(cedula).subscribe({
    next: () => {
      console.log('Administrador eliminado correctamente');
      this.handleDeleteSuccess();
    },
    error: (error) => {
      console.error('Error al eliminar el administrador:', error);
      this.handleDeleteError('administrador');
    }
  });
}


private handleDeleteSuccess(): void {
  this.updateAllData();
  Swal.fire({
    title: 'Eliminado',
    text: 'El administrador ha sido eliminado correctamente',
    icon: 'success'
  });
}

private handleDeleteError(entity: string): void {
  console.error(`Error en el proceso de eliminación de ${entity}`);
  Swal.fire({
    title: 'Error',
    text: `Error al eliminar ${entity}. Por favor, inténtelo de nuevo`,
    icon: 'error'
  });
}

// Actualización de datos después de la eliminación
private updateAllData(): void {
  this.getAllAdministradores();
  this.getAllDirecciones();
  this.getAllTelefonos();
}
  private resetForm(): void {
    this.adminForm.reset();
    this.telefonosFormArray.clear();
    this.editMode = false;
  }

  mostrarErroresFormulario(): void {
    // Revisar errores en campos principales
    Object.keys(this.adminForm.controls).forEach(field => {
      let control = this.adminForm.get(field);
      if (control?.invalid) {
        console.log(`Error en el campo '${field}':`, control.errors);
      }
    });

    // Revisar errores en teléfonos
    let telefonosArray = this.adminForm.get('TelefonosAdmin') as FormArray;
    telefonosArray.controls.forEach((control, index) => {
      if (control.invalid) {
        console.log(`Error en el teléfono #${index + 1}:`, control.errors);
      }
    });
  }

  }
















