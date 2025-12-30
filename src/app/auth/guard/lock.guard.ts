import { Injectable } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LockGuard implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
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
