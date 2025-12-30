import { User } from '@model/user';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { map, catchError } from "rxjs/operators";
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public edit: boolean = false;
  public profile: boolean = false;
  user: User
  public type: string = "";
  private urlBase = environment.publicUrl;
  private namespace = "agency/user";
  private url = "private/agency/user";

  constructor(private api: ApiService) { }

  setUser(user: User) {
    this.user = user
  }
  getUser(): User {
    return this.user
  }
  add(data: User): Observable<any> {
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
  create(data: User): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  update(data: User): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response ),
      catchError((error: any) => throwError(error))
    );
  }
  editPassword(data: any): Observable<any> {
    return this.api._post(`${this.url}/agency/edit/password`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  editImg(data: any): Observable<any> {
    return this.api._post(`${this.url}/agency/edit/img`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  updateRate(data: User): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/${data.uuid}/rate`, data).pipe(
      map((response: any) => response ),
      catchError((error: any) => throwError(error))
    );
  }
  getList(serviceName?: string, serviceId?: string, withTicket?: boolean) {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      serviceName: serviceName,
      serviceId: serviceId,
      withTicket: withTicket
    }).pipe(
      map((response: any) => { return response }),
      catchError((error: any) => throwError(error))
    );
  }
  getPassword(uuid: string): Observable<User> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/password`, { uuid: uuid}).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getSingle(uuid: string): Observable<User> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/agency/show`, { uuid: uuid}).pipe(
      map((response: any) => response),
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
        url += '/UTILISATEUR/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
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

    let url = 'export/user/' + agencyKey + '/' + userKey;
    if(data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if(k !== 'uuid') {
            url += '/' + data[k];
          }
        }
      }
    } else {
      url += '/UTILISATEUR/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
    }
    window.open(`${this.urlBase}/${url}`);
  }
  getDelete(uuid: string): Observable<User> {
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
