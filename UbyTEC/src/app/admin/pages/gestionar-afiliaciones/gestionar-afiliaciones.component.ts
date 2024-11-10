import { Component, OnInit } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Afiliado } from '../../interfaces/Afiliado';
import { AdminComercio } from '../../interfaces/AdminComercio';
import { AfiliadoService } from '../../services/ServicioAfiliadoAPI/afiliado.service';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gestionar-afiliaciones',
  standalone: true,
  imports: [HeaderAdminComponent,FormsModule,CommonModule,ReactiveFormsModule],
  providers:[AfiliadoService],
  templateUrl: './gestionar-afiliaciones.component.html',
  styleUrl: './gestionar-afiliaciones.component.css'
})
export class GestionarAfiliacionesComponent
{



}
