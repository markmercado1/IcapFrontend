import { Component, OnInit } from '@angular/core';
import { AccesoService } from '../../service/acceso.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,MatCardModule,MatIconModule,RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  username: string="Bienvenido";
  constructor(private accesoService: AccesoService){}
  ngOnInit(): void {
  console.log("Llega aqui:"+this.username);
  const helper = new JwtHelperService();
  const token = sessionStorage.getItem(environment.TOKEN_NAME);

  if (typeof token === "string") {
  const decodedToken = helper.decodeToken(token);
  this.username = decodedToken.sub;
  }
    this.accesoService.getAccesosByUser(this.username).subscribe(data => this.accesoService.setAccesosChange(data));
  
  }
 }

