import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RapportGuard implements CanActivate {
  autorisation: any = Globals.autorisation;

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree 
  {
    var etat = false
    if (
      state.url === '/admin/rapport/proprietaire' ||
      state.url === '/admin/rapport/locataire' || 
      state.url === '/admin/rapport/client' && 
      this.autorisation?.DOSSIER
    ) {
      etat = true;
    } else {
      const redirectUrl = route.queryParams.returnUrl || '/admin/dashboard/principal';
      this.router.navigate([redirectUrl]);
      etat = false;
    }
    return etat;
  }  
}
