import { ApiService } from '../../theme/utils/api.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NoInternetHelper } from '../../theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class CoproprieteService {

  copropriete: any;
  public edit: boolean = false;
  public exit: string = ''
  public uuid: string
  public uuidSyndic: string
  public type: string
  private urlBase = environment.publicUrl;
  private namespace = "trustee/houseco";
  private url = "private/trustee/houseco";

  constructor(private api: ApiService) { }

  setCopropriete(copropriete: any) {
    this.copropriete = copropriete
  }

  getCopropriete(): any {
    return this.copropriete
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
    return this.api._post(`${this.url}/${data?.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(syndic?: string, owner?: string): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      syndic: syndic,
      owner: owner,
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getListAll(syndic?: string, owner?: string): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/all`, {
      syndic: syndic,
      owner: owner,
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

    return this.api._get(`${this.url}/${uuid}/show`).pipe(
      map((response: any) => response.data),
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

  getPrinter(type: string, agencyKey: string, userKey: string, data: any, syndicUuid?: string, uuid?: string): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = 'printer/' + this.namespace + '/' + agencyKey + '/' + userKey;
    console.log('data', data);
    if (type === 'LISTE') {
      url += '/' + syndicUuid;
      if (data && data !== undefined) {
        let keys = ['type', 'bien', 'etat', 'dateD', 'dateF', 'ordre', 'min', 'max', 'create', 'code', 'count', 'user'];
          url += this.getFilterListData(keys, data);
      } else {
        url += '/LOT/null/null/null/DESC/null/null/null/null/10/null'
      }
    }
    else if (type === 'SHOW') {
      url += '/' + uuid;
      url = (data) ? url + '/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
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
