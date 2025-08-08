import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { OrdenCobranzaService } from '../../service/ordenCobranza.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
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
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatRadioModule } from '@angular/material/radio';
import { AgremiadoService } from '../../service/agremiado.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from '../../../environments/environment';
interface Concepto {
  descripcion: string;
  monto: number;
  mes?: number | null;
  anio?: number | null;
}

@Component({
  selector: 'app-generar-orden',
  imports: [
    MatRadioModule,
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './generar-orden.html',
  styleUrl: './generar-orden.css',
})
export class GenerarOrdenComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ordenesDataSource: any[] = [];
  pageSizeOptions = [5, 10, 20];
  pageSize = 5;
  currentPage = 0;
  totalItems = 0;
  displaysedColumns: string[] = [
    'id',
    'agremiadoId',
    'nombreAgremiado',
    'fecha',
    'total',
    'estado',
    'acciones',
  ];

  // Manejo de eventos de paginación
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarOrdenesPaginadas();
  }
  cargarOrdenesPaginadas() {
    this.ordenService
      .getOrdenesPaginadas(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.ordenesDataSource = response.ordenes;
          this.totalItems = response.totalItems; // Asegúrate que el backend devuelva esto
        },
        error: (err) => console.error('Error:', err),
      });
  }
  ngOnInit(): void {
    // Carga inicial de órdenes (usa cargarOrdenes() que ya implementa la lógica correcta)
    this.cargarOrdenesPaginadas();

    // Configuración de búsqueda por DNI
    this.dniInput$
      .pipe(debounceTime(400)) // espera 400 ms tras última tecla
      .subscribe((dni) => {
        if (dni.length >= 6) {
          this.agremiadoService.getPorDni(dni).subscribe({
            next: (data) => (this.agremiadoSeleccionado = data),
            error: () => (this.agremiadoSeleccionado = null),
          });
        } else {
          this.agremiadoSeleccionado = null;
        }
      });

    // Configuración de búsqueda por ID
    this.idInput$.pipe(debounceTime(400)).subscribe((id) => {
      if (id.length > 0) {
        this.agremiadoService.getPorId(id).subscribe({
          next: (data) => (this.agremiadoSeleccionado = data),
          error: () => (this.agremiadoSeleccionado = null),
        });
      } else {
        this.agremiadoSeleccionado = null;
      }
    });
  }
  dniInput$: Subject<string> = new Subject<string>();
  idInput$: Subject<string> = new Subject<string>();
  idAgremiado: string | null = null;
  modoBusqueda: 'dni' | 'id' = 'dni'; // puedes dejar 'dni' como valor inicial
  agremiadoSeleccionado: any = null;

  dni: string = '';
  conceptos = new MatTableDataSource<Concepto>([]);

  conceptoActual: Concepto = {
    descripcion: '',
    monto: 0,
  };

  conceptoSeleccionado: string = ''; // para mat-select
  conceptoActualSeleccionado: { mes: number; anio: number } | null = null;
  conceptosAgregados: {
    descripcion: string;
    monto: number;
    mes?: number;
    anio?: number;
  }[] = [];

  displayedColumns: string[] = [
    'descripcion',
    'mes',
    'año',
    'monto',
    'acciones',
  ];
  conceptosPredefinidos = [
    { descripcion: 'Matricula', monto: 1200 },
    { descripcion: 'Mensualidad', monto: 10 },
    { descripcion: 'Derecho de Colegiatura', monto: 300 },
    { descripcion: 'Constancia de Habilitación', monto: 60 },
    { descripcion: 'Duplicación de Carnet', monto: 50 },
    { descripcion: 'Recarnetización', monto: 45 },
    { descripcion: 'Carnet de Biblioteca', monto: 40 },
    { descripcion: 'Medalla', monto: 100 },
    { descripcion: 'Solapera', monto: 30 },
    { descripcion: 'Constancia No tener Sanciones', monto: 60 },
    { descripcion: 'Constancia estar Activo y Habilitado', monto: 65 },
    { descripcion: 'Constancia de Antigüedad', monto: 75 },
    { descripcion: 'Constancia de Incorporación', monto: 80 },
    { descripcion: 'Otros', monto: 0 },
  ];

  mesesDisponibles = [
    { nombre: 'Enero', valor: 1 },
    { nombre: 'Febrero', valor: 2 },
    { nombre: 'Marzo', valor: 3 },
    { nombre: 'Abril', valor: 4 },
    { nombre: 'Mayo', valor: 5 },
    { nombre: 'Junio', valor: 6 },
    { nombre: 'Julio', valor: 7 },
    { nombre: 'Agosto', valor: 8 },
    { nombre: 'Septiembre', valor: 9 },
    { nombre: 'Octubre', valor: 10 },
    { nombre: 'Noviembre', valor: 11 },
    { nombre: 'Diciembre', valor: 12 },
  ];

  actualizarMonto() {
    if (this.conceptoSeleccionado === 'Otros') {
      this.conceptoActual = {
        descripcion: '',
        monto: 0,
        mes: null,
        anio: new Date().getFullYear(),
      };
    } else {
      const seleccionado = this.conceptosPredefinidos.find(
        (c) => c.descripcion === this.conceptoSeleccionado
      );
      if (seleccionado) {
        this.conceptoActual = {
          descripcion: seleccionado.descripcion,
          monto: seleccionado.monto,
          mes: null,
          anio: new Date().getFullYear(),
        };
      }
    }
  }

  ordenPdfUrl: SafeResourceUrl | null = null;
  ultimaOrdenGenerada: {
    id: number;
    rawUrl: string;
    url: SafeResourceUrl;
  } | null = null;

  constructor(
    private ordenService: OrdenCobranzaService,
    private agremiadoService: AgremiadoService,
    private sanitizer: DomSanitizer
  ) {}
  generarOrden() {
    const payload = {
      dni: this.dni || null,
      idAgremiado: this.idAgremiado || null,
      conceptos: this.conceptos.data,
    };

    if (!payload.dni && !payload.idAgremiado) {
      alert('Debe ingresar un DNI o un ID de Agremiado');
      return;
    }

    if (payload.conceptos.length === 0) {
      alert('Debe agregar al menos un concepto');
      return;
    }

    this.ordenService.generarOrden(payload).subscribe({
      next: (resp: any) => {
        alert(resp.mensaje);

        // 1. Generar PDF
        const rawUrl = `http://localhost:6060/api/ordenes/pdf/${resp.idOrden}`;
        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);

        this.ordenPdfUrl = safeUrl;
        this.ultimaOrdenGenerada = {
          id: resp.idOrden,
          rawUrl,
          url: safeUrl,
        };

        // 2. Limpiar formulario
        this.conceptos.data = [];
        this.conceptoActual = {
          descripcion: '',
          monto: 0,
          mes: null,
          anio: new Date().getFullYear(),
        };
        this.dni = '';
        this.idAgremiado = null;

        // 3. Actualizar la tabla de órdenes (¡NUEVO!)
      },
      error: (err) => {
        alert(
          'Error al generar la orden: ' + (err?.error?.message || err.message)
        );
      },
    });
  }

  ngAfterViewInit() {
  }

  verPDF() {
    if (this.ultimaOrdenGenerada) {
      window.open(this.ultimaOrdenGenerada.rawUrl, '_blank');
    }
  }

  imprimirPDF() {
    if (this.ultimaOrdenGenerada) {
      const win = window.open(this.ultimaOrdenGenerada.rawUrl, '_blank');
      win?.addEventListener('load', () => {
        win.print();
      });
    }
  }

  getTotal(): number {
    return this.conceptos.data.reduce((acc, c) => acc + c.monto, 0);
  }
  agregarConcepto() {
    if (this.conceptoActual.descripcion && this.conceptoActual.monto > 0) {
      // Validación solo para Mensualidad
      if (this.conceptoSeleccionado === 'Mensualidad') {
        if (!this.conceptoActual.mes || !this.conceptoActual.anio) {
          alert('Debe seleccionar un mes y un año para la mensualidad');
          return;
        }

        // Verificar si ya existe esta mensualidad (mes/año)
        const yaExiste = this.conceptos.data.some(
          (c) =>
            c.descripcion === 'Mensualidad' &&
            c.mes === this.conceptoActual.mes &&
            c.anio === this.conceptoActual.anio
        );

        if (yaExiste) {
          alert('Ya existe una mensualidad para este mes y año');
          return;
        }
      }

      // Agregar el concepto
      const nuevosConceptos = [...this.conceptos.data];
      nuevosConceptos.push({
        descripcion: this.conceptoActual.descripcion,
        monto: this.conceptoActual.monto,
        mes: this.conceptoActual.mes ?? null, // Si no es Mensualidad, será null
        anio: this.conceptoActual.anio ?? null,
      });
      this.conceptos.data = nuevosConceptos;

      // Resetear el formulario
      this.conceptoActual = {
        descripcion: '',
        monto: 0,
        mes: null,
        anio: new Date().getFullYear(),
      };
      this.conceptoSeleccionado = '';
    }
  }
  // Modifica eliminarConcepto():
  eliminarConcepto(index: number) {
    const nuevosConceptos = [...this.conceptos.data];
    nuevosConceptos.splice(index, 1);
    this.conceptos.data = nuevosConceptos;
  }

  verOrdenPDF(idOrden: number) {
    const url = `${environment.HOST}/api/ordenes/pdf/${idOrden}`;
    window.open(url, '_blank', 'width=900,height=700'); // Ventana nueva con tamaño definido
  }
  marcarComoPagado(orden: any): void {
    if (
      confirm(`¿Estás seguro de marcar como PAGADO la orden #${orden.idOrden}?`)
    ) {
      this.ordenService.marcarComoPagadoConDetalles(orden).subscribe({
        next: (res) => {
          console.log('✅ Respuesta del backend:', res);
          orden.estado = 'Pagado';
          alert('Orden marcada como pagada exitosamente.');
        },
        error: (err) => {
          console.error('❌ Error en la petición:', err);
          alert('Error al marcar como pagado: ' + (err.error || err.message));
        },
      });
    }
  }

  marcarComoCancelado(orden: any): void {
    if (confirm(`¿Estás seguro de CANCELAR la orden #${orden.idOrden}?`)) {
      this.ordenService.marcarComoCancelado(orden.idOrden).subscribe({
        next: () => {
          orden.estado = 'Cancelado';
          alert('Orden cancelada exitosamente.');
        },
        error: (err) => {
          console.error(err);
          alert('Error al cancelar la orden.');
        },
      });
    }
  }
  buscarAgremiado() {
    if (this.modoBusqueda === 'dni' && this.dni.length >= 6) {
      this.agremiadoService.getPorDni(this.dni).subscribe({
        next: (data) => (this.agremiadoSeleccionado = data),
        error: () => (this.agremiadoSeleccionado = null),
      });
    } else if (
      this.modoBusqueda === 'id' &&
      this.idAgremiado !== null &&
      this.idAgremiado.length > 0
    ) {
      this.agremiadoService.getPorId(this.idAgremiado).subscribe({
        next: (data) => (this.agremiadoSeleccionado = data),
        error: () => (this.agremiadoSeleccionado = null),
      });
    }
  }
}
