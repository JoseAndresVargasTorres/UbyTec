import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderAdminComponent } from '../admin/components/header-admin/header-admin.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule,HeaderAdminComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm:FormGroup;

  constructor(private fb:FormBuilder){

    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // Aquí iría tu lógica de autenticación
    }
  }
}
