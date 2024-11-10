import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Admin } from '../../interfaces/Admin';
import { AdminServiceService } from '../../services/ServicioAdminAPI/admin-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { Telefono_admin } from '../../interfaces/Telefono_admin';

@Component({
  selector: 'app-gestionar-administradores',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HttpClientModule,HeaderAdminComponent],
  providers:[AdminServiceService],
  templateUrl: './gestionar-administradores.component.html',
  styleUrl: './gestionar-administradores.component.css'
})
export class GestionarAdministradoresComponent {

  adminForm: FormGroup;
//  telefonosForm:FormGroup
  empleados: Admin[] = [
    {
      password: 'contraseña123',
      usuario: 'jdoe',
      cedula: '1234567890',
      nombre: 'Juan',
      apellido1: 'Doe',
      apellido2: 'Pérez',
      provincia: 'San José',
      canton: 'Central',
      distrito: 'Carmen'
    },
    {
      password: 'admin2024',
      usuario: 'mlopez',
      cedula: '9876543210',
      nombre: 'María',
      apellido1: 'López',
      apellido2: 'González',
      provincia: 'Alajuela',
      canton: 'Central',
      distrito: 'Naranjo'
    },
    {
      password: '1234abcd',
      usuario: 'rhernandez',
      cedula: '5556667778',
      nombre: 'Roberto',
      apellido1: 'Hernández',
      apellido2: 'Vargas',
      provincia: 'Cartago',
      canton: 'Central',
      distrito: 'La Unión'
    },
    {
      password: 'password1234',
      usuario: 'acastro',
      cedula: '1112233445',
      nombre: 'Ana',
      apellido1: 'Castro',
      apellido2: 'Sánchez',
      provincia: 'Heredia',
      canton: 'Barva',
      distrito: 'Santo Domingo'
    }
  ];

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
      telefonos: this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  get telefonos(): FormArray {
    return this.adminForm.get('telefonos') as FormArray;
  }

  addTelefono(): void {
    this.telefonos.push(this.fb.control('', Validators.required));
  }

  removeTelefono(index: number): void {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  // Populate telefonos when editing
  editEmpleado(administrador: Admin) {
    this.adminForm.patchValue(administrador);
    this.telefonos.clear();
    const telefonos = this.getTelefonosByCedula(administrador.cedula);
    telefonos.forEach((telefono) => this.telefonos.push(this.fb.control(telefono.telefono, Validators.required)));
  }
  createEmpleado(){


  }



  deleteEmpleado(cedula:string){

  }


  // Cambiar pestaña
  setActiveTab(tabName: string) {
    this.activeTab = tabName; // Cambia el valor de la pestaña activa
  }



  getTelefonosByCedula(cedula: string): Telefono_admin[] {
    return this.telefonos_admin.filter(t => t.cedula_admin === cedula);
  }

}
