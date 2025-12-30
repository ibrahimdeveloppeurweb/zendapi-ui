import { City } from '@model/city';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { ApiUrlService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  city: City;
  public edit: boolean = false;
  private url = "admin/city";

  constructor(private api: ApiUrlService) {}

  setCity(city: City) {
    this.city = city
  }

  getCity(): City {
    return this.city
  }

  add(data: City): Observable<any> {
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

  create(data: City): Observable<any> {
    return this.api._post(`${this.url}/`, data).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: City): Observable<any> {
    return this.api._put(`${this.url}/${data.uuid}`, data).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

  getList(): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`).pipe(
      map((response: any) => {return response}),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<City> {
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

  getDelete(uuid: string): Observable<City> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._delete(`${this.url}/${uuid}`).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }
}
