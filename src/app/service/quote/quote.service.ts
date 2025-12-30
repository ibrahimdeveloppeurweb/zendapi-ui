import { Quote } from '@model/quote';
import { Injectable} from '@angular/core';
import { ApiService } from '@theme/utils/api.service';
import { Observable, throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Provider } from '@model/provider';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  quote: Quote;
  provider: Provider;
  public edit: boolean = false;
  public construction: any ;
  public type: string = "";
  private urlBase = environment.publicUrl;
  private namespace = "agency/quote";
  private url = "private/agency/quote";

  constructor(private api: ApiService) { }

  setQuote(quote: Quote) {
    this.quote = quote
  }

  getQuote(): Quote {
    return this.quote
  }

  setProvider(provider: Provider) {
    this.provider = provider
  }

  getProvider(): Provider {
    return this.provider
  }

  add(data: Quote): Observable<any> {
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

  create(data: Quote): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: Quote): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  validate(data: Quote): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/${data.uuid}/validate`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(Uuid ?: string, type?: string, trustee?: string, isBon = 0, houseCo?: string, homeCo?: string, list?: string ): Observable<Quote[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      uuid: Uuid,
      type: type,
      trustee: trustee, 
      isBon: isBon,
      houseCo: houseCo,
      homeCo: homeCo,
      list: list
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<Quote> {
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
      if(data && data !== undefined) {
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            if(k !== 'uuid') {
              url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
            }
          }
        }
      } else {
        url += '/DEVIS/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
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

    let url = 'export/quote/' + agencyKey + '/' + userKey;
    if(data && data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          if(k !== 'uuid') {
            url += '/' + data[k];
          }
        }
      }
    } else {
      url += '/DEVIS/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
    }
    window.open(`${this.urlBase}/${url}`);
  }

  getDelete(uuid: string): Observable<Quote> {
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
