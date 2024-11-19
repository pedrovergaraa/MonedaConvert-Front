import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const userNotLoggedGuard: CanActivateFn = async (route, state) => {

  const auth = inject(AuthService);

    if(auth.token()){
    const router = inject(Router);
    router.navigate(['/converter']);
    return false;
  }
  return true;
};