import {ApiService} from '../../theme/utils/api.service';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { NoInternetHelper } from '../../theme/utils/no-internet-helper';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class FundsapealService {

  fundsapeal: any;
  public edit: boolean = false;
  private urlBase = environment.publicUrl;
  private namespace = "trustee/fundsapeal";
  private url = "private/trustee/fundsapeal";

  constructor(private api: ApiService) { }

  setFundSapeal(fundsapeal: any) {
    this.fundsapeal = fundsapeal
  }

  getFundSapeal(): any {
    return this.fundsapeal
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
      owner: owner
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

  getImpayers(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/${uuid}/show/impayers`).pipe(
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

  validate(uuid: string): Observable<any> {
    return this.api._post(`${this.url}/${uuid}/validate`, null).pipe(
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
    if (type === 'LISTE') {
      url += '/' + syndicUuid + '/' + uuid;
      if (data && data !== undefined) {
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            if (k === 'autre' || k === 'type'  || k === 'ordre' || k === 'min' || k === 'max' || k === 'create'|| k === 'code'|| k === 'count'|| k === 'user'|| k === 'trimestre' || k === 'annee' || k === 'bien') {
              console.log('ddd',data[k])

              if(k === 'trimestre' &&  data[k] !== null) {                   
                url += '/' + ( data[k].length === 0 ?  null :  data[k]);
              }else {
                url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
              }
            }
          }
        }
      } else {
        url += '/APPEL/null/null/null/DESC/null/null/null/null/null/0/null'
      }
    }
    if(type === 'SHOW') {
      url += '/' + uuid + '/' + syndicUuid;
      url = (data) ? url +'/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }

  generateFundsApeal(uuid, trusteeUuid, state="GENERAL") {
    const data = {
        budget: uuid,
        syndic: trusteeUuid,
        statut: state
    };
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    return this.api._post(`private/trustee/fundsapeal/generate`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

}
