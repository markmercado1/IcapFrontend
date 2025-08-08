import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainAgremiadoComponent } from './agremiado-main/agremiado-main';
import { EventoEditComponent } from './eventoo-main/eventoo-main';
import { GestionAgremiadoComponent } from './gestion-agremiado/gestion-agremiado';
import { FormxAgremiado } from './gestion-agremiado/formx-agremiado/formx-agremiado';
import { CursoComponent } from './courses/courses';
import { FormxCourses } from './courses/formx-courses/formx-courses';
import { GestionEventoComponent } from './gestio-eventos/gestio-eventos';
import { FormEventos } from './gestio-eventos/form-eventos/form-eventos';
import { SubidaDocumentoComponent } from './documents/documents';
import { GenerarOrdenComponent } from './generar-orden/generar-orden';
import { ListaOrdenes } from './lista-ordenes/lista-ordenes';
import { Not403Component } from './not403/not403.component';
import { Home } from './home/home';
import { CursosRecientesComponent } from '../components/cursos-recientes/cursos-recientes';
import { AboutUsMain } from './about-us-main/about-us-main';
import { ConsultaPagosComponent } from './consulta-pagos/consulta-pagos';
import { certGuard } from '../guard/cert.guard';

export const pagesRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent, },

    { path: 'sobre-nosotros', component: AboutUsMain
 },


  { path: 'agremiados', component: MainAgremiadoComponent },
  { path: 'evento', component: EventoEditComponent },
  {
    path: 'gsagremiados',
    component: GestionAgremiadoComponent,canActivate:[certGuard],
    children: [
      { path: 'new', component: FormxAgremiado },
      { path: 'edit/:id', component: FormxAgremiado },
    ],
  },
  {
    path: 'gscursos',canActivate:[certGuard],
    component: CursoComponent,
    children: [
      { path: 'new', component: FormxCourses },
      { path: 'edit/:id', component: FormxCourses },
    ],
  },
  {
    path: 'gseventos',canActivate:[certGuard],
    component: GestionEventoComponent,
    children: [
      { path: 'new', component: FormEventos },
      { path: 'edit/:id', component: FormEventos },
    ],
  },
    {
    path: 'mensualidades',canActivate:[certGuard],
    component: ConsultaPagosComponent,

  },


  { path: 'validar-documento', component: SubidaDocumentoComponent,canActivate:[certGuard], },
  { path: 'generar-orden', component: GenerarOrdenComponent,canActivate:[certGuard], },
  { path: 'listar-orden', component: ListaOrdenes,canActivate:[certGuard], },
  { path: 'not-403', component: Not403Component },
];
