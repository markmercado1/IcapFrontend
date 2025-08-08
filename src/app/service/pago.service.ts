import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pago } from '../models/Pago';
import { PagoReport } from '../models/Pago';
import { MesPago } from '../models/MesPago';

@Injectable({
  providedIn: 'root'
})
export class PagoService extends GenericService<Pago> {

  private entidadSubject = new BehaviorSubject<PagoReport[]>([]);
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/pago`);
  }

  setEntidadChange(data: PagoReport[]) {
    this.entidadSubject.next(data);
  }

  getEntidadChange() {
    return this.entidadSubject.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  // Para obtener pagos con el objeto Agremiado completo (Reporte)
  getReporte() {
    return this.http.get<PagoReport[]>(`${this.url}/reporte`);
  }
obtenerPagos(idAgremiado: number): Observable<MesPago[]> {
  return this.http.get<MesPago[]>(`${environment.HOST}/pagos/meses/${idAgremiado}`);
}


}
