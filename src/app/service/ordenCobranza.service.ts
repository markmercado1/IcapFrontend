import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class OrdenCobranzaService {
  private apiUrl = `${environment.HOST}/api/ordenes`;

  constructor(private http: HttpClient) {}
  raw(idOrden: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf/${idOrden}`, {
      responseType: 'blob',
    });
  }

  generarOrden(data: any) {
    return this.http.post(`${this.apiUrl}/generar`, data);
  }

  getOrdenes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  marcarComoPagado(idOrden: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idOrden}/pagado`, {});
  }
  getOrdenesPaginadas(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`);
  }
  marcarComoCancelado(idOrden: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idOrden}/cancelado`, {});
  }
  marcarComoPagadoConDetalles(orden: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orden.idOrden}/pagado`, orden);
  }
}
