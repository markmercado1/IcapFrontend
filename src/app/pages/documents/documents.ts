import { Component } from '@angular/core';
import { DocumentoService } from '../../service/documento.service';
import { MaterialModule } from '../../material/material.module';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.html',
  styleUrls: ['./documents.css'],
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule],
   // ← corregido aquí
})
export class SubidaDocumentoComponent {
  archivoSeleccionado: File | null = null;
  resultado: string = '';
  cargando: boolean = false;

  constructor(private documentoService: DocumentoService) {}

  onFileChange(event: any) {
    this.archivoSeleccionado = event.target.files[0];
  }

  subir() {
    if (!this.archivoSeleccionado) return;

    this.cargando = true;
    this.documentoService.subirDocumento(this.archivoSeleccionado).subscribe({
      next: (res) => {
        this.resultado = res.resultadoValidacion || 'Validación completada';
        this.cargando = false;
      },
      error: (err) => {
        this.resultado = 'Error al validar documento';
        console.error(err);
        this.cargando = false;
      }
    });
  }
}
