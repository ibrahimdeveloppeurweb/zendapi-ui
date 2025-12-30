import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  reservation: any;
  public edit: boolean = false;
  public type: string = "VENTE";
  public uuid: string = ''
  private urlBase = environment.publicUrl;
  private namespace = "agency/reservation";
  private url ='private/agency/reservation';

  constructor(private api: ApiService) {}

  setReservation(reservation: any) {
    this.reservation = reservation
  }
  
  getReservation(): any {
    return this.reservation
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
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(prospect: string = null, status: string = "VENTE", archiver: string = "NON", etat: string = null): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      etat: etat,
      status: status,
      prospect: prospect,
      archiver: archiver,
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
        url += '/LOCATAIRE/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
      }
    }
    if (type === 'SHOW') {
      url += '/' + uuid;
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

