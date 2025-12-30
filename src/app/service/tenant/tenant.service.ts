import { ApiService } from '@theme/utils/api.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Tenant } from '@model/tenant';
import { environment } from '@env/environment';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  public tenant: Tenant;
  public edit = false;
  public type = "";
  public uuid: string = ''
  private urlBase = environment.publicUrl;
  private namespace = "agency/tenant";
  private url = 'private/agency/tenant';


  constructor(private api: ApiService,
    public http: HttpClient) {
  }

  setTenant(tenant: Tenant): void {
    this.tenant = tenant;
  }
  getTenant(): Tenant {
    return this.tenant;
  }
  add(data: Tenant): Observable<any> {
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
  create(data: Tenant): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  update(data: Tenant): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  convertir(data: any): Observable<any> {
    return this.api._post(`${this.url}/convertir`, data).pipe(
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
  getList(ownerUuid: string = null, all: string = null, type: string = null): Observable<Tenant[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      ownerUuid: ownerUuid,
      all: all,
      type: type
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getSingle(uuid: string): Observable<Tenant> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/show`, { uuid: uuid }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
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
        url += '/LOCATAIRE/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
      }
    }
    if (type === 'SHOW') {
      url = (data) ? url + '/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }
  getReport(agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var type = '';
    if (data?.type === 'COMPTE') {
      type = 'compte';
    } else if (data?.type === 'LOYER') {
      type = 'loyer';
    } else if (data?.type === 'CONTRAT') {
      type = 'contrat';
    } else if (data?.type === 'PAIEMENT') {
      type = 'paiement';
    } else if (data?.type === 'CONTRAT-TERME') {
      type = 'contract-terme';
    }
    let url = 'report/agency/tenant/' + type + '/' + agencyKey + '/' + userKey;
    if (data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if (k !== 'uuid') {
            url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
          }
        }
      }
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }
  getExport(agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = 'export/tenant/' + agencyKey + '/' + userKey;
    if (data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if (k !== 'uuid') {
            url += '/' + data[k];
          }
        }
      }
    } else {
      url += '/LOCATAIRE/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
    }
    window.open(`${this.urlBase}/${url}`);
  }
  getGenerer() {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var url = this.urlBase + '/import/agency/model/tenant'
    window.open(`${url}`);
  }
  import(data) {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var url = 'private/import/agency'
    return this.api._post(`${url}/tenant`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getDelete(uuid: string): Observable<Tenant> {
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
}
