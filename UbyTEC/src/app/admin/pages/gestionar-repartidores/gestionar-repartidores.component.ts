import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { Repartidor } from '../../interfaces/repartidos/Repartidor';
import { Direccion_Repartidor } from '../../interfaces/repartidos/Direccion_Repartidor';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RepartidorService } from '../../services/ServicioRepartidorAPI/repartidor.service';
import { Telefono_repartidor } from '../../interfaces/repartidos/Telefono_repartidor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gestionar-repartidores',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, HttpClientModule ,HeaderAdminComponent],
  providers: [RepartidorService,HttpClient],
  templateUrl: './gestionar-repartidores.component.html',
  styleUrl: './gestionar-repartidores.component.css'
})
export class GestionarRepartidoresComponent implements OnInit {


  repartidorForm!: FormGroup;
  editMode: boolean = false;
  activeTab: string = 'crear';
  telefonosFormArray: FormArray;
  currentRepartidor: Repartidor | null = null;
  currentRepartidorDireccion: Direccion_Repartidor | null = null;
  repartidores: Repartidor[] = [];
  direcciones_repartidor: Direccion_Repartidor[] = [];
  telefonos_repartidor: Telefono_repartidor[] = [];

  constructor(private fb: FormBuilder, private repartidorService: RepartidorService) {
    this.telefonosFormArray = this.fb.array([]);
    this.initForm();
  }


  private initForm(): void {
    this.repartidorForm = this.fb.group({
      id:['',Validators.required],
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      TelefonosRepartidor: this.fb.array([
        this.createTelefonoFormGroup()
      ])
    });
  }

  ngOnInit(): void {
    this.getAllRepartidores();
    this.getAllDirecciones();
    this.getAllTelefonos();
  }

  // Métodos para obtener datos
  getAllRepartidores(): void {
    this.repartidorService.getRepartidores().subscribe({
      next: (data: Repartidor[]) => {
        this.repartidores = data;
        console.log('Repartidores cargados:', this.repartidores);
      },
      error: error => {
        console.error('Error al cargar los repartidores:', error);
        this.handleError('Error al cargar los repartidores');
      }
    });
  }

  getAllDirecciones(): void {
    this.repartidorService.getDireccionesRepartidor().subscribe({
      next: (data: Direccion_Repartidor[]) => {
        this.direcciones_repartidor = data;
        console.log('Direcciones cargadas:', this.direcciones_repartidor);
      },
      error: error => {
        console.error('Error al cargar las direcciones:', error);
        this.handleError('Error al cargar las direcciones');
      }
    });
  }

  getAllTelefonos(): void {
    this.repartidorService.getTelefonosRepartidor().subscribe({
      next: (data: Telefono_repartidor[]) => {
        this.telefonos_repartidor = data;
        console.log('Teléfonos cargados:', this.telefonos_repartidor);
      },
      error: error => {
        console.error('Error al cargar los teléfonos:', error);
        this.handleError('Error al cargar los teléfonos');
      }
    });
  }

  // Métodos para manejar teléfonos
  createTelefonoFormGroup(): FormGroup {
    return this.fb.group({
      telefono: ['', Validators.required]
    });
  }

  get telefonos() {
    return this.repartidorForm.get('TelefonosRepartidor') as FormArray;
  }

  addTelefonoRegister() {
    this.telefonos.push(this.createTelefonoFormGroup());
  }

  removeTelefonoRegister(index: number) {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  // Método para cambiar entre pestañas
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getDireccionByid(id: number): Direccion_Repartidor | undefined {
    console.log('Buscando dirección para ID:', id);
    let direccion = this.direcciones_repartidor.find(d => d.id_Repartidor === id);
    console.log('Dirección encontrada:', direccion);
    return direccion;
  }

  getTelefonosByidRepartidor(id: number): Telefono_repartidor[] {
    console.log('Buscando teléfonos para ID:', id);
    let telefonos = this.telefonos_repartidor.filter(t => t.cedula_Repartidor === id);
    console.log('Teléfonos encontrados:', telefonos);
    return telefonos;
  }


// Métodos para crear y actualizar repartidores
saveRepartidor(): void {
  if (this.repartidorForm.valid) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: this.editMode ? 'Se actualizará la información del repartidor' : 'Se creará un nuevo repartidor',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let repartidorData = this.repartidorForm.value;
        let idRepartidor = this.editMode ? this.currentRepartidor?.id : null;

        if (!this.editMode) {
          this.createNewRepartidor(repartidorData);
        } else if (idRepartidor) {
          this.updateExistingRepartidor(repartidorData, idRepartidor);
        }
      }
    });
  } else {
    Swal.fire({
      title: 'Error',
      text: 'Por favor, complete todos los campos requeridos',
      icon: 'error'
    });
  }
}

private createNewRepartidor(repartidorData: any): void {
  // Generar contraseña aleatoria
  let password = this.repartidorService.generateRandomPassword();

  let repartidorToAdd = this.buildRepartidorObject(repartidorData, password);

  // Crear repartidor
  this.repartidorService.createRepartidor(repartidorToAdd).subscribe({
    next: (repartidorResponse) => {
      console.log('Repartidor creado:', repartidorResponse);

      // Crear dirección
      let direccionToAdd = this.buildDireccionObject(repartidorData, repartidorResponse.id);
      this.repartidorService.createDireccionRepartidor(direccionToAdd).subscribe({
        next: (direccionResponse) => {
          console.log('Dirección creada:', direccionResponse);

          // Crear teléfonos
          let telefonosToAdd = this.buildTelefonosArray(this.telefonos.value, repartidorResponse.id);
          this.createTelefonos(telefonosToAdd);

          // Enviar contraseña por correo
          this.repartidorService.sendPasswordByEmail(repartidorResponse.correo, password).subscribe({
            next: () => {
              this.showSuccess('Repartidor creado exitosamente. Se ha enviado la contraseña por correo.');
              this.resetForm();
              this.updateAllData();
            },
            error: (error) => {
              console.error('Error al enviar el correo:', error);
              this.handleError('Error al enviar la contraseña por correo');
            }
          });
        },
        error: (error) => {
          console.error('Error al crear la dirección:', error);
          this.handleError('Error al crear la dirección');
        }
      });
    },
    error: (error) => {
      console.error('Error al crear el repartidor:', error);
      this.handleError('Error al crear el repartidor');
    }
  });
}

private updateExistingRepartidor(repartidorData: any, id: number): void {
  let repartidorToUpdate = this.buildRepartidorObject(repartidorData);
  repartidorToUpdate.id = id;

  this.repartidorService.updateRepartidor(repartidorToUpdate).subscribe({
    next: (repartidorResponse) => {
      console.log('Repartidor actualizado:', repartidorResponse);

      let direccionToUpdate = this.buildDireccionObject(repartidorData, id);
      this.repartidorService.updateDireccionRepartidor(direccionToUpdate).subscribe({
        next: (direccionResponse) => {
          console.log('Dirección actualizada:', direccionResponse);

          let telefonosToUpdate = this.buildTelefonosArray(this.telefonos.value, id);
          this.updateTelefonos(id, telefonosToUpdate);
        },
        error: (error) => {
          console.error('Error al actualizar la dirección:', error);
          this.handleError('Error al actualizar la dirección');
        }
      });
    },
    error: (error) => {
      console.error('Error al actualizar el repartidor:', error);
      this.handleError('Error al actualizar el repartidor');
    }
  });
}

// Métodos auxiliares para construir objetos
private buildRepartidorObject(data: any, password?: string): Repartidor {
  return {
    id: data.id || 0,
    usuario: data.usuario?.trim() || '',
    password: password || '', // Solo se usa en creación
    nombre: data.nombre?.trim() || '',
    apellido1: data.apellido1?.trim() || '',
    apellido2: data.apellido2?.trim() || '',
    correo: data.correo?.trim() || ''
  };
}

private buildDireccionObject(data: any, id_Repartidor: number): Direccion_Repartidor {
  return {
    id_Repartidor: id_Repartidor,
    provincia: data.provincia?.trim() || '',
    canton: data.canton?.trim() || '',
    distrito: data.distrito?.trim() || ''
  };
}

private buildTelefonosArray(telefonos: any[], id_Repartidor: number): Telefono_repartidor[] {
  return telefonos.map(tel => ({
    cedula_Repartidor: id_Repartidor,
    telefono: tel.telefono?.trim() || ''
  }));
}

// Métodos para manejar teléfonos
private createTelefonos(telefonos: Telefono_repartidor[]): void {
  telefonos.forEach(telefono => {
    this.repartidorService.createTelefonoRepartidor(telefono).subscribe({
      next: (response) => console.log('Teléfono creado:', response),
      error: (error) => console.error('Error al crear teléfono:', error)
    });
  });
}

private updateTelefonos(id: number, telefonos: Telefono_repartidor[]): void {
  this.repartidorService.putTelefonosRepartidor(id, telefonos).subscribe({
    next: (response) => {
      console.log('Teléfonos actualizados:', response);
      this.showSuccess('Repartidor y datos relacionados actualizados correctamente');
      this.resetForm();
      this.updateAllData();
    },
    error: (error) => {
      console.error('Error al actualizar teléfonos:', error);
      this.handleError('Error al actualizar los teléfonos');
    }
  });
}



editRepartidor(id: number): void {
  // Encontrar el repartidor
  let repartidor = this.repartidores.find(r => r.id === id);
  if (!repartidor) {
    this.handleError('Repartidor no encontrado');
    return;
  }

  this.editMode = true;
  this.currentRepartidor = repartidor;

  // Obtener la dirección y teléfonos
  let direccion = this.getDireccionByid(id);
  let telefonos = this.getTelefonosByidRepartidor(id);

  // Establecer los valores en el formulario
  this.repartidorForm.patchValue({
    id: repartidor.id,
    usuario: repartidor.usuario,
    nombre: repartidor.nombre,
    apellido1: repartidor.apellido1,
    apellido2: repartidor.apellido2,
    correo: repartidor.correo,
    provincia: direccion?.provincia || '',
    canton: direccion?.canton || '',
    distrito: direccion?.distrito || ''
  });

  // Limpiar y agregar los teléfonos existentes
  let telefonosFormArray = this.repartidorForm.get('TelefonosRepartidor') as FormArray;
  telefonosFormArray.clear();

  if (telefonos.length > 0) {
    telefonos.forEach(tel => {
      telefonosFormArray.push(this.fb.group({
        telefono: [tel.telefono, Validators.required]
      }));
    });
  } else {
    telefonosFormArray.push(this.createTelefonoFormGroup());
  }

  // Cambiar a la tab de edición
  this.setActiveTab('crear');
}

// Métodos para eliminar repartidor y datos relacionados
deleteAllInfoRepartidor(id: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará toda la información del repartidor y no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33'
  }).then((result) => {
    if (result.isConfirmed) {
      this.deleteTelefonosProcess(id);
    }
  });
}

private deleteTelefonosProcess(id: number): void {
  this.repartidorService.deleteTelefonoRepartidor(id).subscribe({
    next: () => {
      console.log('Teléfonos eliminados');
      this.deleteDireccionProcess(id);
    },
    error: (error) => {
      console.error('Error al eliminar teléfonos:', error);
      this.handleError('Error al eliminar los teléfonos');
    }
  });
}

private deleteDireccionProcess(id: number): void {
  this.repartidorService.deleteDireccionRepartidor(id).subscribe({
    next: () => {
      console.log('Dirección eliminada');
      this.deleteRepartidorProcess(id);
    },
    error: (error) => {
      console.error('Error al eliminar dirección:', error);
      this.handleError('Error al eliminar la dirección');
    }
  });
}

private deleteRepartidorProcess(id: number): void {
  this.repartidorService.deleteRepartidor(id).subscribe({
    next: () => {
      this.showSuccess('Repartidor eliminado correctamente');
      this.updateAllData();
    },
    error: (error) => {
      console.error('Error al eliminar repartidor:', error);
      this.handleError('Error al eliminar el repartidor');
    }
  });
}

// Métodos de utilidad
private updateAllData(): void {
  this.getAllRepartidores();
  this.getAllDirecciones();
  this.getAllTelefonos();
}

 resetForm(): void {
  this.repartidorForm.reset();
  this.telefonosFormArray.clear();
  this.telefonosFormArray.push(this.createTelefonoFormGroup());
  this.editMode = false;
}

private showSuccess(message: string): void {
  Swal.fire({
    title: 'Éxito',
    text: message,
    icon: 'success'
  });
}

private handleError(message: string): void {
  Swal.fire({
    title: 'Error',
    text: message,
    icon: 'error'
  });
}





}
