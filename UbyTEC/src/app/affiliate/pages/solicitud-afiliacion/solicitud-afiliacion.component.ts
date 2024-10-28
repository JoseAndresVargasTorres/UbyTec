import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/API/api.service';
import { HeaderAffiliateComponent } from '../../components/header/header-affiliate.component';

@Component({
  selector: 'app-solicitud-afiliacion',
  standalone: true,
  imports: [FormsModule, HeaderAffiliateComponent],
  templateUrl: './solicitud-afiliacion.component.html',
  styleUrl: './solicitud-afiliacion.component.css'
})
export class SolicitudAfiliacionComponent {
  constructor(private api: ApiService, private router:Router){}
  // Método para manejar el envío del formulario
  submit(form: any) {
    form.cedula_juridica_distribuidor = "0";

    const currentDate = new Date();
    form.fecha_inscripcion = currentDate.toISOString();
    let cuerpo = JSON.stringify(form);  // Convertir el formulario a una cadena JSON
    console.log(cuerpo);  // Imprimir el cuerpo del formulario en la consola


    // Hacer una llamada POST a la API para añadir un nuevo producto
    let output = this.api.postData("Dispositivos", cuerpo);

    // Suscribirse a la respuesta de la llamada API
    output.subscribe({
      next: res => { console.log(res) },  // Imprimir la respuesta en caso de éxito
      error: err => { console.error(err) }  // Imprimir el error en caso de fallo
    });
  }

  getBack(){
    // Método que redirige a la página principal
    this.router.navigate(['/admin']);


  }
}
