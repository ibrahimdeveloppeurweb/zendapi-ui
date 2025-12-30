import { ApiService } from '@theme/utils/api.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { Owner } from '@model/owner';
import { Injectable } from '@angular/core';
import { Ticket } from '../../model/ticket';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { environment } from '@env/environment';
import { Qualification } from '@model/qualification';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  ticket: Ticket;
  qualificationT: Qualification;
  public edit: boolean = false;
  public uuid: string = "";
  public type: string = "";
  public optionTickets:  any[] = [];
  private urlBase = environment.publicUrl;
  private namespace = "agency/Ticket";
  private url = 'private/agency/ticket';

  constructor(private api: ApiService) { }

  setTicket(ticket: Ticket) {
    this.ticket = ticket
  }

  getTicket(): Ticket {
    return this.ticket
  }

  setQualification(qualificationT: Qualification) {
    this.qualificationT = qualificationT
  }

  getQualification(): Qualification {
    return this.qualificationT
  }

  add(data: Ticket): Observable<any> {
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
  create(data: Ticket): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  update(data: Ticket): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  assign(data: Ticket): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/assign`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getDash(data): Observable<any> {
    return this.api._post(`${this.url}/dash/viewer`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getList(etat="OUVERT",qualifier="NON",category?, tenant?,owner?,customer?,house?,rental?,ressource?): Observable<Ticket[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {
      etat: etat,
      qualifier: qualifier,
      category: category,
      tenant: tenant,
      owner: owner,
      customer: customer,
      house: house,
      rental: rental,
      ressource: ressource,
    }).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getStats(): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/stats`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  qualification(data: Qualification): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/qualification`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  ferme(data: Ticket): Observable<any> {
    return this.api._post(`${this.url}/ferme`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  note(data: Ticket): Observable<any> {
    return this.api._post(`${this.url}/note`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  

  getSingle(uuid: string): Observable<Ticket> {
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

  getListNote(uuid: string): Observable<any> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/note-list`, {uuid: uuid}).pipe(
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
        url += '/TICKET/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
      }
    }
    if(type === 'SHOW') {
      url = (data) ? url +'/' + data : url;
    }
    window.open(`${this.urlBase}/${url}`, '_blank');
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
    return this.api._post(`${url}/ticket`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
  getDelete(uuid: string): Observable<Ticket> {
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
  close(uuid: string): Observable<Ticket> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._post(`${this.url}/${uuid}/close`,null).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }
}
