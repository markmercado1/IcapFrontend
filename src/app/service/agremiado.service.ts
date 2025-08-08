import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Agremiado } from '../models/Agremiado';
import { AgremiadoReport } from '../models/Agremiado';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class AgremiadoService extends GenericService<Agremiado> {
  private agremiadosSubject: Subject<AgremiadoReport[]> = new Subject<
    AgremiadoReport[]
  >();

  private agremiadoSeleccionadoSubject =
    new BehaviorSubject<AgremiadoReport | null>(null);
  agremiadoSeleccionado$ = this.agremiadoSeleccionadoSubject.asObservable();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/agremiados`);
  }
  getPorDni(dni: string): Observable<any> {
    return this.http.get(`${this.url}/dni/${dni}`);
  }

  getPorId(id: string): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  findAllOT(): void {
    this.http.get<AgremiadoReport[]>(this.url).subscribe((data) => {
      this.agremiadosSubject.next(data);
    });
  }

  findByIdOT(id: number) {
    return this.http.get<AgremiadoReport>(this.url + `/${id}`);
  }

  seleccionarAgremiado(agremiado: AgremiadoReport) {
    console.log('SERVICE');
    console.log(agremiado);
    this.agremiadoSeleccionadoSubject.next(agremiado);
  }

  setAgremiadosSubject(data: AgremiadoReport[]) {
    this.agremiadosSubject.next(data);
  }
  getAgremiadosSubject() {
    return this.agremiadosSubject.asObservable();
  }

  listPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
  listPageableFiltered(
    filtro: string,
    page: number,
    size: number
  ): Observable<any> {
    return this.http.get<any>(`${this.url}/filtrar`, {
      params: {
        filtro: filtro,
        page: page,
        size: size,
      },
    });
  }
}
