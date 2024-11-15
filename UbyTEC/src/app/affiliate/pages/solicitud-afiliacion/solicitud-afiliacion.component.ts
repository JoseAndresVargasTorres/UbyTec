import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/API/api.service';
import { GestionAdministradorComponent } from '../gestion-administrador/gestion-administrador.component';
import { HeaderAffiliateComponent } from '../../components/header/header-affiliate.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-solicitud-afiliacion',
  standalone: true,
  imports: [FormsModule, HeaderAffiliateComponent, NgFor, NgIf],
  templateUrl: './solicitud-afiliacion.component.html',
  styleUrl: './solicitud-afiliacion.component.css'
})
export class SolicitudAfiliacionComponent {
  phones: string[] = ['']; 
  tipoOptions: string[] = ['Retail', 'Food & Beverage', 'Electronics', 'Services', 'Health'];
  adminAdded = false;

  constructor(private api: ApiService, private router:Router, private dialog: MatDialog){}

  // Function to add a new phone field
  addPhone() {
    this.phones.push('');
  }

  // Function to remove a phone field by index
  removePhone(index: number) {
    if (this.phones.length > 1) {
      this.phones.splice(index, 1);
    }
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  openAdminDialog() {
    const dialogRef = this.dialog.open(GestionAdministradorComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.adminAdded = true; // Set the indicator on success
      }
    });
  }
  
  // Método para manejar el envío del formulario
  submit(form: any) {
    let cuerpo = JSON.stringify(form);  // Convertir el formulario a una cadena JSON
    console.log(cuerpo);  // Imprimir el cuerpo del formulario en la consola

    /*
    // Hacer una llamada POST a la API para añadir un nuevo producto
    let output = this.api.postData("Dispositivos", cuerpo);

    // Suscribirse a la respuesta de la llamada API
    output.subscribe({
      next: res => { console.log(res) },  // Imprimir la respuesta en caso de éxito
      error: err => { console.error(err) }  // Imprimir el error en caso de fallo
    });
    */
  }
}
