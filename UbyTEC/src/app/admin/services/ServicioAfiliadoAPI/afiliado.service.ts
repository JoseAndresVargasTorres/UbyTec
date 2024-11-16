import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Afiliado } from '../../interfaces/Afiliado';
import { AdminComercio } from '../../interfaces/AdminComercio';
import { Direccion_Comercio } from '../../interfaces/Direccion_Comercio';
import { Telefono_comercio } from '../../interfaces/Telefono_comercio';
import { Admin } from '../../interfaces/Admin';
import { Tipo_Comercio } from '../../interfaces/Tipo_Comercio';

/**
 * Servicio para gestionar las operaciones CRUD de Afiliados y sus datos relacionados
 * @Injectable indica que este servicio puede ser inyectado en otros componentes/servicios
 */
@Injectable({
  providedIn: 'root' // El servicio está disponible en toda la aplicación
})
export class AfiliadoService {
  // URLs base para los diferentes endpoints de la API
  private apiUrlafiliado = 'http://127.0.0.1:8000/afiliados/';
  private apiUrladmin = 'http://127.0.0.1:8000/admin/';
  private apiUrlDireccion = 'http://127.0.0.1:8000/direccionafiliado/';
  private apiUrlTelefono = 'http://127.0.0.1:8000/telefonosafiliado/';
  private apiUrltipoComercio = 'http://127.0.0.1:8000/tiposcomercio/';

  constructor(private http: HttpClient) {} // Inyección del servicio HttpClient

  /**
   * OPERACIONES CRUD PARA AFILIADOS
   */

  /**
   * Crea un nuevo afiliado
   * @param afiliado Objeto con los datos del afiliado a crear
   * @returns Observable con el afiliado creado
   */
  createAfiliados(afiliado: Afiliado): Observable<Afiliado> {
    return this.http.post<Afiliado>(this.apiUrlafiliado, afiliado, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  /**
   * OPERACIONES CRUD PARA DIRECCIONES
   */

  /**
   * Crea una nueva dirección para un comercio
   * @param direccion_afiliado Objeto con los datos de la dirección
   * @returns Observable con la dirección creada
   */
  createDirecciones(direccion_afiliado: Direccion_Comercio): Observable<Direccion_Comercio> {
    return this.http.post<Direccion_Comercio>(this.apiUrlDireccion, direccion_afiliado, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  /**
   * OPERACIONES CRUD PARA TELÉFONOS
   */

  /**
   * Crea un nuevo teléfono para un comercio
   * @param telefono_afiliado Objeto con los datos del teléfono
   * @returns Observable con el teléfono creado
   */
  createTelefonos(telefonos: Telefono_comercio[]): Observable<Telefono_comercio[]> {
    return this.http.post<Telefono_comercio[]>(this.apiUrlTelefono, telefonos, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  /**
   * MÉTODOS GET PARA OBTENER LISTADOS
   */

  // Obtener todos los afiliados
  getAfiliados(): Observable<Afiliado[]> {
    return this.http.get<Afiliado[]>(this.apiUrlafiliado);
  }

  // Obtener todos los administradores
  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.apiUrladmin);
  }

  // Obtener todas las direcciones
  getDirecciones(): Observable<Direccion_Comercio[]> {
    return this.http.get<Direccion_Comercio[]>(this.apiUrlDireccion);
  }

  // Obtener todos los teléfonos
  getAllTelefonosComercio(): Observable<Telefono_comercio[]> {
    return this.http.get<Telefono_comercio[]>(this.apiUrlTelefono);
  }

  // Obtener todos los tipos de comercio
  getTiposdeComercio(): Observable<Tipo_Comercio[]> {
    return this.http.get<Tipo_Comercio[]>(this.apiUrltipoComercio);
  }

  /**
   * OPERACIONES DE ACTUALIZACIÓN (PUT)
   */

  /**
   * Actualiza los datos de un afiliado
   * @param afiliado Objeto con los nuevos datos del afiliado
   * @returns Observable con el afiliado actualizado
   */
  updateAfiliado(afiliado: Afiliado): Observable<Afiliado> {
    return this.http.put<Afiliado>(`${this.apiUrlafiliado}${afiliado.cedula_juridica}`, afiliado, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  /**
   * Actualiza una dirección
   * @param direccion Objeto con los nuevos datos de la dirección
   * @returns Observable con la dirección actualizada
   */
  updateDireccion(direccion: Direccion_Comercio): Observable<Direccion_Comercio> {
    return this.http.put<Direccion_Comercio>(`${this.apiUrlDireccion}${direccion.id_comercio}`, direccion, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }


  /**
   * Actualiza teléfonos usando una URL específica
   * @param url URL específica para la actualización
   * @param body Datos a actualizar
   * @returns Observable con la respuesta
   */
  putTelefonos(url: string, body: any): Observable<any> {
    return this.http.put(`${this.apiUrlTelefono}${url}`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  /**
   * MÉTODOS GET PARA OBTENER ELEMENTOS ESPECÍFICOS
   */

  /**
   * Obtiene un comercio específico por ID
   * @param id_comercio ID del comercio a buscar
   * @returns Observable con los datos del comercio
   */
  getOneComercio(id_comercio: string): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrlafiliado}${id_comercio}`);
  }

  /**
   * Obtiene la dirección de un comercio específico
   * @param id_admin ID del comercio
   * @returns Observable con los datos de la dirección
   */
  getDireccionComercio(id_admin: string): Observable<Direccion_Comercio> {
    return this.http.get<Direccion_Comercio>(`${this.apiUrlDireccion}${id_admin}`);
  }

  /**
   * Obtiene los teléfonos de un comercio específico
   * @param id_comercio ID del comercio
   * @returns Observable con array de teléfonos
   */
  getTelefonosComercio(id_comercio: string): Observable<Telefono_comercio[]> {
    return this.http.get<Telefono_comercio[]>(`${this.apiUrlTelefono}${id_comercio}`);
  }

  /**
   * OPERACIONES DE ELIMINACIÓN (DELETE)
   */

  /**
   * Elimina un comercio
   * @param id_comercio ID del comercio a eliminar
   * @returns Observable con la respuesta
   */
  deleteComercio(id_comercio: string): Observable<any> {
    return this.http.delete(`${this.apiUrlafiliado}${id_comercio}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  /**
   * Elimina las direcciones de un comercio
   * @param id_comercio ID del comercio
   * @returns Observable con la respuesta
   */
  deleteDireccionesComercio(id_comercio: string): Observable<any> {
    return this.http.delete(`${this.apiUrlDireccion}${id_comercio}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  /**
   * Elimina los teléfonos de un administrador
   * @param id_admin ID del administrador
   * @returns Observable con la respuesta
   */
  deleteTelefonosAdmin(id_admin: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrlTelefono}${id_admin}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
