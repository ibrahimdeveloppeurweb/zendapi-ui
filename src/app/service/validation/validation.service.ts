import { Injectable } from '@angular/core';
import { AuthService } from '@service/auth/auth.service';
import { ApiService } from '@theme/utils/api.service';
import { Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  user: any;
  public type: string = "";
  private url = "private/agency/validation";
  private urlBase = environment.publicUrl;

  constructor(
    private api: ApiService,
    private auth: AuthService,
  ) {
    this.user = this.auth.getDataToken() ? this.auth.getDataToken() : null;
  }

  create(data: any): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
