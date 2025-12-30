import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { AuthService } from '@service/auth/auth.service';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  user: any;
  public type: string = "";
  public filter: any;
  public result: any;
  public formData: any;
  private url = "private/agency/filter";
  private urlD = "private/agency/dashboard";

  constructor(
    private api: ApiService,
    private auth: AuthService,
  ) {
    this.user = this.auth.getDataToken() ? this.auth.getDataToken() : null;
  }
  
  setFormData(formData){
    this.formData = formData
  }
  getFormData(): any {
    return this.formData 
  }

  search(data: any, namespace: string, uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    if (this.user?.lastLogin === null) {
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    this.filter = data
    
    let url = this.url;
    url += (uuid) ? '/' + namespace + '/' + uuid : '/' + namespace;
    return this.api._post(`${url}`, data).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

  dashboard(data: any, namespace: string, uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    if (this.user?.lastLogin === null) {
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    let url = this.urlD;
    url += (uuid) ? '/' + namespace + '/' + uuid : '/' + namespace;
    return this.api._post(`${url}`, data).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

  viewer(data: any, namespace: string, uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    if (this.user?.lastLogin === null) {
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    let url = this.urlD;
    url += (uuid) ? '/' + namespace + '/' + uuid : '/' + namespace+ '/' + null ;
    return this.api._post(`${url}`, data).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

  wallet(data: any, namespace: string, uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    if (this.user?.lastLogin === null) {
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    let url = this.urlD;
    url += (uuid) ? '/' + namespace + '/' + uuid : '/' + namespace+ '/' + null ;
    return this.api._post(`${url}`, data).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }
}
