import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProspectionService {

  public prospection: any;
  public edit = false;
  public completed = false;
  public transformation = false;
  public type = "";
  public uuid: string = ''
  public status = "ACHAT"
  
  private urlBase = environment.publicUrl;
  private namespace = "agency/prospect";
  private url = 'private/agency/prospect';
  private urlInvoice = "invoice";


  constructor(private api: ApiService,
    public http: HttpClient) {
  }

  setProspection(prospection: any): void {
    this.prospection = prospection;
  }
  getProspection(): any {
    return this.prospection;
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
  convertir(data: any): Observable<any> {
    return this.api._post(`${this.url}/convertir`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  assigner(data: any): Observable<any> {
    return this.api._post(`${this.url}/assigner`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  migrer(data: any): Observable<any> {
    return this.api._post(`${this.url}/migrer`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  abonner(data: any): Observable<any> {
    return this.api._post(`${this.url}/abonner`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  archiver(data: any): Observable<any> {
    return this.api._post(`${this.url}/archiver`, data).pipe(
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
  getList(offre: string = null, etat: string = null, agent: string = null, all: string = null, archiver: string = "NON"): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      all: all,
      etat: etat,
      offre: offre,
      agent: agent,
      archiver: archiver
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

    return this.api._get(`${this.url}/show`, { uuid: uuid }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getPrinter(type: string, agencyKey: string, userKey: string, data: any, uuid?: string): void {
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
        url += '/PROSPECT/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
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
      url += '/LOCATAIRE/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
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

  // getInvoices(user ?: string, agency?:string , etat?: string, type ?: string,reference?: string): Observable<any> {
  //   return this.api._getInvoice(`invoice`, {
  //     user: user,
  //     etat: etat,
  //     type: type,
  //     agency: agency
  //   }).pipe(
  //     map((response: any) => response),
  //     catchError((error: any) => throwError(error))
  //   );
  // }
}
