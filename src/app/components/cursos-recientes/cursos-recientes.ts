import { Component, OnInit } from '@angular/core';
import { CursoService } from '../../service/curso.service';
import { Curso, CursoReport } from '../../models/Curso';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cursos-recientes',
  imports: [MatCardModule,CommonModule,MatIconModule],
  templateUrl: './cursos-recientes.html',
  styleUrl: './cursos-recientes.css'
})
export class CursosRecientesComponent implements OnInit {
  cursos: Curso[] = [];

  constructor(private cursoService: CursoService) {}

  ngOnInit(): void {
    this.cursoService.listAll().subscribe((data) => {
      this.cursos = data;
    });
  }
}
