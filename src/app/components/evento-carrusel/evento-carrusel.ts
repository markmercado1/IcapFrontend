import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../service/evento.service';
import { Evento } from '../../models/Evento';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TruncatePipe } from './turncate.pipe';

@Component({
  selector: 'app-evento-carrusel',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, // para <mat-card> y <mat-card-content>
    MatIconModule, // para <mat-icon>
    MatButtonModule,
    TruncatePipe // para <button mat-icon-button>
  ],
  templateUrl: './evento-carrusel.html',
  styleUrl: './evento-carrusel.css',
})
export class CarouselEventosComponent implements OnInit {
  eventos: Evento[] = [];
  currentIndex: number = 0;

  constructor(private eventoService: EventoService) {}

  ngOnInit(): void {
    this.eventoService.getEventos().subscribe((data) => {
      this.eventos = data;
      this.autoSlide();
    });
  }

  goToIndex(index: number): void {
    this.currentIndex = index;
  }
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.eventos.length;
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.eventos.length) % this.eventos.length;
  }

  autoSlide() {
    setInterval(() => {
      this.next();
    }, 5000); // cambia de evento cada 5 segundos
  }
}
