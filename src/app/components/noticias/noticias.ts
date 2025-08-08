import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
declare const FB: any;

@Component({
  selector: 'app-noticias',
  imports: [CommonModule, MatCardModule],
  templateUrl: './noticias.html',
  styleUrl: './noticias.css',
})

export class NoticiasComponent  implements AfterViewInit{
 isLoaded = false;

  ngOnInit() {
    this.isLoaded = true;
    if (typeof FB !== 'undefined') {
      FB.XFBML.parse();
    }
  }
  constructor(private renderer: Renderer2) {}

 ngAfterViewInit() {
    // Espera un breve momento para asegurar que el DOM está listo
    setTimeout(() => {
       if (typeof FB !== 'undefined') {  // Verificación más segura
        FB.XFBML.parse();
      }
    }, 500);
  }




}
