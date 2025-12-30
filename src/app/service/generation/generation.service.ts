import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class GenerationService {
  public edit: boolean = false;
  public type: string = "";
  private url = "private/command/generate";

  constructor(private api: ApiService) {}

  notice(data: any): Observable<any> {
    return this.api._post(`${this.url}/notice`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  generate(type: string): Observable<any>{
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    return this.api._get(`${this.url}/`, {type: type}).pipe(
      map((response: any) => { return response}),
      catchError((error: any) => throwError(error))
    );
  }
}
