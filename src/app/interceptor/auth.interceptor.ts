import { HttpInterceptorFn } from '@angular/common/http';
import {environment} from '../../environments/environment.development';


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem(environment.TOKEN_NAME);

  // ⚠️ Si el body es FormData, no agregar Content-Type manualmente
  if (token && !(req.body instanceof FormData)) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return next(cloned);
  }

  // Solo añade Authorization si hay token, y deja Content-Type intacto si es FormData
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(cloned);
  }

  return next(req);
};
