import { ApiService } from '@theme/utils/api.service';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Ressource } from '@model/ressource';
import { Injectable } from '@angular/core';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class RessourceTiersService {
  ressource: Ressource;
  public edit: boolean = false;
  public type: string = '';
  public uuid: string = '';
  private url = "private/agency/ressource/tiers";

  constructor(private api: ApiService) { }

  setRessource(ressource: Ressource) {
    this.ressource = ressource
  }

  getRessource(): Ressource {
    return this.ressource
  }

  add(data: Ressource): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    if (this.edit) {
      return this.update(data);
    } else {
      return this.create(data);
    }
  }

  create(data: Ressource): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  assign(data: Ressource): Observable<any> {
    return this.api._post(`${this.url}/assign`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: Ressource): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(rental=null): Observable<Ressource[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      rental: rental
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getSingle(uuid: string): Observable<Ressource> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/show`, {uuid: uuid}).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }
  getHistorique(uuid: string,hors ?: string,): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/historique`, 
      {uuid: uuid,
      hors: hors,
      }
    ).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  hs(data: Ressource): Observable<any> {
    return this.api._post(`${this.url}/hs`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  utilisation(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/${uuid}/utilisation`, uuid).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  activation(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/${uuid}/activation`, uuid).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getDelete(id: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._delete(`${this.url}/${id}/delete`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
