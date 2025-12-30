import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HomeCo } from '../../model/syndic/home-co';
import { ApiService } from '../../theme/utils/api.service';
import { NoInternetHelper } from '../../theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class HomeCoService {
  home: HomeCo;
  public edit: boolean = false;
  public type: string = "";
  private urlBase = environment.publicUrl;
  private namespace = "trustee/homeco";
  private url = "private/trustee/homeco";

  constructor(private api: ApiService) { }

  setHome(home: HomeCo) {
    this.home = home
  }

  getHome(): HomeCo {
    return this.home
  }

  add(data: HomeCo): Observable<any> {
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

  create(data: HomeCo): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  milliemes(data: HomeCo): Observable<any> {
    return this.api._post(`${this.url}/milliemes`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: HomeCo): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(syndic?: string, houseCo?: string, type?: string, owner?: string): Observable<HomeCo[]>  {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    return this.api._get(`${this.url}`, {
      syndic: syndic,
      houseCo: houseCo,
      type: type,
      owner: owner,
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getTravaux(home?: string): Observable<HomeCo[]>  {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    return this.api._get(`${this.url}/travaux`,  {
      home: home
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getLiaison(home?: string): Observable<HomeCo[]>  {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    return this.api._get(`${this.url}/liaison`,  {
      home: home
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<HomeCo> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/${uuid}/show`).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

  getPrinter(type: string, agencyKey: string, userKey: string, data: any, syndicUuid?: string, uuid?: string): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return ;
    }

    let url = 'printer/' + this.namespace + '/' + agencyKey + '/' + userKey;
    console.log('data', data);
    if(type === 'LISTE') {
      url += '/' + syndicUuid;
      if(data && data !== undefined) {
        let keys = ['type', 'categorie', 'dateD', 'dateF', 'ordre', 'min', 'max', 'create', 'code', 'count', 'user'];
        url += this.getFilterListData(keys, data);
      } else {
        url += '/LOT/null/null/null/DESC/null/null/null/null/10/null'
      }
    }
    else if(type === 'SHOW') {
      url += '/' + uuid;
      url = (data) ? url +'/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }

  getExport(agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = 'export/home/' + agencyKey + '/' + userKey;
    if(data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if(k !== 'uuid') {
            url += '/' + data[k];
          }
        }
      }
    } else {
      url += '/MAISON/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
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
    var url = this.urlBase + '/import/agency/model/home'
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
    return this.api._post(`${url}/home`, data).pipe(
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

  getFilterListData(keys, data){
    let url = '';
    for (const k in keys) {
       url += '/' + this.getData(data, keys[k]);
    }
    return url;
  }

  getData(data, k){
    let value = null;
    if (data.hasOwnProperty(k)) {
        return value = data[k] !== undefined && data[k] !== '' ? data[k] : null;
    }
    return null;
  }
}
