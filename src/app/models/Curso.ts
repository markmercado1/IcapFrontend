import { Trabajador } from './Trabajador';

export class Curso {
  constructor(
    public idCurso: number,
    public nombre: string,
    public descripcion: string,
    public fechaInicio: string,
    public fechaFin: string,
    public estado: string,
    public modalidad: string,
    public docente: string,

    public trabajador: number
  ) {}
}
export class CursoReport {
  constructor(
    public idCurso: number,
    public nombre: string,
    public descripcion: string,
    public fechaInicio: string,
    public fechaFin: string,
    public estado: string,
    public modalidad: string,
    public docente: string,

    public trabajador: Trabajador
  ) {}
}
