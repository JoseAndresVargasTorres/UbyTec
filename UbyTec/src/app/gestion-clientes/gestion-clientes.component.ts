import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-clientes.component.html',
  styleUrls: ['./gestion-clientes.component.css']
})
export class GestionClientesComponent {
  
  selectedIndex: number = -1;
  
  clientes = [
    {
      cedula: '12345678',
      nombre: 'Juan',
      apellidos: 'Pérez López',
      direccion: { provincia: 'San José', canton: 'Central', distrito: 'Carmen' },
      fechaNacimiento: '1990-05-10',
      telefono: '88888888',
      usuario: 'juan123',
      password: '1234'
    }
  ];

  nuevoCliente = {
    cedula: '',
    nombre: '',
    apellidos: '',
    direccion: { provincia: '', canton: '', distrito: '' },
    fechaNacimiento: '',
    telefono: '',
    usuario: '',
    password: ''
  };

  agregarCliente() {
    this.clientes.push({ ...this.nuevoCliente });
    this.nuevoCliente = {
      cedula: '',
      nombre: '',
      apellidos: '',
      direccion: { provincia: '', canton: '', distrito: '' },
      fechaNacimiento: '',
      telefono: '',
      usuario: '',
      password: ''
    };
  }

  eliminarCliente(index: number) {
    this.clientes.splice(index, 1);
  }

  actualizarCliente(index: number) {
    if (this.selectedIndex !== -1) {
      const cliente = this.clientes[index];
      Object.assign(cliente, this.nuevoCliente);
      this.nuevoCliente = {
        cedula: '',
        nombre: '',
        apellidos: '',
        direccion: { provincia: '', canton: '', distrito: '' },
        fechaNacimiento: '',
        telefono: '',
        usuario: '',
        password: ''
    };
    this.selectedIndex = -1;
    }
  }

  cargarCliente(cliente: any, index:number) {
    this.nuevoCliente = { ...cliente };
    this.selectedIndex = index;
  }
}
