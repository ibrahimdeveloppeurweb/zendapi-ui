import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '@theme/utils/api.service';
import { environment } from '@env/environment';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';


@Injectable({
  providedIn: 'root'
})
export class LocalisationService {
  localisation: any;
  public edit: boolean = false;
  public type: string = "";
  public treasury: string = '';
  private urlBase = environment.publicUrl;
  private namespace = "agency/localisation";
  private url = "private/agency/localisation";

  constructor(private api: ApiService) { }

  setLocalisation(localisation: any) {
    this.localisation = localisation
  }

  getLocalisation(): any {
    return this.localisation
  }

  add(data: any): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    if (data.uuid) {
      return this.update(data);
    } else {
      return this.create(data);
    }
  }

  create(data: any): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  validate(data: any): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/${data.uuid}/validate`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: any): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(treasury ?: string, dateD ?: string, dateF ?: string, status ?: string, owner?: string, house?: string): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      treasury: treasury,
      dateD: dateD,
      dateF: dateF,
      status: status,
      owner: owner,
      house: house
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/show`, {uuid: uuid}).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getDelete(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._delete(`${this.url}/${uuid}/delete`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }


  getPrinter(type: string, agencyKey: string, userKey: string, data: any, treasuryKey: string): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = 'printer/' + this.namespace;
    if(type === 'LISTE') {
      url +=  '/' + agencyKey + '/' + treasuryKey + '/' + userKey;
      if(data && data !== undefined) {
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            if(k !== 'uuid') {
              url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
            }
          }
        }
      } else {
        url += '/DEPENSE/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null';
      }
    }
    if(type === 'SHOW') {
      url = (data) ? url + '/' + agencyKey + '/' + userKey + '/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }
  getGenerer(type='ONE', entity='LOTISSEMENT'){
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var url = this.urlBase +  '/import/agency/model/localisation/?type=' + type + '&entity=' + entity
    window.open(`${url}`);
  }
  import(data){
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var url = 'private/import/agency'
    return this.api._post(`${url}/localisation`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getExport(agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = 'export/localisation/' + agencyKey + '/' + userKey;
    if(data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if(k !== 'uuid') {
            url += '/' + data[k];
          }
        }
      }
    } else {
      url += '/DEPENSE/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null';
    }
    window.open(`${this.urlBase}/${url}`);
  }
}
