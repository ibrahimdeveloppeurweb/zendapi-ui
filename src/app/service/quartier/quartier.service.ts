import { Injectable } from '@angular/core';
import { Quartier } from '@model/quartier';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { ApiUrlService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class QuartierService {
  quartier: Quartier;
  public edit: boolean = false;
  private url = "admin/neighborhood";

  constructor(private api: ApiUrlService) {}

  setQuartier(quartier: Quartier) {
    this.quartier = quartier
  }

  getQuartier(): Quartier {
    return this.quartier
  }

  add(data: Quartier): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    console.log(data)
    if (data.uuid) {
      return this.update(data);
    } else {
      return this.create(data);
    }
  }

  create(data: Quartier): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: Quartier): Observable<any> {
    return this.api._put(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(): Observable<Quartier[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return new Observable((observer) => {
        observer.next([]); 
        observer.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
    }).pipe(
      map((response: any) => {return response}),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<Quartier> {
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

  getDelete(uuid: string): Observable<Quartier> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._delete(`${this.url}/${data}/delete`).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }
}
