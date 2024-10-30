import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Admin } from '../../interfaces/Admin';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private apiUrl = 'http://localhost:5172/api/Cliente'; // URL base del API

  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}`);
  }

  createEmpleado(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}`, admin);
  }

  updateEmpleado(admin: Admin): Observable<Admin> {
    return this.http.put<Admin>(`${this.apiUrl}/${admin.cedula}`, admin);
  }

  deleteEmpleado(cedula: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cedula}`);
  }
}
