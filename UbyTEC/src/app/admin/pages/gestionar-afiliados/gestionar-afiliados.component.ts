import { Component } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { Afiliado } from '../../interfaces/comercioafiliado/Afiliado';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Telefono_comercio } from '../../interfaces/comercioafiliado/Telefono_comercio';
import { CommonModule } from '@angular/common';
import { Tipo_Comercio } from '../../interfaces/tipocomercio/Tipo_Comercio';
import { Direccion_Comercio } from '../../interfaces/comercioafiliado/Direccion_Comercio';
import { AfiliadoService } from '../../services/ServicioAfiliadoAPI/afiliado.service';
import Swal from 'sweetalert2';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AdminAppServiceService } from '../../services/ServicioAdminAPI/admin-service.service';
import { Direccion_AdministradorApp } from '../../interfaces/adminapp/Direccion_AdministradorApp ';
import { AdministradorApp } from '../../interfaces/adminapp/AdministradorApp';
import { Telefono_AdminApp } from '../../interfaces/adminapp/Telefono_AdminApp';
import { FilterPipe } from '../../pipes/filter.pipe';

@Component({
  selector: 'app-gestionar-afiliados',
  standalone: true,
  imports: [HeaderAdminComponent, ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [HttpClient,AfiliadoService,AdminAppServiceService,FilterPipe  ], // Add this line
  templateUrl: './gestionar-afiliados.component.html',
  styleUrls: ['./gestionar-afiliados.component.css']
})


export class GestionarAfiliadosComponent {
  // Formularios
  afiliadoForm!: FormGroup;
  adminForm!: FormGroup;

  // Estados de edición
  editMode: boolean = false;
  editModeAdmin: boolean = false;

  // Pestaña activa
  activeTab: string = 'crear-afiliado';

  // Arrays de FormArray para teléfonos
  telefonosAfiliadoArray!: FormArray;
  telefonosAdminArray!: FormArray;

  // Datos de Afiliados
  afiliados: Afiliado[] = [];
  direcciones_comercio: Direccion_Comercio[] = [];
  telefonos_comercio: Telefono_comercio[] = [];
  tipos_comercio: Tipo_Comercio[] = [];
  administradores: AdministradorApp[] = [];

  // Datos de Administradores
  administradoresApp: AdministradorApp[] = [];
  direcciones_administrador: Direccion_AdministradorApp[] = [];
  telefonos_admin: Telefono_AdminApp[] = [];

  constructor(
    private fb: FormBuilder,
    private afiliadoService: AfiliadoService,
    private adminAppService: AdminAppServiceService
  ) {
    this.initializeForms();
    this.loadInitialData();
  }

  // Método para cargar datos iniciales
  private loadInitialData(): void {
    this.loadAfiliadosData();
    this.loadAdministradoresData();
  }

  private loadAfiliadosData(): void {
    this.getAllAfiliados();
    this.getAllDirecciones();
    this.getAllTelefonosComercio();
    this.getTiposComercio();
    this.getAllAdministradores();
  }

  private loadAdministradoresData(): void {
    this.getAllAdministradoresApp();
    this.getAllDireccionesAdmin();
    this.getAllTelefonosAdmin();
  }


  // Inicialización de formularios
private initializeForms() {
  // Inicializar formulario de afiliado
  this.afiliadoForm = this.fb.group({
      cedula_Juridica: ['', Validators.required],
      nombre: ['', Validators.required],
      id_Tipo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      sinpe: ['', Validators.required],
      cedula_Admin: ['', Validators.required],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      TelefonosComercio: this.fb.array([
          this.createTelefonoFormGroup()
      ])
  });

  this.telefonosAfiliadoArray = this.afiliadoForm.get('TelefonosComercio') as FormArray;

  // Inicializar formulario de administrador
  this.adminForm = this.fb.group({
      usuario: ['', Validators.required],
      password: [''], // No requerido ya que se genera automáticamente
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]], // Agregamos el correo
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      TelefonosAdmin: this.fb.array([
          this.createTelefonoFormGroup()
      ])
  });

  this.telefonosAdminArray = this.adminForm.get('TelefonosAdmin') as FormArray;
}

// Métodos auxiliares para los formularios
private createTelefonoFormGroup(): FormGroup {
  return this.fb.group({
      telefono: ['', [
          Validators.required,
          Validators.pattern('^[0-9]{8}$') // Validación para números de 8 dígitos
      ]]
  });
}

// Métodos para manejar teléfonos del afiliado
addTelefonoAfiliado() {
  this.telefonosAfiliado.push(this.createTelefonoFormGroup());
}

removeTelefonoAfiliado(index: number) {
  if (this.telefonosAfiliado.length > 1) {
      this.telefonosAfiliado.removeAt(index);
  }
}

// Métodos para manejar teléfonos del administrador
addTelefonoAdmin() {
  this.telefonosAdmin.push(this.createTelefonoFormGroup());
}

removeTelefonoAdmin(index: number) {
  if (this.telefonosAdmin.length > 1) {
      this.telefonosAdmin.removeAt(index);
  }
}

// Método para resetear formularios
resetForms() {
  // Reset formulario de afiliado
  this.afiliadoForm.reset();
  while (this.telefonosAfiliado.length > 1) {
      this.telefonosAfiliado.removeAt(this.telefonosAfiliado.length - 1);
  }
  this.telefonosAfiliado.at(0).reset();

  // Reset formulario de administrador
  this.adminForm.reset();
  while (this.telefonosAdmin.length > 1) {
      this.telefonosAdmin.removeAt(this.telefonosAdmin.length - 1);
  }
  this.telefonosAdmin.at(0).reset();

  // Reset estados
  this.editMode = false;
  this.editModeAdmin = false;
}

// Reset específico para el formulario de afiliado
private resetAfiliadoForm(): void {
  this.afiliadoForm.reset();
  while (this.telefonosAfiliado.length > 1) {
      this.telefonosAfiliado.removeAt(this.telefonosAfiliado.length - 1);
  }
  this.telefonosAfiliado.at(0).reset();
  this.editMode = false;
}

// Reset específico para el formulario de administrador
private resetAdminForm(): void {
  this.adminForm.reset();
  while (this.telefonosAdmin.length > 1) {
      this.telefonosAdmin.removeAt(this.telefonosAdmin.length - 1);
  }
  this.telefonosAdmin.at(0).reset();
  this.editModeAdmin = false;
}

// Método para cambiar pestañas
setActiveTab(tab: string): void {
  this.activeTab = tab;
  this.resetForms();
}


// Getters para FormArrays
get telefonosAfiliado() {
  return this.afiliadoForm.get('TelefonosComercio') as FormArray;
}

get telefonosAdmin() {
  return this.adminForm.get('TelefonosAdmin') as FormArray;
}

// Getters para datos de Afiliados
private getAllAfiliados(): void {
  this.afiliadoService.getAfiliados().subscribe({
      next: (data: Afiliado[]) => {
          this.afiliados = data;
          console.log('Afiliados cargados:', this.afiliados);
      },
      error: error => {
          console.error('Error al cargar los afiliados:', error);
          this.handleLoadError('afiliados');
      }
  });
}

private getAllDirecciones(): void {
  this.afiliadoService.getDirecciones().subscribe({
      next: (data: Direccion_Comercio[]) => {
          this.direcciones_comercio = data;
          console.log('Direcciones cargadas:', this.direcciones_comercio);
      },
      error: error => {
          console.error('Error al cargar las direcciones:', error);
          this.handleLoadError('direcciones de comercio');
      }
  });
}

private getAllTelefonosComercio(): void {
  this.afiliadoService.getAllTelefonosComercio().subscribe({
      next: (data: Telefono_comercio[]) => {
          this.telefonos_comercio = data;
          console.log('Teléfonos comercio cargados:', this.telefonos_comercio);
      },
      error: error => {
          console.error('Error al cargar los teléfonos:', error);
          this.handleLoadError('teléfonos de comercio');
      }
  });
}

private getTiposComercio(): void {
  this.afiliadoService.getTiposdeComercio().subscribe({
      next: (data: Tipo_Comercio[]) => {
          this.tipos_comercio = data;
          console.log('Tipos de comercio cargados:', this.tipos_comercio);
      },
      error: error => {
          console.error('Error al cargar tipos de comercio:', error);
          this.handleLoadError('tipos de comercio');
      }
  });
}

private getAllAdministradores(): void {
  this.afiliadoService.getAdmins().subscribe({
      next: (data: AdministradorApp[]) => {
          this.administradores = data;
          console.log('Administradores cargados:', this.administradores);
      },
      error: error => {
          console.error('Error al cargar administradores:', error);
          this.handleLoadError('administradores');
      }
  });
}

// Getters para datos de Administradores App
private getAllAdministradoresApp(): void {
  this.adminAppService.getAdminApps().subscribe({
      next: (data: AdministradorApp[]) => {
          this.administradoresApp = data;
          console.log('Administradores App cargados:', this.administradoresApp);
      },
      error: error => {
          console.error('Error al cargar administradores app:', error);
          this.handleLoadError('administradores app');
      }
  });
}

private getAllDireccionesAdmin(): void {
  this.adminAppService.getDireccionesAdminApp().subscribe({
      next: (data: Direccion_AdministradorApp[]) => {
          this.direcciones_administrador = data;
          console.log('Direcciones admin cargadas:', this.direcciones_administrador);
      },
      error: error => {
          console.error('Error al cargar direcciones admin:', error);
          this.handleLoadError('direcciones de administradores');
      }
  });
}

private getAllTelefonosAdmin(): void {
  this.adminAppService.getAllTelefonosAdminApp().subscribe({
      next: (data: Telefono_AdminApp[]) => {
          this.telefonos_admin = data;
          console.log('Teléfonos admin cargados:', this.telefonos_admin);
      },
      error: error => {
          console.error('Error al cargar teléfonos admin:', error);
          this.handleLoadError('teléfonos de administradores');
      }
  });
}

// Getters para obtener datos específicos por ID
getDireccionComercioById(id: string): Direccion_Comercio | undefined {
  return this.direcciones_comercio.find(dir => dir.id_Comercio === id);
}

getDireccionAdminById(id: number): Direccion_AdministradorApp | undefined {
  return this.direcciones_administrador.find(dir => dir.id_Admin === id);
}

getTelefonosComercioById(id: string): Telefono_comercio[] {
  return this.telefonos_comercio.filter(tel => tel.cedula_Comercio === id);
}

getTelefonosAdminById(id: number): Telefono_AdminApp[] {
  return this.telefonos_admin.filter(tel => tel.cedula_Admin === id);
}

// Getter para obtener admin por cédula
getAdminByCedula(cedula_Admin: number): AdministradorApp | undefined {
  return this.administradores.find(admin => admin.cedula === cedula_Admin);
}


// MÉTODOS DE CREACIÓN PARA AFILIADOS
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
              let afiliadoData = this.afiliadoForm.value;
              let cedulaJuridica = afiliadoData.cedula_Juridica;

              if (!this.editMode) {
                  this.createNewAfiliado(afiliadoData, cedulaJuridica);
              } else {
                  this.updateExistingAfiliado(afiliadoData);
              }
          }
      });
  } else {
      this.showFormErrors(this.afiliadoForm);
  }
}

private createNewAfiliado(data: any, cedulaJuridica: string): void {
  let afiliado = this.buildAfiliadoObject(data);
  let direccion = this.buildDireccionComercioObject(data, cedulaJuridica);
  let telefonos = this.buildTelefonosComercioArray(this.telefonosAfiliado.value, cedulaJuridica);

  Promise.all([
      this.saveAfiliadoToAPI(afiliado),
      this.saveDireccionComercioToAPI(direccion),
      this.saveTelefonosComercioToAPI(telefonos)
  ]).then(() => {
      this.handleSaveSuccess('Afiliado creado exitosamente');
      this.resetAfiliadoForm();
  }).catch(error => {
      this.handleSaveError('afiliado', error);
  });
}

// Métodos auxiliares para construcción de objetos de Afiliado
private buildAfiliadoObject(data: any): Afiliado {
  return {
      cedula_Juridica: data.cedula_Juridica,
      nombre: data.nombre,
      correo: data.correo,
      sinpe: data.SINPE,
      id_Tipo: data.id_Tipo,
      cedula_Admin: data.cedula_Admin
  };
}

private buildDireccionComercioObject(data: any, cedulaJuridica: string): Direccion_Comercio {
  return {
      id_Comercio: cedulaJuridica,
      provincia: data.provincia,
      canton: data.canton,
      distrito: data.distrito
  };
}

private buildTelefonosComercioArray(telefonos: any[], cedulaJuridica: string): Telefono_comercio[] {
  return telefonos.map(tel => ({
      cedula_Comercio: cedulaJuridica,
      telefono: tel.telefono
  }));
}

// Métodos API para crear Afiliados
private saveAfiliadoToAPI(afiliado: Afiliado): Promise<any> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.createAfiliados(afiliado).subscribe({
          next: (response) => {
              console.log('Afiliado guardado:', response);
              resolve(response);
          },
          error: (error) => {
              console.error('Error al guardar afiliado:', error);
              reject(error);
          }
      });
  });
}

private saveDireccionComercioToAPI(direccion: Direccion_Comercio): Promise<any> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.createDirecciones(direccion).subscribe({
          next: (response) => {
              console.log('Dirección guardada:', response);
              resolve(response);
          },
          error: (error) => {
              console.error('Error al guardar dirección:', error);
              reject(error);
          }
      });
  });
}

private saveTelefonosComercioToAPI(telefonos: Telefono_comercio[]): Promise<any> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.createTelefonos(telefonos).subscribe({
          next: (response) => {
              console.log('Teléfonos guardados:', response);
              resolve(response);
          },
          error: (error) => {
              console.error('Error al guardar teléfonos:', error);
              reject(error);
          }
      });
  });
}

// MÉTODOS DE CREACIÓN PARA ADMINISTRADORES
saveAdmin(): void {
  if (this.adminForm.valid) {
      Swal.fire({
          title: '¿Estás seguro?',
          text: this.editModeAdmin ? 'Se actualizará la información del administrador' : 'Se creará un nuevo administrador',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              let adminData = this.adminForm.value;
              let cedula = adminData.cedula;

              if (!this.editModeAdmin) {
                  this.createNewAdmin(adminData, cedula);
              } else {
                  this.updateExistingAdmin(adminData);
              }
          }
      });
  } else {
      this.showFormErrors(this.adminForm);
  }
}

private createNewAdmin(data: any, cedula: number): void {
  let password = this.generateRandomPassword();
  data.password = password;

  let admin = this.buildAdminObject(data);
  let direccion = this.buildDireccionAdminObject(data, cedula);
  let telefonos = this.buildTelefonosAdminArray(this.telefonosAdmin.value, cedula);

  Promise.all([
      this.saveAdminToAPI(admin),
      this.saveDireccionAdminToAPI(direccion),
      this.saveTelefonosAdminToAPI(telefonos)
  ]).then(() => {
      // Si hay correo, enviamos las credenciales por correo
      if (data.correo) {
          this.sendCredentialsEmail(data.correo, data.usuario, password);
      } else {
          // Si no hay correo, mostramos las credenciales en pantalla
          this.showCredentials(data.usuario, password);
      }
      this.handleSaveSuccess('Administrador creado exitosamente');
      this.resetAdminForm();
  }).catch(error => {
      this.handleSaveError('administrador', error);
  });
}


// Método para enviar credenciales por correo
private sendCredentialsEmail(email: string, usuario: string, password: string): void {
  // Aquí implementarías la lógica de envío de correo
  Swal.fire({
      title: 'Credenciales enviadas',
      text: `Se han enviado las credenciales al correo ${email}`,
      icon: 'success'
  });
}

// Métodos auxiliares para construcción de objetos de Admin
private buildAdminObject(data: any): AdministradorApp {
  return {
      usuario: data.usuario,
      password: data.password,
      cedula: data.cedula,
      nombre: data.nombre,
      apellido1: data.apellido1,
      apellido2: data.apellido2,
      correo: data.correo

  };
}

private buildDireccionAdminObject(data: any, cedula: number): Direccion_AdministradorApp {
  return {
      id_Admin: cedula,
      provincia: data.provincia,
      canton: data.canton,
      distrito: data.distrito
  };
}

private buildTelefonosAdminArray(telefonos: any[], cedula: number): Telefono_AdminApp[] {
  return telefonos.map(tel => ({
      cedula_Admin: cedula,
      telefono: tel.telefono
  }));
}

// Métodos API para crear Administradores
private saveAdminToAPI(admin: AdministradorApp): Promise<any> {
  return new Promise((resolve, reject) => {
      this.adminAppService.createAdminApp(admin).subscribe({
          next: (response) => {
              console.log('Administrador guardado:', response);
              resolve(response);
          },
          error: (error) => {
              console.error('Error al guardar administrador:', error);
              reject(error);
          }
      });
  });
}

private saveDireccionAdminToAPI(direccion: Direccion_AdministradorApp): Promise<any> {
  return new Promise((resolve, reject) => {
      this.adminAppService.createDireccionesAdminApp(direccion).subscribe({
          next: (response) => {
              console.log('Dirección de administrador guardada:', response);
              resolve(response);
          },
          error: (error) => {
              console.error('Error al guardar dirección de administrador:', error);
              reject(error);
          }
      });
  });
}

private saveTelefonosAdminToAPI(telefonos: Telefono_AdminApp[]): Promise<any> {
  return new Promise((resolve, reject) => {
      let promises = telefonos.map(telefono =>
          this.adminAppService.createTelefonosAdminApp(telefono).toPromise()
      );

      Promise.all(promises)
          .then(responses => resolve(responses))
          .catch(error => reject(error));
  });
}

// Métodos de utilidad para la creación
private generateRandomPassword(): string {
  let length = 12;
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
      let randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
  }

  return password;
}

private showCredentials(usuario: string, password: string): void {
  Swal.fire({
      title: 'Credenciales generadas',
      html: `<strong>Usuario:</strong> ${usuario}<br><strong>Contraseña:</strong> ${password}`,
      icon: 'success'
  });
}


// MÉTODOS DE ACTUALIZACIÓN PARA AFILIADOS
private updateExistingAfiliado(data: any): void {
  let afiliado = this.buildAfiliadoObject(data);
  let direccion = this.buildDireccionComercioObject(data, data.cedula_Juridica);
  let telefonos = this.buildTelefonosComercioArray(this.telefonosAfiliado.value, data.cedula_Juridica);

  Promise.all([
      this.updateAfiliadoInAPI(afiliado),
      this.updateDireccionComercioInAPI(direccion),
      this.updateTelefonosComercioInAPI(data.cedula_Juridica, telefonos)
  ]).then(() => {
      this.handleSaveSuccess('Afiliado actualizado exitosamente');
      this.resetAfiliadoForm();
  }).catch(error => {
      this.handleSaveError('afiliado', error);
  });
}

// Métodos API de actualización para Afiliados
private updateAfiliadoInAPI(afiliado: Afiliado): Promise<any> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.updateAfiliado(afiliado).subscribe({
          next: (response) => {
              console.log('Afiliado actualizado:', response);
              resolve(response);
          },
          error: (error) => reject(error)
      });
  });
}

private updateDireccionComercioInAPI(direccion: Direccion_Comercio): Promise<any> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.updateDireccion(direccion).subscribe({
          next: (response) => {
              console.log('Dirección comercio actualizada:', response);
              resolve(response);
          },
          error: (error) => reject(error)
      });
  });
}

private updateTelefonosComercioInAPI(cedula: string, telefonos: Telefono_comercio[]): Promise<any> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.putTelefonos(cedula, telefonos).subscribe({
          next: (response) => {
              console.log('Teléfonos comercio actualizados:', response);
              resolve(response);
          },
          error: (error) => reject(error)
      });
  });
}

// Métodos de edición para Afiliados
editAfiliado(cedulaJuridica: string): void {
  this.editMode = true;
  this.editModeAdmin = false;
  this.setActiveTab('crear-afiliado');
  this.loadAfiliadoData(cedulaJuridica);
}

private loadAfiliadoData(cedulaJuridica: string): void {
  Promise.all([
      this.loadAfiliadoDetails(cedulaJuridica),
      this.loadAfiliadoDireccion(cedulaJuridica),
      this.loadAfiliadoTelefonos(cedulaJuridica)
  ]).catch(error => {
      console.error('Error al cargar datos del afiliado:', error);
      this.handleLoadError('datos del afiliado');
  });
}

private loadAfiliadoDetails(cedulaJuridica: string): Promise<void> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.getOneComercio(cedulaJuridica).subscribe({
          next: (data) => {
              this.patchAfiliadoForm(data);
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

private loadAfiliadoDireccion(cedulaJuridica: string): Promise<void> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.getDireccionComercio(cedulaJuridica).subscribe({
          next: (data) => {
              if (data) {
                  this.patchAfiliadoDireccionForm(data);
              }
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

private loadAfiliadoTelefonos(cedulaJuridica: string): Promise<void> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.getTelefonosComercio(cedulaJuridica).subscribe({
          next: (data) => {
              this.updateAfiliadoTelefonosArray(data);
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

// MÉTODOS DE ACTUALIZACIÓN PARA ADMINISTRADORES
private updateExistingAdmin(data: any): void {
  let admin = this.buildAdminObject(data);
  let direccion = this.buildDireccionAdminObject(data, data.cedula);
  let telefonos = this.buildTelefonosAdminArray(this.telefonosAdmin.value, data.cedula);

  Promise.all([
      this.updateAdminInAPI(admin),
      this.updateDireccionAdminInAPI(direccion),
      this.updateTelefonosAdminInAPI(data.cedula, telefonos)
  ]).then(() => {
      this.handleSaveSuccess('Administrador actualizado exitosamente');
      this.resetAdminForm();
  }).catch(error => {
      this.handleSaveError('administrador', error);
  });
}

// Métodos API de actualización para Administradores
private updateAdminInAPI(admin: AdministradorApp): Promise<any> {
  return new Promise((resolve, reject) => {
      this.adminAppService.updateAdminApp(admin).subscribe({
          next: (response) => {
              console.log('Administrador actualizado:', response);
              resolve(response);
          },
          error: (error) => reject(error)
      });
  });
}

private updateDireccionAdminInAPI(direccion: Direccion_AdministradorApp): Promise<any> {
  return new Promise((resolve, reject) => {
      this.adminAppService.updateDireccionAdminApp(direccion).subscribe({
          next: (response) => {
              console.log('Dirección admin actualizada:', response);
              resolve(response);
          },
          error: (error) => reject(error)
      });
  });
}

private updateTelefonosAdminInAPI(cedula: number, telefonos: Telefono_AdminApp[]): Promise<any> {
  return new Promise((resolve, reject) => {
      this.adminAppService.putTelefonosAdminApp(cedula, telefonos).subscribe({
          next: (response) => {
              console.log('Teléfonos admin actualizados:', response);
              resolve(response);
          },
          error: (error) => reject(error)
      });
  });
}

// Métodos de edición para Administradores
editAdmin(cedula: number): void {
  this.editModeAdmin = true;
  this.editMode = false;
  this.setActiveTab('crear-admin');
  this.loadAdminData(cedula);
}

private loadAdminData(cedula: number): void {
  Promise.all([
      this.loadAdminDetails(cedula),
      this.loadAdminDireccion(cedula),
      this.loadAdminTelefonos(cedula)
  ]).catch(error => {
      console.error('Error al cargar datos del administrador:', error);
      this.handleLoadError('datos del administrador');
  });
}

private loadAdminDetails(cedula: number): Promise<void> {
  return new Promise((resolve, reject) => {
      this.adminAppService.getOneAdminApp(cedula).subscribe({
          next: (data) => {
              this.patchAdminForm(data);
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

private loadAdminDireccion(cedula: number): Promise<void> {
  return new Promise((resolve, reject) => {
      this.adminAppService.getDireccionAdminApp(cedula).subscribe({
          next: (data) => {
              if (data) {
                  this.patchAdminDireccionForm(data);
              }
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

private loadAdminTelefonos(cedula: number): Promise<void> {
  return new Promise((resolve, reject) => {
      this.adminAppService.getTelefonosAdminApp(cedula).subscribe({
          next: (data) => {
              this.updateAdminTelefonosArray(data);
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

// Métodos de actualización de formularios
private patchAfiliadoForm(afiliadoData: any): void {
  this.afiliadoForm.patchValue({
      cedula_Juridica: afiliadoData.cedula_Juridica,
      nombre: afiliadoData.nombre,
      correo: afiliadoData.correo,
      sinpe: afiliadoData.sinpe,
      id_Tipo: afiliadoData.id_Tipo,
      cedula_Admin: afiliadoData.cedula_Admin
  });
}

private patchAfiliadoDireccionForm(direccionData: Direccion_Comercio): void {
  this.afiliadoForm.patchValue({
      provincia: direccionData.provincia,
      canton: direccionData.canton,
      distrito: direccionData.distrito
  });
}

private updateAfiliadoTelefonosArray(telefonosData: Telefono_comercio[]): void {
  let telefonosArray = this.afiliadoForm.get('TelefonosComercio') as FormArray;
  telefonosArray.clear();

  telefonosData.forEach(telefono => {
      telefonosArray.push(this.fb.group({
          telefono: [telefono.telefono, Validators.required]
      }));
  });
}

private patchAdminForm(adminData: AdministradorApp): void {
  this.adminForm.patchValue({
      usuario: adminData.usuario,
      cedula: adminData.cedula,
      nombre: adminData.nombre,
      apellido1: adminData.apellido1,
      apellido2: adminData.apellido2,
      correo: adminData.correo || '', // Agregamos el correo con fallback a string vacío

  });
}

private patchAdminDireccionForm(direccionData: Direccion_AdministradorApp): void {
  this.adminForm.patchValue({
      provincia: direccionData.provincia,
      canton: direccionData.canton,
      distrito: direccionData.distrito
  });
}

private updateAdminTelefonosArray(telefonosData: Telefono_AdminApp[]): void {
  let telefonosArray = this.adminForm.get('TelefonosAdmin') as FormArray;
  telefonosArray.clear();

  telefonosData.forEach(telefono => {
      telefonosArray.push(this.fb.group({
          telefono: [telefono.telefono, Validators.required]
      }));
  });
}


// MÉTODOS DE MANEJO DE ERRORES GENERALES
private handleLoadError(entity: string): void {
  Swal.fire({
      title: 'Error de carga',
      text: `No se pudieron cargar los datos de ${entity}. Por favor, intente nuevamente.`,
      icon: 'error'
  });
}

private handleSaveError(entity: string, error: any): void {
  console.error(`Error al guardar ${entity}:`, error);
  Swal.fire({
      title: 'Error',
      text: `Error al guardar ${entity}. Por favor, intente nuevamente.`,
      icon: 'error'
  });
}

private handleDeleteError(entity: string, error: any): void {
  console.error(`Error al eliminar ${entity}:`, error);
  Swal.fire({
      title: 'Error',
      text: `No se pudo eliminar el ${entity}. Por favor, intente nuevamente.`,
      icon: 'error'
  });
}

// MÉTODOS DE VALIDACIÓN Y ERRORES DE FORMULARIO
private showFormErrors(form: FormGroup): void {
  let errorMessage = 'Por favor, complete los siguientes campos:\n';
  Object.keys(form.controls).forEach(key => {
      let control = form.get(key);
      if (control?.invalid) {
          errorMessage += `- ${key}\n`;
      }
  });

  Swal.fire({
      title: 'Error de validación',
      text: errorMessage,
      icon: 'error'
  });
}

// MÉTODOS DE MANEJO DE ÉXITO
private handleSaveSuccess(message: string): void {
  this.loadInitialData(); // Recargar datos
  Swal.fire({
      title: 'Éxito',
      text: message,
      icon: 'success'
  });
}

private handleDeleteSuccess(entity: string): void {
  Swal.fire({
      title: 'Eliminado',
      text: `El ${entity} ha sido eliminado correctamente`,
      icon: 'success'
  });
}

// MÉTODOS DE VALIDACIÓN
private isFieldInvalid(controlName: string): boolean {
  let control = this.afiliadoForm.get(controlName);
  return control ? control.invalid && (control.dirty || control.touched) : false;
}

private validateForm(): boolean {
  if (this.afiliadoForm.invalid) {
      Object.keys(this.afiliadoForm.controls).forEach(key => {
          let control = this.afiliadoForm.get(key);
          if (control?.invalid) {
              control.markAsTouched();
          }
      });
      return false;
  }
  return true;
}

// MÉTODOS DE CONFIRMACIÓN
private async confirmAction(title: string, text: string): Promise<boolean> {
  let result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
  });
  return result.isConfirmed;
}

// MÉTODOS DE ERROR ESPECÍFICOS
private handleAPIError(error: any, operation: string): void {
  console.error(`Error en operación ${operation}:`, error);
  let errorMessage = 'Ha ocurrido un error inesperado';

  if (error.status === 404) {
      errorMessage = 'No se encontró el recurso solicitado';
  } else if (error.status === 400) {
      errorMessage = 'Datos inválidos';
  } else if (error.status === 403) {
      errorMessage = 'No tiene permisos para realizar esta operación';
  }

  Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error'
  });
}

private mostrarErroresFormulario(): void {
  Object.keys(this.afiliadoForm.controls).forEach(field => {
      let control = this.afiliadoForm.get(field);
      if (control?.invalid) {
          console.log(`Error en el campo '${field}':`, control.errors);
      }
  });

  let telefonosArray = this.afiliadoForm.get('TelefonosComercio') as FormArray;
  telefonosArray.controls.forEach((control, index) => {
      if (control.invalid) {
          console.log(`Error en el teléfono #${index + 1}:`, control.errors);
      }
  });
}

private getErrorMessage(controlName: string): string {
  let control = this.afiliadoForm.get(controlName);
  if (control?.hasError('required')) {
      return `El campo ${controlName} es requerido`;
  }
  if (control?.hasError('email')) {
      return 'Debe ingresar un correo electrónico válido';
  }
  if (control?.hasError('pattern')) {
      return 'El formato ingresado no es válido';
  }
  return '';
}

// MÉTODOS DE MANEJO DE CAMBIOS SIN GUARDAR
private hasUnsavedChanges(): boolean {
  return this.afiliadoForm.dirty || this.adminForm.dirty;
}

private async confirmDiscardChanges(): Promise<boolean> {
  if (this.hasUnsavedChanges()) {
      return await this.confirmAction(
          '¿Estás seguro?',
          'Hay cambios sin guardar. ¿Deseas descartarlos?'
      );
  }
  return true;
}


// MÉTODOS DE ELIMINACIÓN PARA AFILIADOS
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
          this.executeAfiliadoDeletion(cedulaJuridica);
      }
  });
}

private executeAfiliadoDeletion(cedulaJuridica: string): void {
  // Eliminar en orden: teléfonos -> dirección -> afiliado
  this.deleteTelefonosComercio(cedulaJuridica)
      .then(() => this.deleteDireccionComercio(cedulaJuridica))
      .then(() => this.deleteAfiliadoMain(cedulaJuridica))
      .then(() => {
          this.handleDeleteSuccess('afiliado');
          this.loadAfiliadosData();
      })
      .catch(error => {
          this.handleDeleteError('afiliado', error);
      });
}

private deleteTelefonosComercio(cedula: string): Promise<void> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.deleteTelefonosComercio(cedula).subscribe({
          next: () => {
              console.log('Teléfonos del comercio eliminados');
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

private deleteDireccionComercio(cedula: string): Promise<void> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.deleteDireccionesComercio(cedula).subscribe({
          next: () => {
              console.log('Dirección del comercio eliminada');
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

private deleteAfiliadoMain(cedula: string): Promise<void> {
  return new Promise((resolve, reject) => {
      this.afiliadoService.deleteComercio(cedula).subscribe({
          next: () => {
              console.log('Afiliado eliminado');
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

// MÉTODOS DE ELIMINACIÓN PARA ADMINISTRADORES
deleteAdmin(cedula: number): void {
  // Verificar si el admin está asociado a algún comercio
  let comerciosAsociados = this.afiliados.filter(af => af.cedula_Admin === cedula);

  if (comerciosAsociados.length > 0) {
      Swal.fire({
          title: 'No se puede eliminar',
          text: 'Este administrador está asociado a uno o más comercios. Debe reasignar los comercios antes de eliminarlo.',
          icon: 'error'
      });
      return;
  }

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
          this.executeAdminDeletion(cedula);
      }
  });
}

private executeAdminDeletion(cedula: number): void {
  this.deleteTelefonosAdmin(cedula)
      .then(() => this.deleteDireccionAdmin(cedula))
      .then(() => this.deleteAdminMain(cedula))
      .then(() => {
          this.handleDeleteSuccess('administrador');
          this.loadAdministradoresData();
      })
      .catch(error => {
          this.handleDeleteError('administrador', error);
      });
}

private deleteTelefonosAdmin(cedula: number): Promise<void> {
  return new Promise((resolve, reject) => {
      this.adminAppService.deleteTelefonosAdminApp(cedula).subscribe({
          next: () => {
              console.log('Teléfonos del administrador eliminados');
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

private deleteDireccionAdmin(cedula: number): Promise<void> {
  return new Promise((resolve, reject) => {
      this.adminAppService.deleteDireccionesAdminApp(cedula).subscribe({
          next: () => {
              console.log('Dirección del administrador eliminada');
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

private deleteAdminMain(cedula: number): Promise<void> {
  return new Promise((resolve, reject) => {
      this.adminAppService.deleteAdminApp(cedula).subscribe({
          next: () => {
              console.log('Administrador eliminado');
              resolve();
          },
          error: (error) => reject(error)
      });
  });
}

// Método para verificar si un administrador puede ser eliminado
canDeleteAdmin(cedula: number): boolean {
  let comerciosAsociados = this.afiliados.filter(
      afiliado => afiliado.cedula_Admin === cedula
  );
  return comerciosAsociados.length === 0;
}


getComerciosAsociados(cedulaAdmin: number): Afiliado[] {
  return this.afiliados.filter(afiliado => afiliado.cedula_Admin === cedulaAdmin);
}
}




