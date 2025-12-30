import { Injectable } from '@angular/core';
import { Setting } from '@model/setting';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  setting: Setting;
  public edit: boolean = false;
  public type: string = "general";
  private url = "private/extra/setting";
  

  constructor(private api: ApiService) {}

  setSetting(setting: Setting) {
    this.setting = setting
  }

  getSetting(): Setting {
    return this.setting
  }

  add(data: Setting): Observable<any> {
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

  createCommercial(data: any): Observable<any> {
    return this.api._post(`${this.url}/commercial`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  createTicket(data: any): Observable<any> {
    return this.api._post(`${this.url}/ticket`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  createGestionnaire(data: any): Observable<any> {
    return this.api._post(`${this.url}/gestionnaire`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  create(data: Setting): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  frais(data: any): Observable<any> {
    return this.api._post(`${this.url}/frais`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: Setting): Observable<any> {
    return this.api._post(`${this.url}/agency`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getChef(): Observable<any>{
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/chef`).pipe(
      map((response: any) => {
         return response}),
      catchError((error: any) => throwError(error))
    );
  }

  getList(): Observable<any>{
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`).pipe(
      map((response: any) => {
         return response}),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(): Observable<Setting> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/show`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getDelete(id: string): Observable<Setting> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._delete(`${this.url}/${id}`).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

}
