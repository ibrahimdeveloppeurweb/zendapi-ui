import {ApiService} from '../../theme/utils/api.service';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';
import { NoInternetHelper } from '../../theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class TantiemeService {

  tantieme: any;
  public edit: boolean = false;
  public uuid: string = '';
  private urlBase = environment.publicUrl;
  private namespace = "typetantieme";
  private url = "private/trustee/typetantieme";

  constructor(private api: ApiService) { }

  setTantieme(tantieme: any) {
    this.tantieme = tantieme
  }

  getTantieme(): any {
    return this.tantieme
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

  getList(agency ?: string,trustee?): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}`, {
      agency: agency,
      syndic: trustee
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }


  getTantiemeTrustee(syndic ?: string): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}`, {
      syndic: syndic
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

}
