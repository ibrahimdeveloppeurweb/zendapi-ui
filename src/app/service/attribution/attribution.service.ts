import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AttributionService {

  attribution: any;
  public edit: boolean = false;
  public type: string = "";
  private urlBase = environment.publicUrl;
  private namespace = "";
  private url ='private/agency/attribution';

  constructor(private api: ApiService) {}

  setAttribution(attribution: any) {
    this.attribution = attribution
  }
  
  getAttribution(): any {
    return this.attribution
  }

  getList(userUuid=null, houseUuid=null): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    return this.api._get(`${this.url}/`,{
      userUuid: userUuid,
      houseUuid:houseUuid
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}