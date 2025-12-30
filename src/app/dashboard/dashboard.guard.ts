import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Globals } from '@theme/utils/globals';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  autorisation: any = Globals.autorisation;

  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    var etat = false
    //GESTION PATRIMOINE
    if (
      state.url !== '/admin/dashboard/principal' &&
      (state.url === '/admin/dashboard/promotion' || state.url === '/admin/dashboard/lotissement') &&
      this.autorisation?.DOSSIER
    ) {
      etat = true;
    } else if (
      state.url !== '/admin/dashboard/principal' &&
      (state.url === '/admin/dashboard/promotion' || state.url === '/admin/dashboard/lotissement') &&
      !this.autorisation?.DOSSIER
    ){
      const redirectUrl = route.queryParams.returnUrl || '/admin/dashboard/principal';
      this.router.navigate([redirectUrl]);
      etat = false;
    }

    //GESTION LOCATIVE
    if (
      state.url !== '/admin/dashboard/principal' &&
      (state.url === '/admin/dashboard/locataire' || state.url === '/admin/dashboard/proprietaire') &&
      this.autorisation?.CONTRAT
    ) {
      etat = true;
    } else if (
      state.url !== '/admin/dashboard/principal' &&
      (state.url === '/admin/dashboard/locataire' || state.url === '/admin/dashboard/proprietaire') &&
      !this.autorisation?.CONTRAT
    ){
      const redirectUrl = route.queryParams.returnUrl || '/admin/dashboard/principal';
      this.router.navigate([redirectUrl]);
      etat = false;
    }
    return etat;
  }
}
