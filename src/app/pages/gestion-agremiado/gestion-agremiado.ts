import { AgremiadoService } from './../../service/agremiado.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AgremiadoReport } from '../../models/Agremiado';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-agremiado',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './gestion-agremiado.html',
  styleUrl: './gestion-agremiado.css',
})
export class GestionAgremiadoComponent implements OnInit {
  columnsDefinitions = [
    { def: 'idAgremiado', label: 'ID', hide: false },
    { def: 'dni', label: 'DNI', hide: false },
    { def: 'genero', label: 'Género', hide: false },
    { def: 'anombres', label: 'Nombres', hide: false },
    { def: 'aapellidoPaterno', label: 'Apellido Paterno', hide: false },
    { def: 'aapellidoMaterno', label: 'Apellido Materno', hide: false },
    { def: 'acelular', label: 'Celular', hide: false },
    { def: 'acorreo', label: 'Correo', hide: false },
    { def: 'aciudad', label: 'Ciudad', hide: false },
    { def: 'afechaNacimiento', label: 'Fecha de Nacimiento', hide: false },
    {
      def: 'afechaIncorporacion',
      label: 'Fecha de Incorporación',
      hide: false,
    },
    { def: 'tipoColegiado', label: 'Tipo de Colegiado', hide: false },
    { def: 'estadoColegiado', label: 'Estado de Colegiado', hide: false },
    { def: 'trabajador', label: 'Trabajador', hide: false },

    { def: 'acciones', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalElements: number = 0;
  dataSource!: MatTableDataSource<AgremiadoReport>;
  constructor(
    private agremiadoService: AgremiadoService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.agremiadoService.listPageable(0, 50).subscribe((data) => {
      this.agremiadoService.setAgremiadosSubject(data);
    });
    this.agremiadoService.getAgremiadosSubject().subscribe((data) => {
      this.createTable(data);
    });
  }
  createTable(data: any) {
    this.totalElements = data.totalElements;
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.sort = this.sort;
  }
  showMore(e: any) {
    this.agremiadoService
      .listPageable(e.pageIndex, e.pageSize)
      .subscribe((data) => this.createTable(data));
  }
  eliminar(id: number) {
    if (confirm('Desea eliminar?')) {
      this.agremiadoService
        .delete(id)
        .pipe(switchMap(() => this.agremiadoService.listPageable(0, 2)))
        .subscribe((data) => {
          this.agremiadoService.setAgremiadosSubject(data);
          this.toastMsg('Se ha elimidado correctamente!');
        });
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (filterValue.length > 0) {
      this.agremiadoService
        .listPageableFiltered(filterValue, 0, 20)
        .subscribe((data) => {
          this.totalElements = data.totalElements;
          this.dataSource = new MatTableDataSource(data.content);
          this.dataSource.sort = this.sort;
        });
    } else {
      this.showMore({ pageIndex: 0, pageSize: 20 });
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
}
