import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Send } from '@model/send';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendService {

  send: Send;
  public edit: boolean = false;
  public type: string = "";
  private urlBase = environment.publicUrl;
  private namespace = "agency/mailsms";
  private url ='private/agency/mailsms';

  constructor(private api: ApiService) {}

  setSend(send: Send) {
    this.send = send
  }
  
  getSend(): Send {
    return this.send
  }

  add(data: Send): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    if (data.uuid) {
      return this.sendBack(data);
    } else {
      return this.create(data);
    }
  }

  create(data: Send): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  sendBack(data: Send): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/renvoyer`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(type: string, etat: string): Observable<Send[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {type: type, etat: etat}).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  corbeille(data: Send): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/corbeille`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(): Observable<Send> {
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
