import { Update } from '@model/update';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  update: Update;
  private url = "private/extra/update";

  constructor(private api: ApiService) { }

  util(data: Update): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/util`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
