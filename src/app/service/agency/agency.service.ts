import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { ApiUrlService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  agency: any;
  public edit: boolean = false;
  private url = "api/private/admin/agency";

  constructor(private api: ApiUrlService) {}

  setAgency(agency: any) {
    this.agency = agency
  }

  getAgency(): any {
    return this.agency
  }

  getSingle(uuid: string): Observable<any> {
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
}
