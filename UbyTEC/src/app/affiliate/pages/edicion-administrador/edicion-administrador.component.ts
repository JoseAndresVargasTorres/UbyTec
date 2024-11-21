import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderAffiliateComponent } from '../../components/header/header-affiliate.component';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../../Services/API/api.service';
import { NgFor, NgIf } from '@angular/common';

export interface Administrator {
  id?: number;
  cedula: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  usuario: string;
  provincia: string;
  canton: string;
  distrito: string;
  telefonos: string[];
}

@Component({
  selector: 'app-edicion-administrador',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, HeaderAffiliateComponent],
  templateUrl: './edicion-administrador.component.html',
  styleUrl: './edicion-administrador.component.css'
})
export class EdicionAdministradorComponent implements OnInit {
  @ViewChild('userForm') userForm!: NgForm;
  phones: string[] = [''];
  isEditMode = false;
  administratorId: number | null = null;

  constructor (private api: ApiService, private router:Router, private route: ActivatedRoute){}

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

  submitAdmin(form: any) {
    console.log(form);
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.administratorId = +params['id']; // Convert to number
      if (this.administratorId) {
        this.api.getData(`Administrador/${this.administratorId}`).subscribe({
          next: (admin) => {
            this.userForm.form.patchValue({
              cedula: admin.cedula,
              nombre: admin.nombre,
              apellido1: admin.apellido1,
              apellido2: admin.apellido2,
              usuario: admin.usuario,
              provincia: admin.provincia,
              canton: admin.canton,
              distrito: admin.distrito
            });
  
            // Populate phones
            this.phones = admin.telefonos || [''];
            
            // Disable form initially
            this.userForm.form.disable();
          }, error: err => {console.error(err)}
        })
      }
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.userForm.form.enable();
    } else {
      this.userForm.form.disable();
    }
  }

  
}
