import { Component } from '@angular/core';
import { MesPago } from '../../models/MesPago';
import { PagoService } from '../../service/pago.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-consulta-pagos',
  standalone: true,

  imports: [CommonModule, FormsModule, HttpClientModule,  // ...
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule], // <-- AQUI IMPORTAS TODO LO NECESARIO
  templateUrl: './consulta-pagos.html',
  styleUrl: './consulta-pagos.css',
})
export class ConsultaPagosComponent {
  idAgremiado: number = 0;
  meses: MesPago[] = [];
  buscando = false;

  constructor(private pagosService: PagoService) {}

  buscarPagos() {
    this.buscando = true;
    this.pagosService.obtenerPagos(this.idAgremiado).subscribe({
      next: (data) => {
        this.meses = data;
        this.buscando = false;
      },
      error: (err) => {
        console.error(err);
        this.buscando = false;
      },
    });
  }

  nombreMes(m: number): string {
    return new Date(0, m - 1).toLocaleString('default', { month: 'long' });
  }
}
