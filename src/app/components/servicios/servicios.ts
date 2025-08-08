import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class ServiciosComponent {
  servicios = [
    {
      icono: 'gavel',
      titulo: 'Asesoría Legal',
      descripcion: 'Consultas gratuitas para nuestros agremiados.',
    },
    {
      icono: 'school',
      titulo: 'Capacitación',
      descripcion: 'Cursos y diplomados para el desarrollo profesional.',
    },
    {
      icono: 'badge',
      titulo: 'Trámite de Colegiatura',
      descripcion: 'Proceso ágil y moderno de incorporación.',
    },
  ];
}