import { Component } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { CarouselEventosComponent } from '../../components/evento-carrusel/evento-carrusel';
import { MatIconModule } from '@angular/material/icon';
import { NoticiasComponent } from '../../components/noticias/noticias';
import { ServiciosComponent } from '../../components/servicios/servicios';
import { FooterComponent } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Navbar,CarouselEventosComponent,MatIconModule,NoticiasComponent,ServiciosComponent,FooterComponent ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
