import { Injectable } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoggedGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //On verifie si la session a ete verrouillee
    if(this.auth.getDataLock()) {
      this.router.navigate(['/auth/lock/session']);
      return false;
    }
    //on verifie s'il un utilisateur connecté
    if (!this.auth.getDataToken()) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    const redirectUrl = route.queryParams.returnUrl || '/';
    this.router.navigate([redirectUrl]);
    return false;
  }
}
