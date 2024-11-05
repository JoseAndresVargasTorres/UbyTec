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
  catOptions: string[] = ['Retail', 'Food & Beverage', 'Electronics', 'Services', 'Health'];
  constructor(private api: ApiService, private router:Router){}

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
