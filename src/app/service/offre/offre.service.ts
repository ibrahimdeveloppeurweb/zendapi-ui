import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OffreService {

  offre: any;
  public edit: boolean = false;
  public type: string = "";
  public uuid: string = ''
  private urlBase = environment.publicUrl;
  private namespace = "agency/offre";
  private url ='private/agency/offre';

  constructor(private api: ApiService) {}

  setOffre(offre: any) {
    this.offre = offre
  }

  getOffre(): any {
    return this.offre
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

  publier(data: any): Observable<any> {
    return this.api._post(`${this.url}/publier`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }


  vedette(data: any): Observable<any> {
    console.log(data);
    return this.api._post(`${this.url}/vedette`, data).pipe(
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

  getList(offre: string =null, parentId: string =null, prospect: string =null, all: boolean = true): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`,{
      all: all,
      offre: offre,
      parentId: parentId,
      prospect: prospect,
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/show`, {uuid: uuid}).pipe(
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
        url += '/OFFRE/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
      }
      console.log(url)
    }
    if (type === 'SHOW') {
        // url += '/' + uuid;
        url = (data) ? url + '/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
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
