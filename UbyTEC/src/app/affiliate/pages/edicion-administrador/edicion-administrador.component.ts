import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderAffiliateComponent } from '../../components/header/header-affiliate.component';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../../Services/API/api.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-edicion-administrador',
  standalone: true,
  imports: [NgFor, NgIf, HeaderAffiliateComponent, ReactiveFormsModule],
  templateUrl: './edicion-administrador.component.html',
  styleUrl: './edicion-administrador.component.css'
})
export class EdicionAdministradorComponent implements OnInit {
  AdministratorForm: FormGroup;
  phones: string[] = [''];
  isEditMode = false;
  administratorId: number | null = null;
  

  constructor (private api: ApiService, private router:Router, private route: ActivatedRoute, private fb: FormBuilder){
    this.AdministratorForm = this.fb.group({
      cedula: ['', Validators.required],
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      correo: ['', Validators.required],
    });
  }

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
    const cuerpo = JSON.stringify(form);
    this.api.putData('Administrador', cuerpo);
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.administratorId = +params['id']; // Convert to number
      if (this.administratorId) {
        this.api.getData(`Administrador/${this.administratorId}`).subscribe({
          next: (admin) => {
            this.AdministratorForm.patchValue({
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
            this.api.getData(`TelefonoAdmin/${this.administratorId}`).subscribe({
              next: phones => {
                this.phones = admin.telefonos || [''];
              }, error: err => {console.error(err)}
            })
            
            // Disable form initially
            this.AdministratorForm.disable();
          }, error: err => {console.error(err)}
        })
      }
    });
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.AdministratorForm.enable();
    } else {
      this.AdministratorForm.disable();
    }
  }

  
}
