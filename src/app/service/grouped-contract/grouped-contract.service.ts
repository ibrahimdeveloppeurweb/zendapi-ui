import { ApiService } from '@theme/utils/api.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class GroupedContractService {
  contract: any;
  public edit: boolean = false;
  public validated: boolean = false;
  private urlBase = environment.publicUrl;
  private namespace = "agency/grouped-contract";
  private url = 'private/agency/grouped-contract';

  constructor(private api: ApiService) {
  }

  setContract(contract?: any) {
    this.contract = contract;
  }

  getContract(): any {
    return this.contract;
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

  update(data: any): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  genererRent(data: any): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/${data.uuid}/generer/loyer`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  activate(data: any): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    return this.api._post(`${this.url}/activate`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );

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
    return this.api._post(`${url}/grouped-contract`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getDash(data): Observable<any> {
    return this.api._post(`${this.url}/dash/viewer`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  signed(data): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/signed`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(tenantUuid?: string, etat?: string, all: string = null): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      tenantUuid: tenantUuid,
      etat: etat,
      all: all
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingl(uuid: string): Observable<any> {
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

  getSingle(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/get/single`, { uuid: uuid }).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

  getGenerer(){
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var url = this.urlBase + '/import/agency/model/grouped-contract'
    window.open(`${url}`);
  }

  getPrinter(type: string, agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = 'printer/' + this.namespace + '/' + agencyKey + '/' + userKey;
    if (type === 'LISTE') {
      if (data && data !== undefined) {
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            if (k !== 'uuid') {
              url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
            }
          }
        }
      } else {
        url += '/GROUPED-CONTRAT/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
      }
    }
    if (type === 'SHOW') {
      url = (data) ? url + '/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }

  getExport(agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = 'export/grouped-contract/' + agencyKey + '/' + userKey;
    if (data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if (k !== 'uuid') {
            url += '/' + data[k];
          }
        }
      }
    } else {
      url += '/GROUPED-CONTRAT/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
    }
    window.open(`${this.urlBase}/${url}`);
  }

  getDelete(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    /* return this.api._delete(`${this.url}/${uuid}/delete`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    ); */
    return this.api._post(`${this.url}/${uuid}/delete`, []).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
