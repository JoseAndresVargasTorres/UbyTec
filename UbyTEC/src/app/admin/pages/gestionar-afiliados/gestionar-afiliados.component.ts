import { Component } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { Afiliado } from '../../interfaces/Afiliado';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Telefono_comercio } from '../../interfaces/Telefono_comercio';
import { CommonModule } from '@angular/common';
import { Tipo_Comercio } from '../../interfaces/Tipo_Comercio';
import { Admin } from '../../interfaces/Admin';
import { Direccion_Comercio } from '../../interfaces/Direccion_Comercio';
import { AfiliadoService } from '../../services/ServicioAfiliadoAPI/afiliado.service';
import Swal from 'sweetalert2';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-gestionar-afiliados',
  standalone: true,
  imports: [HeaderAdminComponent, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [HttpClient], // Add this line
  templateUrl: './gestionar-afiliados.component.html',
  styleUrls: ['./gestionar-afiliados.component.css']
})
export class GestionarAfiliadosComponent {

  afiliadoForm: FormGroup;
  editMode: boolean = false;
  activeTab: string = 'crear';
  telefonosFormArray: FormArray;

  afiliados: Afiliado[] = [];
  direcciones_comercio: Direccion_Comercio[] = [];
  telefonos_comercio: Telefono_comercio[] = [];
  tipos_comercio: Tipo_Comercio[] = [];
  administradores: Admin[] = [];

  constructor(private fb: FormBuilder, private afiliadoService: AfiliadoService) {
    this.telefonosFormArray = this.fb.array([]);

    this.afiliadoForm = this.fb.group({
      cedula_juridica: ['', Validators.required],
      nombre: ['', Validators.required],
      id_tipo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      SINPE: ['', Validators.required],
      cedula_admin: ['', Validators.required],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      TelefonosComercio: this.fb.array([
        this.createTelefonoFormGroup()
      ])
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.getAllAfiliados();
    this.getAllDirecciones();
    this.getAllTelefonos();
    this.getTiposComercio();
    this.getAllAdministradores();
  }

  getAllAfiliados(): void {
    this.afiliadoService.getAfiliados().subscribe({
      next: (data: Afiliado[]) => {
        this.afiliados = data;
        console.log('Afiliados cargados:', this.afiliados);
      },
      error: error => console.error('Error al cargar los afiliados:', error)
    });
  }

  getAllDirecciones(): void {
    this.afiliadoService.getDirecciones().subscribe({
      next: (data: Direccion_Comercio[]) => {
        this.direcciones_comercio = data;
        console.log('Direcciones cargadas:', this.direcciones_comercio);
      },
      error: error => console.error('Error al cargar las direcciones:', error)
    });
  }

  getAllTelefonos(): void {
    this.afiliadoService.getTelefonos().subscribe({
      next: (data: Telefono_comercio[]) => {
        this.telefonos_comercio = data;
        console.log('Teléfonos cargados:', this.telefonos_comercio);
      },
      error: error => console.error('Error al cargar los teléfonos:', error)
    });
  }

  getTiposComercio(): void {
    this.afiliadoService.getTiposdeComercio().subscribe({
      next: (data: Tipo_Comercio[]) => {
        this.tipos_comercio = data;
        console.log('Tipos de comercio cargados:', this.tipos_comercio);
      },
      error: error => console.error('Error al cargar los tipos de comercio:', error)
    });
  }

  getAllAdministradores(): void {
    this.afiliadoService.getAdmins().subscribe({
      next: (data: Admin[]) => {
        this.administradores = data;
        console.log('Administradores cargados:', this.administradores);
      },
      error: error => console.error('Error al cargar los administradores:', error)
    });
  }

  createTelefonoFormGroup(): FormGroup {
    return this.fb.group({
      telefono: ['', Validators.required]
    });
  }

  get telefonos() {
    return this.afiliadoForm.get('TelefonosComercio') as FormArray;
  }

  addTelefonoRegister() {
    this.telefonos.push(this.createTelefonoFormGroup());
  }

  removeTelefonoRegister(index: number) {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  getTelefonosByCedula(cedula: string): Telefono_comercio[] {
    return this.telefonos_comercio.filter(tel => tel.cedula_comercio === cedula);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getDireccionByCedula(cedula: string): Direccion_Comercio | undefined {
    return this.direcciones_comercio.find(direccion => direccion.id_comercio === cedula);
  }

  private createNewAfiliado(data: any, cedulaJuridica: string) {
    const afiliado = this.buildAfiliadoObject(data);
    const direccion = this.buildDireccionObject(data, cedulaJuridica);

    this.saveAfiliadoToAPI(afiliado);
    this.saveDireccionToAPI(direccion);
    this.saveTelefonosToAPI(this.telefonos.value, cedulaJuridica);
  }

  private updateExistingAfiliado(data: any): void {
    const afiliado = this.buildAfiliadoObject(data);
    const direccion = this.buildDireccionObject(data, data.cedula_juridica);
    const telefonos = this.buildTelefonosArray(this.telefonos.value, data.cedula_juridica);

    this.updateAfiliadoInAPI(afiliado);
    this.updateDireccionInAPI(direccion);
    this.updateTelefonosInAPI(data.cedula_juridica, telefonos);
  }

  private buildAfiliadoObject(data: any): Afiliado {
    return {
      cedula_juridica: data.cedula_juridica,
      nombre: data.nombre,
      correo: data.correo,
      SINPE: data.SINPE,
      id_tipo: data.id_tipo,
      cedula_admin: data.cedula_admin
    };
  }

  private buildDireccionObject(data: any, cedulaJuridica: string): Direccion_Comercio {
    return {
      id_comercio: cedulaJuridica,
      provincia: data.provincia,
      canton: data.canton,
      distrito: data.distrito
    };
  }

  private buildTelefonosArray(telefonos: any[], cedulaJuridica: string): Telefono_comercio[] {
    return telefonos.map(tel => ({
      cedula_comercio: cedulaJuridica,
      telefono: tel.telefono
    }));
  }

  private saveAfiliadoToAPI(afiliado: Afiliado): void {
    this.afiliadoService.createAfiliados(afiliado).subscribe({
      next: (response) => {
        console.log('Afiliado guardado:', response);
        this.getAllAfiliados();
      },
      error: (error) => console.error('Error al guardar el afiliado:', error)
    });
  }

  private saveDireccionToAPI(direccion: Direccion_Comercio): void {
    this.afiliadoService.createDirecciones(direccion).subscribe({
      next: (response) => {
        console.log('Dirección guardada:', response);
        this.getAllDirecciones();
      },
      error: (error) => console.error('Error al guardar la dirección:', error)
    });
  }

  private saveTelefonosToAPI(telefonos: any[], cedulaJuridica: string): void {
    telefonos.forEach(tel => {
      const telefono: Telefono_comercio = {
        cedula_comercio: cedulaJuridica,
        telefono: tel.telefono
      };
      this.afiliadoService.createTelefonos(telefono).subscribe({
        next: (response) => {
          console.log('Teléfono guardado:', response);
          this.getAllTelefonos();
        },
        error: (error) => console.error('Error al guardar el teléfono:', error)
      });
    });
  }

  private updateAfiliadoInAPI(afiliado: Afiliado): void {
    this.afiliadoService.updateAfiliado(afiliado).subscribe({
      next: (response) => {
        console.log('Afiliado actualizado:', response);
        this.getAllAfiliados();
      },
      error: (error) => console.error('Error al actualizar el afiliado:', error)
    });
  }

  private updateDireccionInAPI(direccion: Direccion_Comercio): void {
    this.afiliadoService.updateDireccion(direccion).subscribe({
      next: (response) => {
        console.log('Dirección actualizada:', response);
        this.getAllDirecciones();
      },
      error: (error) => console.error('Error al actualizar la dirección:', error)
    });
  }

  private updateTelefonosInAPI(cedula: string, telefonos: Telefono_comercio[]): void {
    this.afiliadoService.putTelefonos(cedula, telefonos).subscribe({
      next: (response) => {
        console.log('Teléfonos actualizados:', response);
        this.getAllTelefonos();
      },
      error: (error) => console.error('Error al actualizar los teléfonos:', error)
    });
  }

  saveAfiliado(): void {
    if (this.afiliadoForm.valid) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: this.editMode ? 'Se actualizará la información del afiliado' : 'Se creará un nuevo afiliado',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          const afiliadoData = this.afiliadoForm.value;
          const cedulaJuridica = afiliadoData.cedula_juridica;

          if (!this.editMode) {
            this.createNewAfiliado(afiliadoData, cedulaJuridica);
          } else {
            this.updateExistingAfiliado(afiliadoData);
          }

          this.resetForm();

          Swal.fire({
            title: 'Éxito',
            text: this.editMode ? 'Afiliado actualizado correctamente' : 'Afiliado creado correctamente',
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

  editAfiliado(cedulaJuridica: string): void {
    this.editMode = true;
    this.setActiveTab("crear");
    this.loadAfiliadoData(cedulaJuridica);
  }

  private loadAfiliadoData(cedulaJuridica: string): void {
    this.loadAfiliadoDetails(cedulaJuridica);
    this.loadAfiliadoDireccion(cedulaJuridica);
    this.loadAfiliadoTelefonos(cedulaJuridica);
  }

  private loadAfiliadoDetails(cedulaJuridica: string): void {
    this.afiliadoService.getOneComercio(cedulaJuridica).subscribe({
      next: (data) => this.patchAfiliadoForm(data),
      error: (error) => console.error('Error al obtener el afiliado:', error)
    });
  }

  private loadAfiliadoDireccion(cedulaJuridica: string): void {
    this.afiliadoService.getDireccionComercio(cedulaJuridica).subscribe({
      next: (data) => this.patchDireccionForm(data),
      error: (error) => console.error('Error al obtener la dirección:', error)
    });
  }

  private loadAfiliadoTelefonos(cedulaJuridica: string): void {
    this.afiliadoService.getTelefonosComercio(cedulaJuridica).subscribe({
      next: (data) => this.updateTelefonosFormArray(data),
      error: (error) => console.error('Error al obtener los teléfonos:', error)
    });
  }

  private patchAfiliadoForm(afiliadoData: any): void {
    this.afiliadoForm.patchValue({
      cedula_juridica: afiliadoData.cedula_juridica,
      nombre: afiliadoData.nombre,
      correo: afiliadoData.correo,
      SINPE: afiliadoData.SINPE,
      id_tipo: afiliadoData.id_tipo,
      cedula_admin: afiliadoData.cedula_admin
    });
  }

  private patchDireccionForm(direccionData: Direccion_Comercio): void {
    this.afiliadoForm.patchValue({
      provincia: direccionData.provincia,
      canton: direccionData.canton,
      distrito: direccionData.distrito
    });
  }

  private updateTelefonosFormArray(telefonosData: Telefono_comercio[]): void {
    this.telefonosFormArray = this.afiliadoForm.get('TelefonosComercio') as FormArray;
    this.telefonosFormArray.clear();

    telefonosData.forEach((telefono) => {
      this.telefonosFormArray.push(this.fb.group({
        telefono: telefono.telefono
      }));
    });
  }

  deleteAfiliado(cedulaJuridica: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará toda la información del afiliado y no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTelefonosProcess(cedulaJuridica);
      }
    });
  }

  private deleteTelefonosProcess(cedulaJuridica: string): void {
    this.afiliadoService.deleteTelefonosAdmin(cedulaJuridica).subscribe({
      next: () => {
        console.log('Teléfonos eliminados correctamente');
        this.deleteDireccionProcess(cedulaJuridica);
      },
      error: (error) => {
        console.error('Error al eliminar los teléfonos:', error);
        this.handleDeleteError('teléfonos');
      }
    });
  }

  private deleteDireccionProcess(cedulaJuridica: string): void {
    this.afiliadoService.deleteDireccionesComercio(cedulaJuridica).subscribe({
      next: () => {
        console.log('Dirección eliminada correctamente');
        this.deleteAfiliadoProcess(cedulaJuridica);
      },
      error: (error) => {
        console.error('Error al eliminar la dirección:', error);
        this.handleDeleteError('dirección');
      }
    });
  }

  private deleteAfiliadoProcess(cedulaJuridica: string): void {
    this.afiliadoService.deleteComercio(cedulaJuridica).subscribe({
      next: () => {
        console.log('Afiliado eliminado correctamente');
        this.handleDeleteSuccess();
      },
      error: (error) => {
        console.error('Error al eliminar el afiliado:', error);
        this.handleDeleteError('afiliado');
      }
    });
  }

  private handleDeleteSuccess(): void {
    this.updateAllData();
    Swal.fire({
      title: 'Eliminado',
      text: 'El afiliado ha sido eliminado correctamente',
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

  private updateAllData(): void {
    this.getAllAfiliados();
    this.getAllDirecciones();
    this.getAllTelefonos();
    this.getTiposComercio();
    this.getAllAdministradores();
  }

  private resetForm(): void {
    this.afiliadoForm.reset();
    const telefonosArray = this.afiliadoForm.get('TelefonosComercio') as FormArray;
    while (telefonosArray.length > 1) {
      telefonosArray.removeAt(1);
    }
    telefonosArray.at(0).reset();
    this.editMode = false;
  }

  mostrarErroresFormulario(): void {
    // Revisar errores en campos principales
    Object.keys(this.afiliadoForm.controls).forEach(field => {
      const control = this.afiliadoForm.get(field);
      if (control?.invalid) {
        console.log(`Error en el campo '${field}':`, control.errors);
      }
    });

    // Revisar errores en teléfonos
    const telefonosArray = this.afiliadoForm.get('TelefonosComercio') as FormArray;
    telefonosArray.controls.forEach((control, index) => {
      if (control.invalid) {
        console.log(`Error en el teléfono #${index + 1}:`, control.errors);
      }
    });
  }
}
