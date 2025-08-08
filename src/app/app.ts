import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NoticiasComponent } from './components/noticias/noticias';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule], // 👈 agrégalo aquí
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected title = 'icap';
}
