import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../../interfaces/Admin';
import { Observable } from 'rxjs';
import { Direccion_Administrador } from '../../interfaces/Direccion_Administrador';
import { Telefono_admin } from '../../interfaces/Telefono_admin';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private apiUrladmin = 'http://127.0.0.1:8000/admin/'; // URL base del API para Admin
  private apiUrlDireccion = 'http://127.0.0.1:8000/direccionadmin/'; // URL base del API para Direcciones
  private apiUrlTelefono = 'http://127.0.0.1:8000/telefonosadmin/'; // URL base del API para Teléfonos

  constructor(private http: HttpClient) {}

  // Crear un nuevo administrador
  createAdmin(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrladmin}`, admin);
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados para indicar el tipo de contenido

  }

  // Crear una nueva dirección de administrador
  createDirecciones(direccion_administrador: Direccion_Administrador): Observable<Direccion_Administrador> {
    return this.http.post<Direccion_Administrador>(`${this.apiUrlDireccion}`, direccion_administrador);
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados para indicar el tipo de contenido

  }

  // Crear un nuevo teléfono de administrador
  createTelefonos(telefono_admin: Telefono_admin): Observable<Telefono_admin> {
    return this.http.post<Telefono_admin>(`${this.apiUrlTelefono}`, telefono_admin);
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })  // Configurar encabezados para indicar el tipo de contenido

  }

  // Método de actualización del administrador (comentado, pero puede ser útil)
  // updateEmpleado(admin: Admin): Observable<Admin> {
  //   return this.http.put<Admin>(`${this.apiUrladmin}/${admin.cedula}`, admin);
  // }

  // Método de eliminación del administrador (comentado, pero puede ser útil)
  // deleteEmpleado(cedula: string): Observable<void> {
  //   return this.http.delete<void>(`${this.apiUrladmin}/${cedula}`);
  // }
}
