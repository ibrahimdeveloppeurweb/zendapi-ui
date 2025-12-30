import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiService } from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlanComptableService {


  planComptable: any;
  public type: string = "";
  private url: string = "private/accounting/account";
  public edit: boolean = false;
  private urlBase = environment.publicUrl;

  constructor(private api: ApiService) {
  }

  setPlanComptable(planComptable: any) {
    this.planComptable = planComptable;
  }

  getPlanComptable(): any {
    return this.planComptable;
  }

  add(data: any): Observable<any> {
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

  create(data: any): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: any): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(agency ?: string, model ?: string, all ?: boolean): Observable<any[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}`, {
      agency: agency,
      model: model,
      all: all
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next(),
        obs.complete()
      });
    }

    return this.api._get(`${this.url}/${uuid}/show`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    )
  }


  getEtat(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next(),
        obs.complete()
      });
    }

    return this.api._get(`${this.url}/${uuid}/state`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    )
  }

  getDelete(id: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next(),
        obs.complete()
      });
    }

    return this.api._delete(`${this.url}/${id}/delete`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  import(data){
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var url = 'private/import/accounting'
    return this.api._post(`${url}/account`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
