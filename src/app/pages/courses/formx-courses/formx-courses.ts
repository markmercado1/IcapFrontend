import { NgIf, NgForOf, CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Trabajador } from '../../../models/Trabajador';
import { CursoService } from '../../../service/curso.service';
import { TrabajadorService } from '../../../service/trabajador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Curso } from '../../../models/Curso';
import { switchMap } from 'rxjs';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-formx-courses',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    MatDatepicker,
    CommonModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './formx-courses.html',
  styleUrl: './formx-courses.css',
})
export class FormxCourses implements OnInit {
  coursForm!: FormGroup;

  modalidades: string[] = ['PRESENCIAL', 'VIRTUAL', 'MIXTO'];
  estados: string[] = ['ACTIVO', 'INACTIVO'];
  trabajadores: Trabajador[] = [];

  id!: number;
  isEdit!: boolean;
  constructor(
    private serviceCurso: CursoService,
    private serviceTrabajador: TrabajadorService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.coursForm = new FormGroup({
      idCurso: new FormControl(null),

      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
      ]),
      docente: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(100),
      ]),

      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(250),
      ]),

      trabajador: new FormControl(null, [Validators.required]),

      aCorreo: new FormControl('', [Validators.required, Validators.email]),
      aCiudad: new FormControl('', [Validators.required]),

      fechaInicio: new FormControl('', [Validators.required]),
      fechaFin: new FormControl('', [Validators.required]),
      modalidad: new FormControl('', [Validators.required]),
      estado: new FormControl('', [Validators.required]),
    });

    // Trabajadores
    this.serviceTrabajador.findAll().subscribe((data) => {
      this.trabajadores = data;
    });

    this.route.params.subscribe((data) => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.isEdit) {
      this.serviceCurso.findByIdOT(this.id).subscribe((data) => {
        this.coursForm = new FormGroup({
          idCurso: new FormControl(data.idCurso),
          nombre: new FormControl(data.nombre, [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(100),
          ]),
          docente: new FormControl(data.nombre, [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(100),
          ]),
          descripcion: new FormControl(data.descripcion, [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(250),
          ]),
          trabajador: new FormControl(data.trabajador, [Validators.required]),
          fechaInicio: new FormControl(data.fechaInicio, [Validators.required]),
          fechaFin: new FormControl(data.fechaFin, [Validators.required]),
          modalidad: new FormControl(data.modalidad, [Validators.required]),
          estado: new FormControl(data.estado, [Validators.required]),
        });
      });
    }
  }

  operar() {
    const curs: Curso = { ...this.coursForm.value };
    const operacion = this.isEdit
      ? this.serviceCurso.update(curs.idCurso, curs)
      : this.serviceCurso.save(curs);

    operacion
      .pipe(
        switchMap(() => {
          return this.serviceCurso.listPageable(0, 2);
        })
      )
      .subscribe((data) => {
        this.serviceCurso.setCursosSubject(data);
        const mensaje = this.isEdit
          ? 'Se ha Modificado correctamente'
          : 'Se ha Creado correctamente';
        this.toastMsg(mensaje);
        this.router.navigate(['pages/gscursos']);
      });
  }
  cancelar() {
    this.router.navigate(['/pages/gscursos']);
  }

  toastMsg(msg: string): void {
    this._snackBar.open(msg, 'INFO', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}
