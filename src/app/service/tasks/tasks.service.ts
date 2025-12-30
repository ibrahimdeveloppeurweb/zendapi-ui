import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  public edit: boolean = false;
  private urlBase = environment.publicUrl;
  private namespace = "agency/task";
  private url = "private/agency/task";
  option: any;

  constructor(private api: ApiService) {
  }

  setOptionDq(option) {
    this.option = option;
  }

  getOptionDq() {
    return this.option;
  }

  add(data: any): Observable<any> {
    console.log('rjjr',data)
    const form = JSON.parse(data.get('data').toString())
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    return this.create(data);
  }

  create(data: any): Observable<any> {
    const format = JSON.parse(data.get('homes').toString())
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: any): Observable<any> {
    const format = JSON.parse(data.get('data').toString())
    console.log('dhhdd',format)
    return this.api._post(`${this.url}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(dqUuid: string, parentUuid?: string, type?: string): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next(),
        obs.complete()
      });
    }

    return this.api._get(`${this.url}/`, {
      dqUuid: dqUuid,
      parentUuid: parentUuid,
      type: type
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next(),
        obs.complete()
      });
    }

    return this.api._get(`${this.url}/${uuid}/show`).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    )
  }
  // type: string, agencyKey: string, userKey: string, data: any, 
  getPrinter(type: string,  agencyKey: string,  userKey: string, data: any): void {
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
              url += '/' + data[k];
            }
          }
        }
      } else {
        url += '/RAPPORT/null/null/null/null/null/null/null/null/null/null/10/null'
      }
    }
    
    if(type === 'SHOW') {
      url = (data) ? url +'/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }

  delete(id: string): Observable<any> {

    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next(),
        obs.complete()
      });
    }

    return this.api._delete(`${this.url}/${id}/delete`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
