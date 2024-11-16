// shared.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private baseUrl = 'http://localhost:4200'; // Cambiar por tu URL de backend

  constructor(private http: HttpClient) {}

  // Métodos que usan HttpClient
  getData() {
    return this.http.get('https://api.example.com/data');
  }
  
  getAffiliateShops(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/affiliate-shops`);
  }

  getPurchaseHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/purchase-history`);
  }
}
