import { Component } from '@angular/core';
import { OrdenCobranzaService } from '../../service/ordenCobranza.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-lista-ordenes',
  imports: [MaterialModule,
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
  FormsModule],
  templateUrl: './lista-ordenes.html',
  styleUrl: './lista-ordenes.css'
})
export class ListaOrdenes {
 displayedColumns: string[] = ['id', 'agremiado', 'fecha', 'total', 'estado'];
  ordenes: any[] = [];

  constructor(private ordenService: OrdenCobranzaService) {}

  ngOnInit(): void {
    this.ordenService.getOrdenes().subscribe({
      next: (data) => this.ordenes = data,
      error: (err) => console.error('Error al obtener órdenes', err)
    });
  }
}
