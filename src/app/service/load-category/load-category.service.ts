import { ApiService } from '@theme/utils/api.service';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { LoadCategory } from '@model/load-category';
import { environment } from '@env/environment';
import { Injectable } from '@angular/core';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class LoadCategoryService {
  loadCategory: LoadCategory;
  public edit: boolean = false;
  public type: string = '';
  private namespace = "budget/load/category";
  private urlBase = environment.publicUrl;
  private url = "private/budget/load/category";

  constructor(private api: ApiService) { }


  setLoadCategory(loadCategory: LoadCategory) {
    this.loadCategory = loadCategory
  }

  getLoadCategory(): LoadCategory {
    return this.loadCategory
  }

  add(data: LoadCategory): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    if (this.edit) {
      return this.update(data);
    } else {
      return this.create(data);
    }
  }

  create(data: LoadCategory): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: LoadCategory): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(): Observable<LoadCategory[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getSingle(uuid: string): Observable<LoadCategory> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/show`, { uuid: uuid }).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }

  getDelete(id: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._delete(`${this.url}/${id}/delete`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getPrinter(type: string, agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = 'printer/' + this.namespace + '/' + agencyKey + '/' + userKey;
    if (type === 'LISTE') {
      console.log('data',data)      
      if (data && data !== undefined) {
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            if (k === 'autre' || k === 'type'  || k === 'ordre' || k === 'min' || k === 'max' || k === 'create'|| k === 'code'|| k === 'count'|| k === 'user') {
              url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
            }
          }
        }
      } else {
        url += '/LOAD/CATEGORY/null/null/null/null/DESC/null/null/null/null/10/null'
      }
     }
    if (type === 'SHOW') {
      url = (data) ? url + '/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }
}
