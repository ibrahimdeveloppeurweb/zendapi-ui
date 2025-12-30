
import {ApiService} from '@theme/utils/api.service';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
// import {Owner} from '@model/owner';
import {Injectable} from '@angular/core';
import { environment } from '@env/environment';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { HouseCo } from '../../model/syndic/house-co';
@Injectable({
  providedIn: 'root'
})
export class HouseCoService {
  houseCo: HouseCo;
  public edit: boolean = false;
  public type: string = "";
  public typeSyndic: string = "";
  public uuidSyndic: string = "";
  public return: string = ""
  private urlBase = environment.publicUrl;
  private namespace = "trustee/houseco";
  private url = "private/trustee/houseco";

  constructor(private api: ApiService) {
  }

  setHouseCo(houseCo: HouseCo) {
    this.houseCo = houseCo;
  }
  getHouseCo(): HouseCo {
    return this.houseCo;
  }
  add(data: HouseCo): Observable<any> {
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
  create(data: HouseCo): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  update(data: HouseCo): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getList(syndic?: string): Observable<HouseCo[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      syndic: syndic
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<HouseCo> {
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
  getPrinter(type: string, agencyKey: string, userKey: string, data: any, syndicUuid?: string, uuid?: string, doc?: string): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }
    let url = 'printer/' + this.namespace + '/' + agencyKey + '/' + userKey;
    if(type === 'LISTE') {
      url += '/' + syndicUuid;
      if(data && data !== undefined) {
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            if(k !== 'uuid'&& k !== 'trustee' && k !== 'syndic') {
              url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
              console.log('alors',k, url)
            }
          }
        }
      } else {
        url += '/PROPRIETAIRE/null/null/null/null/null/null/null/DESC/null/null/null/null/0/null'
      }
    }

    if(type === 'SHOW') {
      url += '/' + uuid;
      url = (data) ? url +'/' + data : url;
    }
    if(doc === 'SITUATION') {
      url = url + '/SITUATION'
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
      url += '/PROPRIETAIRE/null/null/null/null/null/null/null/DESC/null/null/null/null/0/null'
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
  getDelete(uuid: string, uuidSituation? :string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    if(uuidSituation) {
      return this.api._delete(`${this.url}/${uuid}/financement/delete`).pipe(
        map((response: any) => response),
        catchError((error: any) => throwError(error))
      );
    }   else {
      return this.api._delete(`${this.url}/${uuid}/delete`).pipe(
        map((response: any) => response),
        catchError((error: any) => throwError(error))
      );
    }
  }
}

