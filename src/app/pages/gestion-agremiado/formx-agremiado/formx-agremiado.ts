import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TipoColegiado } from '../../../models/TipoColegiado';
import { EstadoColegiado } from '../../../models/EstadoColegiado';
import { Trabajador } from '../../../models/Trabajador';
import { AgremiadoService } from '../../../service/agremiado.service';
import { EstadoColegiadoService } from '../../../service/estadoColegiado.service';
import { TipoColegiadoService } from '../../../service/tipoColegiado.service';
import { TrabajadorService } from '../../../service/trabajador.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Agremiado } from '../../../models/Agremiado';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-formx-agremiado',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, NgIf, RouterLink, NgForOf],
  templateUrl: './formx-agremiado.html',
  styleUrl: './formx-agremiado.css',
})
export class FormxAgremiado implements OnInit {
  agremmiadForm!: FormGroup;

  tipoColegiados: TipoColegiado[] = [];
  estadoColegiados: EstadoColegiado[] = [];
  trabajadores: Trabajador[] = [];

  id!: number;
  isEdit!: boolean;
  constructor(
    private serviceAgremiado: AgremiadoService,
    private serviceEstadoColegiado: EstadoColegiadoService,
    private serviceTipoColegiado: TipoColegiadoService,
    private serviceTrabajador: TrabajadorService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.agremmiadForm = new FormGroup({
      idAgremiado: new FormControl(null),

      dni: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern(/^\d+$/),
      ]),

      genero: new FormControl('M', [Validators.required]),

      tipoColegiado: new FormControl(null, [Validators.required]), // ← long
      estadoColegiado: new FormControl(null, [Validators.required]),
      trabajador: new FormControl(null, [Validators.required]),

      aNombres: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      aApellidoPaterno: new FormControl('', [Validators.required]),
      aApellidoMaterno: new FormControl('', [Validators.required]),
      aCelular: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{9}$/),
      ]),
      aCorreo: new FormControl('', [Validators.required, Validators.email]),
      aCiudad: new FormControl('', [Validators.required]),

      aFechaNacimiento: new FormControl('', [Validators.required]),
      aFechaIncorporacion: new FormControl('', [Validators.required]),
    });
    // Estado Colegiado
    this.serviceEstadoColegiado.findAll().subscribe((data) => {
      this.estadoColegiados = data;
    });

    // Tipo Colegiado
    this.serviceTipoColegiado.findAll().subscribe((data) => {
      this.tipoColegiados = data;
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
      this.serviceAgremiado.findByIdOT(this.id).subscribe((data) => {
        this.agremmiadForm = new FormGroup({
          idAgremiado: new FormControl(data.idAgremiado),
          dni: new FormControl(data.dni, [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(15),
          ]),
          genero: new FormControl(data.genero, [Validators.required]),
          tipoColegiado: new FormControl(data.tipoColegiado, [
            Validators.required,
          ]),
          estadoColegiado: new FormControl(data.estadoColegiado, [
            Validators.required,
          ]),
          trabajador: new FormControl(data.trabajador, [Validators.required]),
          aNombres: new FormControl(data.anombres, [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
          aApellidoPaterno: new FormControl(data.aapellidoPaterno, [
            Validators.required,
            Validators.maxLength(30),
          ]),
          aApellidoMaterno: new FormControl(data.aapellidoMaterno, [
            Validators.required,
            Validators.maxLength(30),
          ]),
          aCelular: new FormControl(data.acelular, [
            Validators.required,
            Validators.pattern('[0-9]{9}'),
          ]),
          aCorreo: new FormControl(data.acorreo, [
            Validators.required,
            Validators.email,
          ]),
          aCiudad: new FormControl(data.aciudad, [
            Validators.required,
            Validators.maxLength(50),
          ]),
          aFechaNacimiento: new FormControl(data.afechaNacimiento, [
            Validators.required,
          ]),
          aFechaIncorporacion: new FormControl(data.afechaIncorporacion, [
            Validators.required,
          ]),
        });
      });
    }
  }

  operar() {
    const agremiad: Agremiado = { ...this.agremmiadForm.value };
    const operacion = this.isEdit
      ? this.serviceAgremiado.update(agremiad.idAgremiado, agremiad)
      : this.serviceAgremiado.save(agremiad);

    operacion
      .pipe(
        switchMap(() => {
          return this.serviceAgremiado.listPageable(0, 2);
        })
      )
      .subscribe((data) => {
        this.serviceAgremiado.setAgremiadosSubject(data);
        const mensaje = this.isEdit
          ? 'Se ha Modificado correctamente'
          : 'Se ha Creado correctamente';
        this.toastMsg(mensaje);
        this.router.navigate(['pages/gsagremiados']);
      });
  }

  toastMsg(msg: string): void {
    this._snackBar.open(msg, 'INFO', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
  get f() {
  return this.agremmiadForm.controls;
}

}
