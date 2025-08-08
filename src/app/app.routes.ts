import { LoginComponent } from './pages/login/login.component';
import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { Not404Component } from './pages/not404/not404.component';
import { Home } from './pages/home/home';
import { certGuard } from './guard/cert.guard';
import { CursosRecientesComponent } from './components/cursos-recientes/cursos-recientes';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  { path: 'home',component: Home },
    { path: 'login',component: LoginComponent },

  { path: 'cursos', component: CursosRecientesComponent },
  
  { path: 'main', component: LayoutComponent,canActivate:[certGuard] },
  {
    path: 'pages',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/pages.routes').then((x) => x.pagesRoutes),
  },
  {path:'**',component:Not404Component},
];
