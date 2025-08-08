import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CursoReport } from '../../models/Curso';
import { CursoService } from '../../service/curso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink, CommonModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class CursoComponent implements OnInit {
  columnsDefinitions = [
    { def: 'idCurso', label: 'ID', hide: false },
    { def: 'nombre', label: 'Nombre', hide: false },
    { def: 'descripcion', label: 'Descripcion', hide: false },
    { def: 'fechaInicio', label: 'Fecha inicio', hide: false },
    { def: 'fechaFin', label: 'Fecha fin', hide: false },
    { def: 'modalidad', label: 'Modalidad', hide: false },
    { def: 'docente', label: 'Docente', hide: false },

    { def: 'estado', label: 'Estado', hide: false },
    { def: 'trabajador', label: 'Trabajador', hide: false },
    { def: 'acciones', label: 'acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalElements: number = 0;
  dataSource!: MatTableDataSource<CursoReport>;
  constructor(
    private cursoService: CursoService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cursoService.listPageable(0, 2).subscribe((data) => {
      this.cursoService.setCursosSubject(data);
    });

    this.cursoService.getCursosSubject().subscribe((data) => {
      this.createTable(data);
    });
  }
  createTable(data: any) {
    this.totalElements = data.totalElements;
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.sort = this.sort;
  }
  showMore(e: any) {
    this.cursoService
      .listPageable(e.pageIndex, e.pageSize)
      .subscribe((data) => this.createTable(data));
  }
  eliminar(id: number) {
    if (confirm('Desea eliminar?')) {
      this.cursoService
        .delete(id)
        .pipe(switchMap(() => this.cursoService.listPageable(0, 2)))
        .subscribe((data) => {
          this.cursoService.setCursosSubject(data);
          this.toastMsg('Se ha elimidado correctamente!');
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
}
