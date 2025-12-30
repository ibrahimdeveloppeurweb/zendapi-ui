import {ApiService} from '../../theme/utils/api.service';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { NoInternetHelper } from '../../theme/utils/no-internet-helper';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class FundsNoticeService {

  fundsNotice: any;
  public edit: boolean = false;
  private urlBase = environment.publicUrl;
  private namespace = "fundsnotice";
  private url = "private/trustee/fundsnotice";

  constructor(private api: ApiService) { }

  setFundsNotice(fundsNotice: any) {
    this.fundsNotice = fundsNotice
  }

  getFundsNotice(): any {
    return this.fundsNotice
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
    return this.api._post(`${this.url}/${data?.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(syndic?: string, owner?: string): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      syndic: syndic,
      owner: owner
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/${uuid}/show`).pipe(
      map((response: any) => response.data),
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

  validate(uuid: string): Observable<any> {
    return this.api._post(`${this.url}/${uuid}/validate`, null).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
