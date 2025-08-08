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
import { TrabajadorService } from '../../../service/trabajador.service';
import { EventoService } from '../../../service/evento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Evento } from '../../../models/Evento';
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
  selector: 'app-form-eventos',
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
  templateUrl: './form-eventos.html',
  styleUrl: './form-eventos.css',
})
export class FormEventos implements OnInit {
  eventoForm!: FormGroup;

  trabajadores: Trabajador[] = [];

  id!: number;
  isEdit!: boolean;
  constructor(
    private serviceEvento: EventoService,
    private serviceTrabajador: TrabajadorService,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
    this.eventoForm = new FormGroup({
      idEvento: new FormControl(null),

      eTitulo: new FormControl('', [
        Validators.required,
        Validators.maxLength(200),
      ]),
      eDescripcion: new FormControl('', [
        Validators.required,
        Validators.maxLength(500),
      ]),

      eFechaInicio: new FormControl('', [Validators.required]),
      eFechaFin: new FormControl('', [Validators.required]),
      eEstado: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      eFechaCreacion: new FormControl(''), // ← Puede ir vacío (opcional)
      eImagen: new FormControl(null), // ← opcional, tipo `File`
      eDocumento: new FormControl(null),
      trabajador: new FormControl(null, [Validators.required]),
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
      this.serviceEvento.findByIdReport(this.id).subscribe((data) => {
        this.eventoForm = new FormGroup({
          idEvento: new FormControl(data.idEvento),
          eTitulo: new FormControl(data.etitulo, [
            Validators.required,
            Validators.maxLength(200),
          ]),

          eDescripcion: new FormControl(data.edescripcion, [
            Validators.required,
            Validators.maxLength(500),
          ]),

          trabajador: new FormControl(data.trabajador, [Validators.required]),

          eFechaInicio: new FormControl(data.efechaInicio, [
            Validators.required,
          ]),

          eFechaFin: new FormControl(data.efechaFin, [Validators.required]),

          eEstado: new FormControl(data.eestado, [
            Validators.required,
            Validators.maxLength(50),
          ]),

          eFechaCreacion: new FormControl({
            value: data.efechaCreacion,
            disabled: true,
          }),

          // estos campos se manejarán con archivos
          eImagen: new FormControl(null),
          eDocumento: new FormControl(null),
        });
      });
    }
  }

operar() {
  const formValue = this.eventoForm.value;
  const formData = new FormData();

  // Obtener fechas
  const fechaInicio = this.eventoForm.get('eFechaInicio')?.value;
  const fechaFin = this.eventoForm.get('eFechaFin')?.value;

  // Rellenar campos básicos
  formData.append('eTitulo', formValue.eTitulo);
  formData.append('eDescripcion', formValue.eDescripcion);
  formData.append('eFechaInicio', fechaInicio?.toISOString().split('T')[0]);
  formData.append('eFechaFin', fechaFin?.toISOString().split('T')[0]);
  formData.append('eEstado', formValue.eEstado);
  formData.append('trabajador', formValue.trabajador);

  // Archivos
  const imagenInput = document.getElementById('imagen') as HTMLInputElement;
  const documentoInput = document.getElementById('documento') as HTMLInputElement;

  if (imagenInput?.files?.length) {
    formData.append('eImagen', imagenInput.files[0]);
  }

  if (documentoInput?.files?.length) {
    formData.append('eDocumento', documentoInput.files[0]);
  }

  // Verificación en consola
  console.log('Contenido del FormData:');
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  // Lógica para guardar o actualizar
  const operacion = this.isEdit
    ? this.serviceEvento.updateWithFile(formValue.idEvento, formData)
    : this.serviceEvento.saveWithFile(formData);

  operacion.pipe(
    switchMap(() => this.serviceEvento.listPageable(0, 2))
  ).subscribe((data) => {
    this.serviceEvento.setEventoSubject(data);
    const mensaje = this.isEdit
      ? 'Se ha Modificado correctamente'
      : 'Se ha Creado correctamente';
    this.toastMsg(mensaje);
    this.router.navigate(['/pages/gseventos']);
  });
}






  cancelar() {
    this.router.navigate(['/pages/gseventos']);
  }
  onFileSelect(event: Event, controlName: string): void {
  const input = event.target as HTMLInputElement;
  if (input?.files?.length) {
    const file = input.files[0];
    this.eventoForm.patchValue({ [controlName]: file });
  }
}

  toastMsg(msg: string): void {
    this._snackBar.open(msg, 'INFO', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
}
