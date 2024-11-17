import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { AdministradorApp } from '../../interfaces/adminapp/AdministradorApp';
import { AdminAppServiceService } from '../../services/ServicioAdminAPI/admin-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { Telefono_AdminApp } from '../../interfaces/adminapp/Telefono_AdminApp';
import { Direccion_AdministradorApp } from '../../interfaces/adminapp/Direccion_AdministradorApp ';
import { Telefono_comercio } from '../../interfaces/Telefono_comercio';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-gestionar-administradores',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, HttpClientModule ,HeaderAdminComponent],
  providers:[AdminAppServiceService],
  templateUrl: './gestionar-administradores.component.html',
  styleUrl: './gestionar-administradores.component.css'
})
export class GestionarAdministradoresComponent implements OnInit {
  adminForm: FormGroup;
  editMode: boolean = false;
  activeTab: string = 'crear';
  telefonosFormArray: FormArray;
  currentAdmin: AdministradorApp | null = null;
  currentAdminDireccion: Direccion_AdministradorApp | null = null;
  administradores: AdministradorApp[] = [];
  direcciones_administrador: Direccion_AdministradorApp[] = [];
  telefonos_admin: Telefono_AdminApp[] = [];

  constructor(private fb: FormBuilder, private adminAppService: AdminAppServiceService) {
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

// Obtener todos los administradores de app
getAllAdministradores(): void {
  this.adminAppService.getAdminApps().subscribe(
    (data: AdministradorApp[]) => {
      this.administradores = data;
      console.log('Administradores App cargados:', this.administradores);
    },
    error => {
      console.error('Error al cargar los administradores de app:', error);
    }
  );
}

// Obtener todas las direcciones de administradores de app
getAllDirecciones(): void {
  this.adminAppService.getDireccionesAdminApp().subscribe(
    (data: Direccion_AdministradorApp[]) => {
      this.direcciones_administrador = data;
      console.log('Direcciones cargadas:', this.direcciones_administrador);
    },
    error => {
      console.error('Error al cargar las direcciones:', error);
    }
  );
}

// Obtener todos los teléfonos de administradores de app
getAllTelefonos(): void {
  this.adminAppService.getAllTelefonosAdminApp().subscribe(
    (data: Telefono_AdminApp[]) => {
      this.telefonos_admin = data;
      console.log('Teléfonos cargados:', this.telefonos_admin);
    },
    error => {
      console.error('Error al cargar los teléfonos administradores:', error);
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
  if(this.telefonos.length > 1) {
    this.telefonos.removeAt(index);
  }
}

getTelefonosByCedulaRegister(cedula: string): Telefono_AdminApp[] {
  return this.telefonos_admin.filter(tel => tel.cedula_admin === cedula);
}

/*TAB ACTIVE */
setActiveTab(tab: string) {
  this.activeTab = tab;
}

getDireccionByCedula(cedula: string): Direccion_AdministradorApp | undefined {
  return this.direcciones_administrador.find(direccion => direccion.id_admin === cedula);
}

    /*ADMINISTRADORES */
/*ADMINISTRADORES APP*/
  private createNewAdmin(adminData: any, cedulaAdmin: string) {
    let adminToAdd = this.buildAdminObject(adminData);
    let direccionToAdd = this.buildDireccionObject(adminData, cedulaAdmin);

    this.saveAdminToAPI(adminToAdd);
    this.saveDireccionToAPI(direccionToAdd);
    this.saveTelefonosToAPI(this.telefonos.value, cedulaAdmin);
  }

  private buildAdminObject(data: any): AdministradorApp {
    return {
      usuario: data.usuario,
      password: data.password,
      cedula: data.cedula,
      nombre: data.nombre,
      apellido1: data.apellido1,
      apellido2: data.apellido2
    };
  }

  private buildDireccionObject(data: any, cedulaAdmin: string): Direccion_AdministradorApp {
    return {
      id_admin: cedulaAdmin,
      provincia: data.provincia,
      canton: data.canton,
      distrito: data.distrito
    };
  }

  private buildTelefonosArray(telefonos: any[], cedulaAdmin: string): Telefono_AdminApp[] {
    return telefonos.map(tel => ({
      cedula_admin: cedulaAdmin,
      telefono: tel.telefono
    }));
  }

  // API Save Methods
  private saveAdminToAPI(admin: AdministradorApp): void {
    this.adminAppService.createAdminApp(admin).subscribe({
      next: (response) => {
        console.log('Administrador App guardado en la API:', response);
        this.getAllAdministradores();
      },
      error: (error) => console.error('Error al guardar el administrador App en la API:', error)
    });
  }

  private saveDireccionToAPI(direccion: Direccion_AdministradorApp): void {
    this.adminAppService.createDireccionesAdminApp(direccion).subscribe({
      next: (response) => {
        console.log('Dirección del Administrador App guardada en la API:', response);
        this.getAllDirecciones();
      },
      error: (error) => console.error('Error al guardar la dirección del Administrador App en la API:', error)
    });
  }

  private saveTelefonosToAPI(telefonos: any[], cedulaAdmin: string): void {
    telefonos.forEach(tel => {
      let telefonoToAdd: Telefono_AdminApp = {
        cedula_admin: cedulaAdmin,
        telefono: tel.telefono
      };
      this.adminAppService.createTelefonosAdminApp(telefonoToAdd).subscribe({
        next: (response) => {
          console.log('Teléfono del Administrador App guardado en la API:', response);
          this.getAllTelefonos();
        },
        error: (error) => console.error('Error al guardar el teléfono del Administrador App en la API:', error)
      });
    });
  }



  // API Update Methods

 private updateExistingAdmin(adminData: any): void {
    let adminToUpdate = this.buildAdminObject(adminData);
    let direccionToUpdate = this.buildDireccionObject(adminData, adminData.cedula);
    let telefonosToUpdate = this.buildTelefonosArray(this.telefonos.value, adminData.cedula);

    this.updateAdminInAPI(adminToUpdate);
    this.updateDireccionInAPI(direccionToUpdate);
    this.updateTelefonosInAPI(adminData.cedula, telefonosToUpdate);
  }

  // API Update Methods
  private updateAdminInAPI(admin: AdministradorApp): void {
    this.adminAppService.updateAdminApp(admin).subscribe({
      next: (response) => {
        console.log('Administrador App actualizado:', response);
        this.getAllAdministradores();
      },
      error: (error) => console.error('Error al actualizar el administrador App:', error)
    });
  }

  private updateDireccionInAPI(direccion: Direccion_AdministradorApp): void {
    this.adminAppService.updateDireccionAdminApp(direccion).subscribe({
      next: (response) => {
        console.log('Dirección del Administrador App actualizada:', response);
        this.getAllDirecciones();
      },
      error: (error) => console.error('Error al actualizar la dirección del Administrador App:', error)
    });
  }

  private updateTelefonosInAPI(cedula: string, telefonos: Telefono_AdminApp[]): void {
    this.adminAppService.putTelefonosAdminApp(cedula, telefonos).subscribe({
      next: (response) => {
        console.log('Teléfonos del Administrador App actualizados en la API:', response);
        this.getAllTelefonos();
      },
      error: (error) => console.error('Error al actualizar los teléfonos del Administrador App en la API:', error)
    });
  }

  // Public Save Method
  saveAdmin(): void {
    if (this.adminForm.valid) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: this.editMode ? 'Se actualizará la información del administrador de la app' : 'Se creará un nuevo administrador de la app',
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
            text: this.editMode ? 'Administrador de app actualizado correctamente' : 'Administrador de app creado correctamente',
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
    console.log("cedula admin app ", cedula)
    this.loadAdminData(cedula);
  }

  private loadAdminData(cedula: string): void {
    this.loadAdminDetails(cedula);
    this.loadAdminDireccion(cedula);
    this.loadAdminTelefonos(cedula);
  }

  private loadAdminDetails(cedula: string): void {
    this.adminAppService.getOneAdminApp(cedula).subscribe({
      next: (adminData) => {
        this.patchAdminForm(adminData);
      },
      error: (error) => console.error('Error al obtener el administrador de app:', error)
    });
  }

  private loadAdminDireccion(cedula: string): void {
    this.adminAppService.getDireccionAdminApp(cedula).subscribe({
      next: (direccionData) => {
        console.log("direccion data del admin app", direccionData)
        this.patchDireccionForm(direccionData);
      },
      error: (error) => console.error('Error al obtener la dirección del administrador de app:', error)
    });
  }

  private loadAdminTelefonos(cedula: string): void {
    this.adminAppService.getTelefonosAdminApp(cedula).subscribe({
      next: (telefonosData) => {
        this.updateTelefonosFormArray(telefonosData);
      },
      error: (error) => console.error('Error al obtener los teléfonos del administrador de app:', error)
    });
  }

  private patchAdminForm(adminData: AdministradorApp): void {
    this.adminForm.patchValue({
      usuario: adminData.usuario,
      password: adminData.password,
      cedula: adminData.cedula,
      nombre: adminData.nombre,
      apellido1: adminData.apellido1,
      apellido2: adminData.apellido2
    });
  }

  private patchDireccionForm(direccionData: Direccion_AdministradorApp): void {
    this.adminForm.patchValue({
      provincia: direccionData.provincia,
      canton: direccionData.canton,
      distrito: direccionData.distrito
    });
  }

  private updateTelefonosFormArray(telefonosData: Telefono_AdminApp[]): void {
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
      text: 'Esta acción eliminará toda la información del administrador de app y no se puede deshacer',
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
    this.adminAppService.deleteTelefonosAdminApp(cedula).subscribe({
      next: () => {
        console.log('Teléfonos del administrador de app eliminados correctamente');
        this.deleteDireccionProcess(cedula);
      },
      error: (error) => {
        console.error('Error al eliminar los teléfonos del administrador de app:', error);
        this.handleDeleteError('teléfonos del administrador de app');
      }
    });
  }

  // Proceso de eliminación de dirección
  private deleteDireccionProcess(cedula: string): void {
    this.adminAppService.deleteDireccionesAdminApp(cedula).subscribe({
      next: () => {
        console.log('Dirección del administrador de app eliminada correctamente');
        this.deleteAdminProcess(cedula);
      },
      error: (error) => {
        console.error('Error al eliminar la dirección del administrador de app:', error);
        this.handleDeleteError('dirección del administrador de app');
      }
    });
  }

  // Proceso de eliminación del administrador
  private deleteAdminProcess(cedula: string): void {
    this.adminAppService.deleteAdminApp(cedula).subscribe({
      next: () => {
        console.log('Administrador de app eliminado correctamente');
        this.handleDeleteSuccess();
      },
      error: (error) => {
        console.error('Error al eliminar el administrador de app:', error);
        this.handleDeleteError('administrador de app');
      }
    });
  }

  private handleDeleteSuccess(): void {
    this.updateAllData();
    Swal.fire({
      title: 'Eliminado',
      text: 'El administrador de app ha sido eliminado correctamente',
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


// Reset del formulario
private resetForm(): void {
  this.adminForm.reset();
  this.telefonosFormArray.clear();
  this.telefonosFormArray.push(this.createTelefonoFormGroup()); // Agregar al menos un teléfono vacío
  this.editMode = false;
}

// Mostrar errores del formulario
mostrarErroresFormulario(): void {
  // Revisar errores en campos principales del administrador de app
  Object.keys(this.adminForm.controls).forEach(field => {
    let control = this.adminForm.get(field);
    if (control?.invalid) {
      console.log(`Error en el campo '${field}' del administrador de app:`, control.errors);
    }
  });

  // Revisar errores en teléfonos del administrador de app
  let telefonosArray = this.adminForm.get('TelefonosAdmin') as FormArray;
  telefonosArray.controls.forEach((control, index) => {
    if (control.invalid) {
      console.log(`Error en el teléfono #${index + 1} del administrador de app:`, control.errors);
    }
  });
}

// Manejo de errores de validación específicos
getErrorMessage(controlName: string): string {
  let control = this.adminForm.get(controlName);
  if (control?.hasError('required')) {
    return `El campo ${controlName} es requerido`;
  }
  // Puedes agregar más validaciones específicas aquí
  return '';
}

// Verificar si un control es inválido
isFieldInvalid(controlName: string): boolean {
  let control = this.adminForm.get(controlName);
  return control ? control.invalid && (control.dirty || control.touched) : false;
}

// Validar formulario completo
validateForm(): boolean {
  if (this.adminForm.invalid) {
    Object.keys(this.adminForm.controls).forEach(key => {
      let control = this.adminForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
    return false;
  }
  return true;
}

// Limpiar datos específicos
clearFormData(): void {
  this.currentAdmin = null;
  this.currentAdminDireccion = null;
  this.resetForm();
}

// Cancelar edición
cancelEdit(): void {
  this.clearFormData();
  this.editMode = false;
  this.setActiveTab('crear');
}

// Verificar cambios sin guardar
hasUnsavedChanges(): boolean {
  return this.adminForm.dirty;
}

// Confirmar salida con cambios sin guardar
confirmDiscardChanges(): Promise<boolean> {
  if (this.hasUnsavedChanges()) {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: 'Hay cambios sin guardar en el administrador de app. ¿Deseas descartarlos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, descartar',
      cancelButtonText: 'No, continuar editando'
    }).then((result) => {
      return result.isConfirmed;
    });
  }
  return Promise.resolve(true);
}
}

















