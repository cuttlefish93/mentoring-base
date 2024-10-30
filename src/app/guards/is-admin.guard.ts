import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user.service';
import { map } from 'rxjs';

export const isAdminGuardFn: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.userSubject.pipe(
    map((user) => {
      if (user.isAdmin) {
        return true;
      } else {
        router.navigate(['']);
        return false;
      }
    })
  );
};