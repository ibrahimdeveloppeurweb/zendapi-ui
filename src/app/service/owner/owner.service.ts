import {ApiService} from '@theme/utils/api.service';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Owner} from '@model/owner';
import {Injectable} from '@angular/core';
import { environment } from '@env/environment';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
@Injectable({
  providedIn: 'root'
})
export class OwnerService {
  owner: Owner;
  public edit: boolean = false;
  public type: string = "";
  public uuid: string = ''
  public typeSyndic: string = "";
  public uuidSyndic: string = "";
  public return: string = ""
  private urlBase = environment.publicUrl;
  private namespace = "agency/owner";
  private url = "private/agency/owner";

  constructor(private api: ApiService) {
  }

  setOwner(owner: Owner) {
    this.owner = owner;
  }
  getOwner(): Owner {
    return this.owner;
  }
  add(data: Owner): Observable<any> {
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
  create(data: Owner): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  update(data: Owner): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
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
  getList(all: string = null, syndic: string = null, isCoOwner: boolean = false): Observable<Owner[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      all: all,
      syndic: syndic,
      isCoOwner: isCoOwner,
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getSingle(uuid: string): Observable<Owner> {
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
  getPrinter(type: string, agencyKey: string, userKey: string, data: any, syndicUuid?: string, uuid?: string): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }
    let url = 'printer/' + this.namespace + '/' + agencyKey + '/' + userKey;

    if(type === 'LISTE') {
      if(data && data !== undefined) {
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            if(k !== 'uuid') {
              url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
            }
          }
        }
      } else {
        url += '/PROPRIETAIRE/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
      }
    }
    if(type === 'SHOW') {
      url += '/' + uuid;
      url = (data) ? url +'/' + data : url;
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
    if(data?.type === 'COMPTE') {
      type = 'compte';
    } else if(data?.type === 'RECOUVREMENT') {
      type = 'recouvrement';
    } else if(data?.type === 'PAIEMENT') {
      type = 'paiement';
    } else if(data?.type === 'REVERSEMENT') {
      type = 'reversement';
    } else if(data?.type === 'COMMISSION') {
      type = 'commission';
    } else if(data?.type === 'SITUATION_BIEN') {
      type = 'bien';
    }
    let url = 'report/agency/owner/' + type + '/' + agencyKey + '/' + userKey;
    if(data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if(k !== 'uuid') {
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

    let url = 'export/owner/' + agencyKey + '/' + userKey;
    if(data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if(k !== 'uuid') {
            url += '/' + data[k];
          }
        }
      }
    } else {
      url += '/PROPRIETAIRE/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
    }
    window.open(`${this.urlBase}/${url}`);
  }
  getGenerer(){
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var url = this.urlBase + '/import/agency/model/owner'
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
    return this.api._post(`${url}/owner`, data).pipe(
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

  getAccountStatements(data): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next(),
        obs.complete()
      });
    }

    return this.api._get(`${this.url}/account/statements`, {
      ownerUuid: data.owner,
      dateD: data.dateD,
      dateF: data.dateF
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getCommittees(data): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next(),
        obs.complete()
      });
    }

    return this.api._get(`${this.url}/committees`, {
      type: data.type,
      ownerUuid: data.owner,
      houseUuid: data.house,
      dateD: data.dateD,
      dateF: data.dateF,
      agency: data.agency
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
