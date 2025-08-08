import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventoReport } from '../../models/Evento';
import { EventoService } from '../../service/evento.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-gestio-eventos',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './gestio-eventos.html',
  styleUrl: './gestio-eventos.css',
})
export class GestionEventoComponent implements OnInit {
  columnsDefinitions = [
    { def: 'idEvento', label: 'ID', hide: false },
    { def: 'eestado', label: 'Estado', hide: false },
    { def: 'eimagen', label: 'Imagen', hide: false },
    { def: 'etitulo', label: 'Titulo', hide: false },
    { def: 'efechaFin', label: 'Fecha fin ', hide: false },
    { def: 'efechaCreacion', label: 'Fecha creacion', hide: false },
    { def: 'edocumento', label: 'documento', hide: false },
    { def: 'efechaInicio', label: 'Fecha inicio', hide: false },
    { def: 'edescripcion', label: 'Descripcion', hide: false },
    { def: 'trabajador', label: 'Trabajador', hide: false },
    { def: 'acciones', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalElements: number = 0;
  dataSource!: MatTableDataSource<EventoReport>;
  currentPageSize: number = 5; // valor por defecto

  constructor(
    private eventoService: EventoService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.eventoService.listPageable(0, 50).subscribe((data) => {
      this.eventoService.setEventoSubject(data);
    });
    this.eventoService.getEventoSubject().subscribe((data) => {
      this.createTable(data);
    });
  }
  createTable(data: any) {
    this.totalElements = data.totalElements;
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.sort = this.sort;
  }
showMore(e: any) {
  this.currentPageSize = e.pageSize;
  this.eventoService
    .listPageable(e.pageIndex, e.pageSize)
    .subscribe((data) => this.createTable(data));
}

eliminar(id: number) {
  if (confirm('Desea eliminar?')) {
    this.eventoService
      .delete(id)
      .pipe(switchMap(() => this.eventoService.listPageable(0, this.currentPageSize)))
      .subscribe((data) => {
        this.eventoService.setEventoSubject(data);
        this.toastMsg('Se ha eliminado correctamente!');
      });
  }
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }
  toastMsg(msg: string): void {
    this._snackBar.open(msg, 'INFO', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
  descargarDocumento(base64Data: string) {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const blob = new Blob([byteArray], { type: 'application/pdf' }); // Cambia si es .doc o .docx
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'documento.pdf'; // Puedes cambiar esto si en el futuro incluyes nombre de archivo desde el backend
  a.click();
  window.URL.revokeObjectURL(url);
}
verDocumento(base64: string) {
  
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });

  // Crear una URL temporal
  const blobUrl = URL.createObjectURL(blob);

  // Abrir en nueva pestaña
  window.open(blobUrl, '_blank');
}

}
