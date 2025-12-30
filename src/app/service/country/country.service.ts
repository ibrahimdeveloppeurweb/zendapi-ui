import { Country } from '@model/country';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { ApiService, ApiUrlService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  country: Country;
  public edit: boolean = false;
  private url = "private/admin/country";

  constructor(private api: ApiService) {}

  setCountry(country: Country) {
    this.country = country
  }

  getCountry(): Country {
    return this.country
  }

  add(data: Country): Observable<any> {
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

  create(data: Country): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: Country): Observable<any> {
    return this.api._put(`${this.url}/${data.uuid}/edit`, data).pipe(
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

  getSingle(uuid: string): Observable<Country> {
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

  getDelete(uuid: string): Observable<Country> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._delete(`${this.url}/${uuid}/delete`).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }
}
