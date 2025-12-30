
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '@theme/utils/api.service';

@Injectable({
  providedIn: 'root'
})
export class ZenService {
  private apiUrl = environment.publicUrl;
  private url = 'private/agency/zen360';

  constructor(private api: ApiService) { }

  register(data: any): Observable<any> {
    return this.api._post(`${this.url}/register`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }


  login(data: any): Observable<any> {
    return this.api._post(`${this.url}/login`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
