import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Curso } from '../models/Curso';
import { CursoReport } from '../models/Curso';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class CursoService extends GenericService<Curso> {
  private cursosSubject: Subject<CursoReport[]> = new Subject<CursoReport[]>();

  private cursoSeleccionadoSubject = new BehaviorSubject<CursoReport | null>(
    null
  );
  cursoSeleccionado$ = this.cursoSeleccionadoSubject.asObservable();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/cursos`);
  }

  findAllOT(): void {
    this.http.get<CursoReport[]>(this.url).subscribe((data) => {
      this.cursosSubject.next(data);
    });
  }

  findByIdOT(id: number) {
    return this.http.get<CursoReport>(this.url + `/${id}`);
  }

  seleccionarCurso(curso: CursoReport) {
    console.log('SERVICE');
    console.log(curso);
    this.cursoSeleccionadoSubject.next(curso);
  }

  setCursosSubject(data: CursoReport[]) {
    this.cursosSubject.next(data);
  }
  getCursosSubject() {
    return this.cursosSubject.asObservable();
  }

  listPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }
  listAll(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.url + '/all');
  }
}
