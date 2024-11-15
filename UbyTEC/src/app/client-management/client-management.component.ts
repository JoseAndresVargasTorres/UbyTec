import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importa RouterModule

@Component({
  selector: 'app-client-management',
  standalone: true, // Indica que es un componente independiente
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // Importa los módulos necesarios
  templateUrl: './client-management.component.html',
  styleUrls: ['./client-management.component.css'],
})
export class ClientManagementComponent {
  clientForm: FormGroup;
  editMode: boolean = false;
  clients: any[] = [];
  currentClient: any = null; // Para manejar el cliente actual en modo edición

  constructor(private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      direccion: this.fb.group({
        provincia: ['', Validators.required],
        canton: ['', Validators.required],
        distrito: ['', Validators.required],
      }),
      fechaNacimiento: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      usuario: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.clientForm.valid) {
      if (this.editMode) {
        // Actualizar cliente
        const index = this.clients.findIndex(client => client.id === this.currentClient.id);
        if (index !== -1) {
          this.clients[index] = this.clientForm.value;
        }
      } else {
        // Crear cliente nuevo
        this.clients.push(this.clientForm.value);
      }
      this.clientForm.reset();
      this.editMode = false;
    }
  }

  onEdit(client: any): void {
    this.editMode = true;
    this.currentClient = client;
    this.clientForm.patchValue(client);  // Rellenar el formulario con los datos del cliente
  }

  onDelete(clientId: number): void {
    this.clients = this.clients.filter(client => client.id !== clientId);  // Eliminar el cliente
  }
}
