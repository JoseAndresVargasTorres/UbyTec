import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/API/api.service';
import { HeaderAffiliateComponent } from '../../components/header/header-affiliate.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [FormsModule, HeaderAffiliateComponent, NgFor, NgIf],
  templateUrl: './gestion-productos.component.html',
  styleUrl: './gestion-productos.component.css'
})
export class GestionProductosComponent {
  productAdded: boolean = false;
  catOptions: string[] = ['Pizza', 'Sandwich', 'Sopa', 'Refresco', 'Gaseosa', 'Té', 'Café', 'Bowl', 'Crepa', 'Plato Fuerte', 'Postre', 'Ensalada'];
  selectedFile: File | null = null;
  constructor(private api: ApiService, private router:Router){}

  
  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const validFormats = ['image/png', 'image/jpeg', 'image/jpg'];

    if (validFormats.includes(file.type)) {
      this.selectedFile = file;
      console.log('Selected valid file:', this.selectedFile);
    } else {
      this.selectedFile = null;
      alert('Por favor, seleccione un archivo en formato PNG o JPG.');
    }
    }
  }

  // Método para manejar el envío del formulario
  submit(form: any) {
    this.productAdded = true;
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
