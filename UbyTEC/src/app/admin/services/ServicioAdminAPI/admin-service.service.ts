import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AdministradorApp } from '../../interfaces/adminapp/AdministradorApp';
import { Observable } from 'rxjs';
import { Direccion_AdministradorApp } from '../../interfaces/adminapp/Direccion_AdministradorApp ';
import { Telefono_AdminApp } from '../../interfaces/adminapp/Telefono_AdminApp';

@Injectable({
  providedIn: 'root'
})
export class AdminAppServiceService {

  private apiUrlAdminApp = 'http://127.0.0.1:8000/adminapp/';
  private apiUrlDireccion = 'http://127.0.0.1:8000/adminapp/direcciones/';
  private apiUrlTelefono = 'http://127.0.0.1:8000/adminapp/telefonos/';

  constructor(private http: HttpClient) {}

  // Crear un nuevo administrador de app
  createAdminApp(adminApp: AdministradorApp): Observable<AdministradorApp> {
    return this.http.post<AdministradorApp>(`${this.apiUrlAdminApp}`, adminApp, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Crear una nueva dirección de administrador de app
  createDireccionesAdminApp(direccion: Direccion_AdministradorApp): Observable<Direccion_AdministradorApp> {
    return this.http.post<Direccion_AdministradorApp>(`${this.apiUrlDireccion}`, direccion, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Crear un nuevo teléfono de administrador de app
  createTelefonosAdminApp(telefono: Telefono_AdminApp): Observable<Telefono_AdminApp> {
    return this.http.post<Telefono_AdminApp>(`${this.apiUrlTelefono}`, telefono, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Obtener todos los administradores de app
  getAdminApps(): Observable<AdministradorApp[]> {
    return this.http.get<AdministradorApp[]>(`${this.apiUrlAdminApp}`);
  }

  // Obtener todas las direcciones de administradores de app
  getDireccionesAdminApp(): Observable<Direccion_AdministradorApp[]> {
    return this.http.get<Direccion_AdministradorApp[]>(`${this.apiUrlDireccion}`);
  }

  // Obtener todos los teléfonos de administradores de app
  getAllTelefonosAdminApp(): Observable<Telefono_AdminApp[]> {
    return this.http.get<Telefono_AdminApp[]>(`${this.apiUrlTelefono}`);
  }

  // PUT para actualizar administrador de app
  updateAdminApp(adminApp: AdministradorApp): Observable<AdministradorApp> {
    return this.http.put<AdministradorApp>(`${this.apiUrlAdminApp}${adminApp.cedula}`, adminApp, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // PUT para actualizar dirección de administrador de app
  updateDireccionAdminApp(direccion: Direccion_AdministradorApp): Observable<Direccion_AdministradorApp> {
    return this.http.put<Direccion_AdministradorApp>(`${this.apiUrlDireccion}${direccion.id_admin}`, direccion, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // PUT para actualizar teléfono de administrador de app
  updateTelefonoAdminApp(telefono: Telefono_AdminApp): Observable<Telefono_AdminApp> {
    return this.http.put<Telefono_AdminApp>(`${this.apiUrlTelefono}${telefono.cedula_admin}`, telefono, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Obtener un administrador de app por ID
  getOneAdminApp(id_admin: string): Observable<AdministradorApp> {
    return this.http.get<AdministradorApp>(`${this.apiUrlAdminApp}${id_admin}`);
  }

  // Obtener la dirección de un administrador de app por ID
  getDireccionAdminApp(id_admin: string): Observable<Direccion_AdministradorApp> {
    return this.http.get<Direccion_AdministradorApp>(`${this.apiUrlDireccion}${id_admin}`);
  }

  // Obtener los teléfonos de un administrador de app específico por ID
  getTelefonosAdminApp(id_admin: string): Observable<Telefono_AdminApp[]> {
    return this.http.get<Telefono_AdminApp[]>(`${this.apiUrlTelefono}${id_admin}`);
  }

  // PUT para actualizar múltiples teléfonos de un administrador de app
  putTelefonosAdminApp(url: string, body: any): Observable<any> {
    return this.http.put(`${this.apiUrlTelefono}${url}`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Eliminar un administrador de app
  deleteAdminApp(id_admin: string): Observable<any> {
    return this.http.delete(`${this.apiUrlAdminApp}${id_admin}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Eliminar la dirección de un administrador de app
  deleteDireccionesAdminApp(id_admin: string): Observable<any> {
    return this.http.delete(`${this.apiUrlDireccion}${id_admin}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Eliminar los teléfonos de un administrador de app
  deleteTelefonosAdminApp(id_admin: string): Observable<any> {
    return this.http.delete(`${this.apiUrlTelefono}${id_admin}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
