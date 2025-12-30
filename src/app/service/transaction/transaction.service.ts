import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { ApiService } from '@theme/utils/api.service';
import { Transaction } from '@model/transaction';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  public edit: boolean = false;
  public type = "";
  public day = false;
  transaction: Transaction
  private urlBase = environment.publicUrl;
  private namespace = "agency/transaction";
  private url = "private/agency/transaction";

  constructor(private api: ApiService) { }

  setTTransaction(transaction: Transaction) {
    this.transaction = transaction
  }

  getTransaction(): Transaction {
    return this.transaction
  }

  add(data: Transaction): Observable<any> {
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

  create(data: Transaction): Observable<any> {
    return this.api._post(`${this.url}/new`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  update(data: Transaction): Observable<any> {
    return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getList(): Observable<Transaction[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

  getSingle(uuid: string): Observable<Transaction> {
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

  import(data) {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }
    var url = 'private/import/agency'
    return this.api._post(`${url}/transaction`, data).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }


  getDelete(uuid: string): Observable<Transaction> {
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

  getTransactionList() {
    return [
      {
        libelle: "libelle 1",
        montant: 1000000,
        id: 1
      },
      {
        libelle: "libelle 1",
        montant: 1000000,
        id: 1
      }
    ]
  }
}
