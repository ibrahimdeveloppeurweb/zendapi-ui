import { ApiService } from '@theme/utils/api.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { Permission } from '@model/permission';
import { Injectable } from '@angular/core';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  permission: Permission;
  public edit: boolean = false;
  private url = 'private/agency/role';

  constructor(private api: ApiService) {}

  setPermission(permission: Permission) {
    this.permission = permission
  }

  getPermission(): Permission {
    return this.permission
  }

  add(data: Permission): Observable<any> {
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
  create(data: Permission): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  update(data: Permission): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(): Observable<Permission[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }  

    return this.api._get(this.url).pipe(
      map((response: any) => { return response }),
      catchError((error: any) => throwError(error))
    );
  }
  getSingle(uuid: string): Observable<Permission> {
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
  getDelete(uuid: string): Observable<Permission> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }  
    
    return this.api._delete(`${this.url}/${uuid}/delete`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
