import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@theme/utils/api.service';
import { Folder } from '@model/folder';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  folder: Folder;
  public edit: boolean = false;
  private urlBase = environment.publicUrl;
  private namespace = "agency/folder/customer";
  private url = "private/agency/folder/customer";

  constructor(
    private api: ApiService,
    public httpClient: HttpClient
  ) {}

  setFolder(folder: Folder) {
    this.folder = folder
  }
  getFolder(): Folder {
    return this.folder
  }
  add(data: Folder): Observable<any> {
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
  create(data: Folder): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  update(data: Folder): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  activate(data: Folder): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/${data.uuid}/activate`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getList(customerUuid?: string, etat?: string, ownerUuid?: string): Observable<Folder []> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      customerUuid: customerUuid,
      etat: etat,
      ownerUuid: ownerUuid
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getSingle(uuid: string): Observable<Folder> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/show`, {uuid: uuid}).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }
  getPrinter(type: string, agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    let url = 'printer/' + this.namespace + '/' + agencyKey + '/' + userKey;
    if(type === 'LISTE') {
      if(data && data !== undefined) {
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            if(k !== 'uuid') {
              url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
            }
          }
        }
      } else {
        url += '/DOSSIER/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
      }
    }
    if(type === 'SHOW') {
      url = (data) ? url +'/' + data : url;
    }
    if(type === 'CERTIFICATE') {
      url = (data) ? url + '/' + data + '/certificate' : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }

  getReport(agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var type = '';
    if(data?.type === 'COMPTE') {
      type = 'compte';
    } else if(data?.type === 'DOSSIER') {
      type = 'dossier';
    } else if(data?.type === 'PAIEMENT') {
      type = 'paiement';
    }
    let url = 'report/agency/customer/' + type + '/' + agencyKey + '/' + userKey;
    if(data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if(k !== 'uuid') {
            url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
          }
        }
      }
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }

  getExport(agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = 'export/folder/customer/' + agencyKey + '/' + userKey;
    if(data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if(k !== 'uuid') {
            url += '/' + data[k];
          }
        }
      }
    } else {
      url += '/DOSSIER/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null';
    }
    window.open(`${this.urlBase}/${url}`);
  }

  getDelete(uuid: string): Observable<Folder> {
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

