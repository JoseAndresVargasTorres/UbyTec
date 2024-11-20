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

  // Método para agregar cliente
  agregarCliente() {
    if (!this.formValido()) return;

    // Verificar que la cédula y el usuario no se repitan
    const cedulaExistente = this.clientes.some(cliente => cliente.cedula === this.nuevoCliente.cedula);
    const usuarioExistente = this.clientes.some(cliente => cliente.usuario === this.nuevoCliente.usuario);

    if (cedulaExistente) {
      alert('La cédula ya está registrada.');
      return;
    }

    if (usuarioExistente) {
      alert('El usuario ya está registrado.');
      return;
    }

    this.clientes.push({ ...this.nuevoCliente });
    this.limpiarFormulario();
  }

  // Método para eliminar cliente
  eliminarCliente(index: number) {
    this.clientes.splice(index, 1);
  }

  // Método para actualizar cliente
  actualizarCliente(index: number) {
    if (this.selectedIndex !== -1) {
      const cliente = this.clientes[index];
      Object.assign(cliente, this.nuevoCliente);
      this.limpiarFormulario();
      this.selectedIndex = -1;
    }
  }

  // Método para cargar cliente en el formulario para actualizar
  cargarCliente(cliente: any, index: number) {
    this.nuevoCliente = { ...cliente };
    this.selectedIndex = index;
  }

  // Método para limpiar el formulario
  limpiarFormulario() {
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

  // Método para verificar si el formulario está completo
  formValido(): boolean {
    return this.nuevoCliente.cedula !== '' &&
           this.nuevoCliente.nombre !== '' &&
           this.nuevoCliente.apellidos !== '' &&
           this.nuevoCliente.direccion.provincia !== '' &&
           this.nuevoCliente.direccion.canton !== '' &&
           this.nuevoCliente.direccion.distrito !== '' &&
           this.nuevoCliente.fechaNacimiento !== '' &&
           this.nuevoCliente.telefono !== '' &&
           this.nuevoCliente.usuario !== '' &&
           this.nuevoCliente.password !== '';
  }
}
