import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Admin } from '../../interfaces/Admin';
import { AdminServiceService } from '../../services/ServicioAdminAPI/admin-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';

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
  empleados: Admin[] = []; // Aquí almacenarás todos los empleados/administradores
  editMode: boolean = false; // Variable para saber si se está editando
  activeTab: string = 'crear'; // Controlador de la pestaña activa, inicia en 'crear'


  constructor(private fb: FormBuilder, private adminService: AdminServiceService) {
    this.adminForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      telefonos: this.fb.array([this.fb.control('')])
    });
  }




  ngOnInit(): void {
    this.loadEmpleados(); // Carga todos los empleados al iniciar el componente
  }

  // Cambiar pestaña
  setActiveTab(tabName: string) {
    this.activeTab = tabName; // Cambia el valor de la pestaña activa
  }

  // Cargar empleados desde el servicio
  loadEmpleados() {
    this.adminService.getEmpleados().subscribe(data => {
      this.empleados = data;
    });
  }

  // Método para crear un nuevo administrador/empleado
  createEmpleado() {
    if (this.adminForm.valid) {
      this.adminService.createEmpleado(this.adminForm.value).subscribe(response => {
        this.loadEmpleados(); // Recargar la lista después de crear
        this.adminForm.reset(); // Limpiar el formulario
        this.editMode = false;

      });
    }
  }

  // Método para eliminar un empleado
  deleteEmpleado(cedula: string) {
    this.adminService.deleteEmpleado(cedula).subscribe(response => {
      this.loadEmpleados(); // Recargar la lista después de eliminar
    });
  }

  // Método para editar un empleado
  editEmpleado(empleado: Admin) {
    this.adminForm.patchValue(empleado); // Rellenar el formulario con los datos del empleado seleccionado
    this.editMode = true;


  }


  // Actualizar un empleado existente
  updateEmpleado() {
    if (this.adminForm.valid) {
      this.adminService.updateEmpleado(this.adminForm.value).subscribe(response => {
        this.loadEmpleados(); // Recargar la lista después de actualizar
        this.adminForm.reset(); // Limpiar el formulario
        this.editMode = false;

      });
    }
  }


   // Getter para el FormArray de telefonos
   get telefonos(): FormArray {
    return this.adminForm.get('telefonos') as FormArray;
  }

  // Agregar un nuevo teléfono
  addTelefono(): void {
    this.telefonos.push(this.fb.control(''));
  }

  // Eliminar un teléfono por índice
  removeTelefono(index: number): void {
    if (this.telefonos.length > 1) { // Evita eliminar todos los teléfonos
      this.telefonos.removeAt(index);
    }
  }

}
