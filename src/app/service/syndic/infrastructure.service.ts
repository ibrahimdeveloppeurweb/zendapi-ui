import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../theme/utils/api.service';
import { NoInternetHelper } from '../../theme/utils/no-internet-helper';


@Injectable({
  providedIn: 'root'
})
export class InfrastructureService {


  infrastructure: any;
  public edit: boolean = false;
  public uuid: string = '';
  public type: string = '';
  public uuidSyndic: string = '';
  private urlBase = environment.publicUrl;
  private namespace = "trustee/infrastructure";
  private url = "private/trustee/infrastructure";

  constructor(private api: ApiService) { }

  setInfrastructure(infrastructure: any) {
    this.infrastructure = infrastructure
  }

  getInfrastructure(): any {
    return this.infrastructure
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

  getList(syndic ?: string, homeCo?: string, owner?:string): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}`, {
      syndic: syndic,
      homeCo: homeCo,
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
      return ;
    }

    let url = 'printer/' + this.namespace + '/' + agencyKey + '/' + userKey;;
    if(type === 'LISTE') {
      url += '/' + syndicUuid;
      if(data && data !== undefined) {
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            if(k !== 'uuid') {
              url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
            }
          }
        }
      } else {
        url += '/INFRASTRUCTURE/null/null/DESC/null/null/null/null/10/null'
      }
    }
    if(type === 'SHOW') {
      url += '/' + uuid;
      url = (data) ? url +'/' + data : url;
    }
    console.log('Infrastructure print url', this.urlBase+'/'+url);
    window.open(`${this.urlBase}/${url}`, '_blank');
  }

}
