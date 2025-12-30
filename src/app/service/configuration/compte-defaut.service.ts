import { Injectable } from '@angular/core';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompteDefautService {

  compteDefaut: any;
  public type: string = "";
  private url: string = "private/accounting/default/account";
  public edit: boolean = false;

  constructor(private api: ApiService) {
  }

  setCompteDefaut(compteDefaut: any) {
    this.compteDefaut = compteDefaut;
  }

  getCompteDefaut(): any {
    return this.compteDefaut;
  }

  add(data: any): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    // if (data.uuid) {
      // console.log('uuid')
      return this.update(data);
    // } else {
      // console.log('non')
    //   return this.create(data);
    // }
  }

  create(data: any): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: any): Observable<any> {
    return this.api._post(`${this.url}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(agency ?: string): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}`, {
      agency: agency
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next(),
        obs.complete()
      });
    }

    return this.api._get(`${this.url}/${uuid}/show`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    )
  }

  getDelete(id: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next(),
        obs.complete()
      });
    }

    return this.api._delete(`${this.url}/${id}/delete`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
