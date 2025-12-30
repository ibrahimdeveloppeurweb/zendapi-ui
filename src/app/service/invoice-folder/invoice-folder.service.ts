
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import { environment } from '@env/environment';
import {catchError, map} from 'rxjs/operators';
import {ApiService} from '@theme/utils/api.service';
import {InvoiceFolder} from '@model/invoice-folder';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class InvoiceFolderService {
  invoice: InvoiceFolder;
  public type: string = '';
  public edit: boolean = false;
  private urlBase = environment.publicUrl;
  private namespace = "agency/folder/invoice";
  private url = 'private/agency/folder/invoice';

  constructor(private api: ApiService) {
  }

  setInvoice(invoice: InvoiceFolder) {
    this.invoice = invoice;
  }
  getInvoice(): InvoiceFolder {
    return this.invoice;
  }

  getList(folder ?: string, etat?: string, type ?: string, customer?: string): Observable<InvoiceFolder[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      folder: folder,
      etat: etat,
      type: type,
      customer: customer
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getSingle(uuid: string): Observable<InvoiceFolder> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/show`, {
      uuid: uuid
    }).pipe(
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
        url += '/AUTRE/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
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
      url += '/AUTRE/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
    }
    window.open(`${this.urlBase}/${url}`);
  }
}
