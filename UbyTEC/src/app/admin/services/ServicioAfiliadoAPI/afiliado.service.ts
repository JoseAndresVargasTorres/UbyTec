import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Afiliado } from '../../interfaces/Afiliado';
import { AdminComercio } from '../../interfaces/AdminComercio';
import { Direccion_Comercio } from '../../interfaces/Direccion_Comercio';
import { Telefono_comercio } from '../../interfaces/Telefono_comercio';
import { Admin } from '../../interfaces/Admin';
import { Tipo_Comercio } from '../../interfaces/Tipo_Comercio';

@Injectable({
  providedIn: 'root'
})
export class AfiliadoService {

  private apiUrlafiliado = 'http://127.0.0.1:8000/afiliados/'; // URL base del API para Admin
  private apiUrladmin = 'http://127.0.0.1:8000/admin/'; // URL base del API para Admin
  private apiUrlDireccion = 'http://127.0.0.1:8000/direccionafiliado/'; // URL base del API para Direcciones
  private apiUrlTelefono = 'http://127.0.0.1:8000/telefonosafiliado/'; // URL base del API para Teléfonos
  private apiUrltipoComercio = 'http://127.0.0.1:8000/tiposcomercio/'; // URL base del API para Admin

  constructor(private http: HttpClient) {}

  // Crear un nuevo administrador
  createAfiliados(afiliado: Afiliado): Observable<Afiliado> {
    return this.http.post<Afiliado>(`${this.apiUrlafiliado}`, afiliado, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados correctamente
    });
  }

  // Crear una nueva dirección de administrador
  createDirecciones(direccion_afiliado: Direccion_Comercio): Observable<Direccion_Comercio> {
    return this.http.post<Direccion_Comercio>(`${this.apiUrlDireccion}`, direccion_afiliado, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados correctamente
    });
  }

  // Crear un nuevo teléfono de administrador
  createTelefonos(telefono_afiliado: Telefono_comercio): Observable<Telefono_comercio> {
    return this.http.post<Telefono_comercio>(`${this.apiUrlTelefono}`, telefono_afiliado, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados correctamente
    });
  }

  // Obtener todos los administradores
  getAfiliados(): Observable<Afiliado[]> {
    return this.http.get<Afiliado[]>(`${this.apiUrlafiliado}`);
  }

  // Obtener todos los administradores
  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrladmin}`);
  }

  // Obtener todas las direcciones de administradores
  getDirecciones(): Observable<Direccion_Comercio[]> {
    return this.http.get<Direccion_Comercio[]>(`${this.apiUrlDireccion}`);
  }

  // Obtener todos los teléfonos de administradores
  getTelefonos(): Observable<Telefono_comercio[]> {
    return this.http.get<Telefono_comercio[]>(`${this.apiUrltipoComercio}`);
  }


  // Obtener todos los teléfonos de administradores
  getTiposdeComercio(): Observable<Tipo_Comercio[]> {
    return this.http.get<Tipo_Comercio[]>(`${this.apiUrltipoComercio}`);
  }

  // PUT para actualizar administrador
  updateAfiliado(afiliado: Afiliado): Observable<Afiliado> {
    return this.http.put<Afiliado>(`${this.apiUrlafiliado}${afiliado.cedula_juridica}`, afiliado, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados correctamente
    });
  }

  // PUT para actualizar dirección de administrador
  updateDireccion(direccion: Direccion_Comercio): Observable<Direccion_Comercio> {
    return this.http.put<Direccion_Comercio>(`${this.apiUrlDireccion}${direccion.id_comercio}`, direccion, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados correctamente
    });
  }

  // PUT para actualizar teléfono de administrador
  updateTelefono(telefono: Telefono_comercio): Observable<Telefono_comercio> {
    return this.http.put<Telefono_comercio>(`${this.apiUrlTelefono}${telefono.cedula_comercio}`, telefono, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados correctamente
    });

  }

   // PUT para actualizar teléfonos de administrador con una URL específica
   putTelefonos(url: string, body: any): Observable<any> {
    return this.http.put(`${this.apiUrlTelefono}${url}`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados correctamente
    });
  }


  // Obtener un administrador por ID
  getOneComercio(id_comercio: string): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrlafiliado}${id_comercio}`);
  }

  // Obtener la dirección de un administrador por ID
  getDireccionComercio(id_admin: string): Observable<Direccion_Comercio> {
    return this.http.get<Direccion_Comercio>(`${this.apiUrlDireccion}${id_admin}`);
  }

  // Obtener los teléfonos asociados a un administrador específico por ID
  getTelefonosComercio(id_comercio: string): Observable<Telefono_comercio[]> {
    return this.http.get<Telefono_comercio[]>(`${this.apiUrlTelefono}${id_comercio}`);
  }

  deleteComercio(id_comercio: string): Observable<any> {
    return this.http.delete(`${this.apiUrlafiliado}${id_comercio}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados correctamente
    });
  }

  deleteDireccionesComercio(id_comercio: string): Observable<any> {
    return this.http.delete(`${this.apiUrlDireccion}${id_comercio}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados correctamente
    });
  }

  deleteTelefonosAdmin(id_admin: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlTelefono}${id_admin}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }


}
