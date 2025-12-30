import { ApiService } from '@theme/utils/api.service';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { SousFamille } from '@model/sous-famille';
import { Injectable } from '@angular/core';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class SousFamilleService {
  sousFamille: SousFamille;
  public edit: boolean = false;
  public type: string = '';
  private url = "private/agency/sous/famille";

  constructor(private api: ApiService) { }


  setSousFamille(sousFamille: SousFamille) {
    this.sousFamille = sousFamille
  }

  getSousFamille(): SousFamille {
    return this.sousFamille
  }

  add(data: SousFamille): Observable<any> {
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

  create(data: SousFamille): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: SousFamille): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(famille=null): Observable<SousFamille[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      famille: famille
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getSingle(uuid: string): Observable<SousFamille> {
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
