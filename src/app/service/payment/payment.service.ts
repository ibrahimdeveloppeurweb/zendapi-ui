import {Invoice} from '@model/invoice';
import {Payment} from '@model/payment';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { environment } from '@env/environment';
import {ApiService} from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  payment: Payment;
  public edit: boolean = false;
  public type: string = '';
  public isTreso: string = 'NON';
  public treasury: any = null;
  private urlBase = environment.publicUrl;
  private namespace = "agency/payment";
  private url = 'private/agency/payment';
  public invoice = null;

  constructor(private api: ApiService) {
  }

  setPayment(payment: Payment) {
    this.payment = payment;
  }

  setInvoice(invoice: Invoice) {
    this.invoice = invoice;
  }
  getPayment(): Payment {
    return this.payment;
  }
  add(data: Payment): Observable<any> {
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
  create(data: Payment): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  confirmate(data: Payment): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/confirmation`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  validate(data: Payment): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/validate`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  annuler(data: Payment): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/${data.uuid}/annuler`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  update(data: Payment): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(tenant ?: string, dateD ?: string, dateF ?: string, treausry ?: string, mode ?: string, user ?: string, all: any = null): Observable<Payment[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      tenant: tenant,
      dateD: dateD,
      dateF: dateF,
      treausry: treausry,
      mode: mode,
      all: all,
      user: user
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<Payment> {
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
      return;
    }

    let url = 'printer/' + this.namespace + '/' + agencyKey + '/' + userKey;
    if(type === 'LISTE') {
      console.log(data)
      if(data && data !== undefined) {
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            if (k !== 'uuid') {
              url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
            }
          }
        }
      } else {
        url += '/PAIEMENT/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
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

    let url = 'export/payment/' + agencyKey + '/' + userKey;
    if(data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if(k !== 'uuid') {
            url += '/' + data[k];
          }
        }
      }
    } else {
      url += '/PAIEMENT/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
    }
    window.open(`${this.urlBase}/${url}`);
  }

  getGenerer(){
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var url = this.urlBase + '/import/agency/model/payment'
    window.open(`${url}`);
  }

  import(data){
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var url = 'private/import/agency'
    return this.api._post(`${url}/payment`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getDelete(uuid: string): Observable<Payment> {
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
