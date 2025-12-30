import { Injectable } from '@angular/core';
import { SettingTemplate } from '@model/setting-template';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  template: SettingTemplate;
  public edit: boolean = false;
  public type: string = "";
  private url = "private/extra/setting-template";

  constructor(private api: ApiService) {}

  setTemplate(template: SettingTemplate) {
    this.template = template
  }

  getTemplate(): SettingTemplate {
    return this.template
  }

  add(data: SettingTemplate): Observable<any> {
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

  create(data: SettingTemplate): Observable<any> {
    return this.api._post(`${this.url}/`, data).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: SettingTemplate): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}`, data).pipe(
      map((response: any) => response.data),
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
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }
}
