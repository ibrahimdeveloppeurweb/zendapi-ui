import { environment } from '@env/environment';
import {ApiService} from '@theme/utils/api.service';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {EntranceInvoice} from '@model/entrance-invoice';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class EntranceInvoiceService {
  entranceInvoice: EntranceInvoice;
  public edit: boolean = false;
  public type: string = '';
  private urlBase = environment.publicUrl;
  private namespace = "agency/invoice";
  private url = 'private/agency/invoice';

  constructor(private api: ApiService) {
  }

  setEntranceInvoice(entranceInvoice: EntranceInvoice) {
    this.entranceInvoice = entranceInvoice;
  }
  getEntranceInvoice(): any {
    return this.entranceInvoice;
  }
  add(data: EntranceInvoice): Observable<any> {
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
  create(data: EntranceInvoice): Observable<any> {
    return this.api._post(`${this.url}/`, data).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }
  update(data: EntranceInvoice): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}`, data).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }
  getList(all: string = null): Observable<EntranceInvoice[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`,{all:all}).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getSingle(uuid: string): Observable<EntranceInvoice> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/show}`, {uuid: uuid}).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }
  getPrinter(type: string, agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
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
        url += '/ENTREE/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
      }
    }
    if(type === 'SHOW') {
      url = (data) ? url +'/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
  }

  getExport(agencyKey: string, userKey: string, data: any): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = 'export/invoice/' + agencyKey + '/' + userKey;
    if(data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if(k !== 'uuid') {
            url += '/' + data[k];
          }
        }
      }
    } else {
      url += '/ENTREE/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
    }
    window.open(`${this.urlBase}/${url}`);
  }

  getDelete(id: string): Observable<EntranceInvoice> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._delete(`${this.url}/${id}`).pipe(
      map((response: any) => response.data),
      catchError((error: any) => throwError(error))
    );
  }
}
