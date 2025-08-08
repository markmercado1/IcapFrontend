import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { Trabajador } from '../models/Trabajador';

@Injectable({
  providedIn: 'root'
})
export class TrabajadorService extends GenericService<Trabajador> {

  private entidadSubject = new BehaviorSubject<Trabajador[]>([]);
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/trabajadores`);
  }

  setEntidadChange(data: Trabajador[]) {
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
}
