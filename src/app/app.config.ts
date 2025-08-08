import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi} from '@angular/common/http';
import { environment } from '../environments/environment.development';
import { authInterceptor } from './interceptor/auth.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { ServeErrorsInterceptor } from './interceptor/server-error.interceptor';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);


export function tokenGetter(){
  return sessionStorage.getItem(environment.TOKEN_NAME);
}
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es' } ,// <-- esto activa el idioma español globalmente

    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi(),withInterceptors([authInterceptor])),
    //importProvidersFrom(
      //JwtModule.forRoot(
       // {
         /* config:{
            tokenGetter:tokenGetter,
            allowedDomains:["localhost:6060"],
            disallowedRoutes:["https://localhost:6060/login/forget"]
          },
        }
      )
    ),*/
    {provide:HTTP_INTERCEPTORS,
      useClass:ServeErrorsInterceptor,
      multi:true,
    }
  ]
};

