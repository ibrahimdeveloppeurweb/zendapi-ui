import { ApiService } from '@theme/utils/api.service';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators'
import { environment } from '@env/environment';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Islet } from '@model/islet';

@Injectable({
  providedIn: 'root'
})
export class IsletService {
  islet: Islet;
  public edit: boolean = false;
  public type: string = "";
  private urlBase = environment.publicUrl;
  private namespace = "agency/islet";
  private url = "private/agency/islet";

  constructor(private api: ApiService) { }

  setIslet(islet: Islet) {
    this.islet = islet
  }

  getIslet(): Islet {
    return this.islet
  }

  add(data: Islet): Observable<any> {
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

  create(data: Islet): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  
  coordonnee(data: any): Observable<any> {
    return this.api._post(`${this.url}/coordonnee`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  update(data: Islet): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(subdivisionUuid ?: string, all = 'LIST'): Observable<Islet[]>  {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      all: all,
      subdivisionUuid: subdivisionUuid
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getCoords(subdivisionUuid ?: string): Observable<Islet[]>  {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/coords/`, {
      subdivisionUuid: subdivisionUuid
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<Islet> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/show`, {uuid: uuid}).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

  getPrinter(type: string, agencyKey: string, userKey: string, data: any): void {
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
        url += '/ILOT/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
      }
    }
    if(type === 'SHOW') {
      url = (data) ? url +'/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }

  getExport(agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = 'export/islet/' + agencyKey + '/' + userKey;
    if(data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if(k !== 'uuid') {
            url += '/' + data[k];
          }
        }
      }
    } else {
      url += '/ILOT/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
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
    var url = this.urlBase + '/import/agency/model/islet'
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
    return this.api._post(`${url}/islet`, data).pipe(
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
}
