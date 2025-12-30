import { Injectable } from '@angular/core';
import { SettingSms } from '@model/setting-sms';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  sms: SettingSms;
  public edit: boolean = false;
  public type: string = "";
  private url = "private/extra/setting/sms";

  constructor(private api: ApiService) {}

  setSms(sms: SettingSms) {
    this.sms = sms
  }

  getSms(): SettingSms {
    return this.sms
  }

  add(data: SettingSms): Observable<any> {
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

  create(data: SettingSms): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: SettingSms): Observable<any> {
    return this.api._post(`${this.url}/agency`, data).pipe(
      map((response: any) => response),
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

  getSingle(): Observable<any> {
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
}
