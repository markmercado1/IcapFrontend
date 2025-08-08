import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { AuthService } from '../../service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user!: string;
  clave!: string;
  constructor(
  private authService: AuthService,
  private router: Router
  ){ }

login() {
  this.authService.login(this.user, this.clave).subscribe(data => {
    if (data?.token) {
      sessionStorage.setItem(environment.TOKEN_NAME, data.token);
      sessionStorage.setItem(environment.DATA_USERLOGIN, data.idUsuario.toString());
      this.router.navigate(['/pages/dashboard']);
    } else {
    
      console.error('Token no recibido');
    }
  }, err => {
    console.error('Error de autenticación', err);
  });
}


}
