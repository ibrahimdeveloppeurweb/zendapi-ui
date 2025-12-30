import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OptionDqService {
  public edit: boolean = false;
  private url = "private/agency/option/worksite";
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
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: any): Observable<any> {
    const uuid = JSON.parse(data.get('data').toString()).worksite;
    return this.api._post(`${this.url}/${uuid}/edit`, data).pipe(
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
