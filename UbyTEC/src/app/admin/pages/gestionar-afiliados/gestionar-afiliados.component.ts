import { Component } from '@angular/core';
import { HeaderAdminComponent } from '../../components/header-admin/header-admin.component';
import { Afiliado } from '../../interfaces/Afiliado';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Telefono_comercio } from '../../interfaces/Telefono_comercio';
import { CommonModule } from '@angular/common';
import { Tipo_Comercio } from '../../interfaces/Tipo_Comercio';

@Component({
  selector: 'app-gestionar-afiliados',
  standalone: true,
  imports: [HeaderAdminComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './gestionar-afiliados.component.html',
  styleUrls: ['./gestionar-afiliados.component.css']
})
export class GestionarAfiliadosComponent {

  AfiliadoForm: FormGroup;
  telefonosComercioForm: FormGroup;
  telefonos_Comercio: Telefono_comercio[] = [

    { cedula_comercio: '1234567855', telefono: '888-1111' },
    { cedula_comercio: '1234567855', telefono: '888-2222' },
    { cedula_comercio: '9090909090', telefono: '777-1111' },
    { cedula_comercio: '9090909090', telefono: '777-2222' },
    { cedula_comercio: '9090909090', telefono: '666-1111' },
    { cedula_comercio: '1234567855', telefono: '666-2222' },
    { cedula_comercio:'1234567855', telefono: '555-1111' },
    { cedula_comercio: '1234567855', telefono: '555-2222' }

  ];
  AfiliadosLista: Afiliado[] = [

    {
      cedula_juridica: '1234567855',
      nombre: 'Mcdonalds',
      provincia: 'SanJose',
      canton: 'Tibas',
      distrito: 'San Juan',
      correo: 'mcdonalds@gmail.com',
      SINPE: '83689388',
      id_tipo: '1',
      cedula_admin:'1234567890'
    },

    {

      cedula_juridica: '9090909090',
      nombre: 'Dos Pinos',
      provincia: 'Heredia',
      canton: 'Barva',
      distrito: 'Santiago',
      correo: 'dospinos@gmail.com',
      SINPE: '83689383',
      id_tipo: '2',
      cedula_admin:'9876543210'



    }
  ];
  tiposcomercio: Tipo_Comercio[] = [
    { ID: '1', nombre: 'Retail' },
    { ID: '2', nombre: 'Wholesale' },
    { ID: '3', nombre: 'E-commerce' },
    { ID: '4', nombre: 'Service' }
  ];
  constructor(private fb: FormBuilder) {

    this.AfiliadoForm = this.fb.group({
      cedula_juridica: ['', Validators.required],
      nombre: ['', Validators.required],
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      SINPE: ['', Validators.required],
      id_tipo: ['', Validators.required],
      cedula_admin: ['', Validators.required]
    });

    this.telefonosComercioForm = this.fb.group({
      telefonos: this.fb.array([this.fb.control('')]) // Inicializar con un control vacío
    });
  }


/*__________________________________TELÉFONOS________________________________________    */


  get telefonos(): FormArray {
    return this.telefonosComercioForm.get('telefonos') as FormArray;
  }

  addTelefono(): void {
    this.telefonos.push(this.fb.control(''));
  }

  removeTelefono(index: number): void {
    if (this.telefonos.length > 1) {
      this.telefonos.removeAt(index);
    }
  }

  agregarTelefono() {
    if (this.telefonosComercioForm.valid) {
      const nuevoTelefono: Telefono_comercio = {
        cedula_comercio: this.AfiliadoForm.value.cedula_juridica,
        telefono: this.telefonosComercioForm.value.telefono
      };

      //Aquí hacer la llamada de API

      this.telefonos_Comercio.push(nuevoTelefono);
      this.telefonosComercioForm.reset();
    }
  }

  onSubmit() {
    if (this.AfiliadoForm.valid) {
      const nuevoAfiliado: Afiliado = {
        ...this.AfiliadoForm.value,
        telefonos: this.telefonos_Comercio
      };
      this.AfiliadosLista.push(nuevoAfiliado);
      this.AfiliadoForm.reset();
      this.telefonos_Comercio = []; // Resetear la lista de teléfonos
    }
  }

  editarAfiliado(afiliado: Afiliado) {
    // Implementación de la función de edición
  }

  eliminarAfiliado(cedula:string) {
    // Implementación de la función de eliminación
  }


  getTelefonosByCedula(cedula: string): Telefono_comercio[] {
    return this.telefonos_Comercio.filter(t => t.cedula_comercio === cedula);
  }
}
