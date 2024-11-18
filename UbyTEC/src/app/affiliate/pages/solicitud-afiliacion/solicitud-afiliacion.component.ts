import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/API/api.service';
import { GestionAdministradorComponent } from '../gestion-administrador/gestion-administrador.component';
import { HeaderAffiliateComponent } from '../../components/header/header-affiliate.component';
import { NgFor, NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-solicitud-afiliacion',
  standalone: true,
  imports: [FormsModule, HeaderAffiliateComponent, NgFor, NgIf],
  templateUrl: './solicitud-afiliacion.component.html',
  styleUrl: './solicitud-afiliacion.component.css'
})
export class SolicitudAfiliacionComponent {
  phones: string[] = ['']; 
  tipoOptions: string[] = ['Comida Rápida', 'Comida Italiana', 'Comida Mexicano', 'India', 'China', 'Japonesaq'];
  adminAdded = false;
  admin: any = {};
  admin_phones: number[] = [];


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
        this.adminAdded = true;
        this.admin = result.data;
        this.admin_phones = result.phones;
      }
    });
  }

  addPhoneToApi(phone: string) {
    return this.api.postData("", { phone });
  }
  
  // Método para manejar el envío del formulario
  submit(form: any) {
    const { cedula, usuario, nombre: nombreAdmin, apellido1, apellido2, provincia: provinciaAdmin, canton: cantonAdmin, distrito: distritoAdmin} = this.admin;
    const { cedula_Juridica, nombre, id_Tipo, provincia, canton, distrito, correo, sinpe} = form;

    const cuerpo_comercio = JSON.stringify({cedula_Juridica, nombre, correo, sinpe, id_Tipo, cedula_Admin: cedula});
    const cuerpo_direccion = JSON.stringify({id_Comercio: cedula_Juridica, provincia, canton, distrito}); 
    const cuerpo_admin = JSON.stringify({cedula, usuario, password: "asdfq1", nombre: nombreAdmin, apellido1, apellido2})
    const cuerpo_direccion_admin = JSON.stringify({id_Admin: cedula, provincia: provinciaAdmin, canton: cantonAdmin, distrito: distritoAdmin})
    
    console.log("Comercio " + cuerpo_comercio);
    console.log("Direccion Comercio " + cuerpo_direccion);
    console.log("Administrador " + cuerpo_admin);
    console.log("Direccion Administrador " + cuerpo_direccion_admin);

    const call1 = this.api.postData("ComercioAfiliado", cuerpo_comercio);
    const call2 = this.api.postData("DireccionComercio",cuerpo_direccion);
    const call3 = this.api.postData("Administrador", cuerpo_admin);
    const call4 = this.api.postData("DireccionAdministrador", cuerpo_direccion_admin);

    const phoneCalls1 = this.phones.map(phone => this.api.postData("TelefonoComercio", { phone } ));
    const phoneCalls2 = this.admin_phones.map(phone => this.api.postData("TelefonoAdmin", { phone } ));

    forkJoin([call1, call2, call3, call4], phoneCalls1, phoneCalls2 ).subscribe({
      next: res => { 
        console.log(res); // Imprimir la respuesta en caso de éxito
        this.router.navigate(['']);
      },  
      error: err => { console.error(err) }  // Imprimir el error en caso de fallo
    });

  }
}
