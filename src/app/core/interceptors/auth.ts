import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.currentUser();

  if (user) {
    // Clone request and add authorization header
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer mock-token-${user.id}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
