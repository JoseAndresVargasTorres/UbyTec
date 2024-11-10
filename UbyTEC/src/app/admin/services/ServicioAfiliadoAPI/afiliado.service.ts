import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Afiliado } from '../../interfaces/Afiliado';
import { AdminComercio } from '../../interfaces/AdminComercio';

@Injectable({
  providedIn: 'root'
})
export class AfiliadoService {
  private apiUrl = 'https://tu-api-url.com/api'; // Reemplaza con tu URL base

  constructor(private http: HttpClient) { }

  // Métodos para Afiliados
  getAfiliados(): Observable<Afiliado[]> {
    return this.http.get<Afiliado[]>(`${this.apiUrl}/afiliados`)
      .pipe(catchError(this.handleError));
  }

  getAfiliado(cedula: string): Observable<Afiliado> {
    return this.http.get<Afiliado>(`${this.apiUrl}/afiliados/${cedula}`)
      .pipe(catchError(this.handleError));
  }

  createAfiliado(afiliado: Afiliado): Observable<Afiliado> {
    return this.http.post<Afiliado>(`${this.apiUrl}/afiliados`, afiliado)
      .pipe(catchError(this.handleError));
  }

  updateAfiliado(cedula: string, afiliado: Afiliado): Observable<Afiliado> {
    return this.http.put<Afiliado>(`${this.apiUrl}/afiliados/${cedula}`, afiliado)
      .pipe(catchError(this.handleError));
  }

  deleteAfiliado(cedula: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/afiliados/${cedula}`)
      .pipe(catchError(this.handleError));
  }

  // Métodos para Administradores de Comercio
  getAdmins(): Observable<AdminComercio[]> {
    return this.http.get<AdminComercio[]>(`${this.apiUrl}/admins`)
      .pipe(catchError(this.handleError));
  }

  getAdmin(cedula: string): Observable<AdminComercio> {
    return this.http.get<AdminComercio>(`${this.apiUrl}/admins/${cedula}`)
      .pipe(catchError(this.handleError));
  }

  createAdmin(admin: AdminComercio): Observable<AdminComercio> {
    return this.http.post<AdminComercio>(`${this.apiUrl}/admins`, admin)
      .pipe(catchError(this.handleError));
  }

  updateAdmin(cedula: string, admin: AdminComercio): Observable<AdminComercio> {
    return this.http.put<AdminComercio>(`${this.apiUrl}/admins/${cedula}`, admin)
      .pipe(catchError(this.handleError));
  }

  deleteAdmin(cedula: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admins/${cedula}`)
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error en la operación.';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
