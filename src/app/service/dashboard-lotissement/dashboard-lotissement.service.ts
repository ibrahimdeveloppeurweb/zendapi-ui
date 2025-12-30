import {Injectable} from '@angular/core';
// import {Customer} from '@model/customer';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import { environment } from '@env/environment';
import {ApiService} from '@theme/utils/api.service';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class dashboardLotissementService {
  // customer: Customer;
  public edit: boolean = false;
  public type: string = '';
  public typedash: string = '';
  public categorie: string = '';
  public uuidProspect: string = ''
  public uuid: string = ''
  private urlBase = environment.publicUrl;
  private namespace = "dasboard/agency/subdivision";
  private url = 'private/dasboard/agency/subdivision';

  constructor(private api: ApiService) {
  }

  // setCustomer(customer: Customer) {
  //   this.customer = customer;
  // }

  // getCustomer(): Customer {
  //   return this.customer;
  // }

  // add(data: Customer): Observable<any> {
  //   if (!navigator.onLine) {
  //     NoInternetHelper.internet()
  //     return Observable.create(obs => {
  //       obs.next();
  //       obs.complete();
  //     });
  //   }

  //   if (data.uuid) {
  //     return this.update(data);
  //   } else {
  //     return this.create(data);
  //   }
  // }

  // create(data: Customer): Observable<any> {
  //   return this.api._post(`${this.url}/new`, data).pipe(
  //     map((response: any) => response),
  //     catchError((error: any) => throwError(error))
  //   );
  // }

  // update(data: Customer): Observable<any> {
  //   return this.api._post(`${this.url}/${data.uuid}/edit`, data).pipe(
  //     map((response: any) => response),
  //     catchError((error: any) => throwError(error))
  //   );
  // }

  // getList(type: string = null, uuid: string = null, all: string = null): Observable<Customer[]> {
  //   if (!navigator.onLine) {
  //     NoInternetHelper.internet()
  //     return Observable.create(obs => {
  //       obs.next();
  //       obs.complete();
  //     });
  //   }

  //   return this.api._get(`${this.url}/`, {
  //     uuid: uuid,
  //     type: type,
  //     all: all
  //   }).pipe(
  //     map((response: any) => response),
  //     catchError((error: any) => throwError(error))
  //   );
  // }

  // getSingle(uuid: string): Observable<Customer> {
  //   if (!navigator.onLine) {
  //     NoInternetHelper.internet()
  //     return Observable.create(obs => {
  //       obs.next();
  //       obs.complete();
  //     });
  //   }

  //   return this.api._get(`${this.url}/show`, {uuid: uuid}).pipe(
  //     map((response: any) => response),
  //     catchError((error: any) => throwError(error))
  //   );
  // }

  getPrinter(data: any, agencyKey: string, userKey: string): void {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    var type = '';
    // if(data?.type === 'LOYER') {
    //   type = 'loyer';
    // } else if(data?.type === 'ENTREE') {
    //   type = 'invoices';
    // } else if(data?.type === 'PENALITE') {
    //   type = 'invoices';
    // } else if(data?.type === 'AUTRE') {
    //   type = 'invoices';
    // }else if(data?.type === 'RENOUVELLEMENT') {
    //   type = 'invoices';
    // } else if(data?.type === 'RESILIATION') {
    //   type = 'invoices';
    // }
    // if(data?.type === 'TOUT') {
    //     type = 'default';
    //   } else if(data?.type === 'LOYER') {
    //     type = 'loyer';
    //   } else if(data?.type === 'ENTREE') {
    //     type = 'invoices';
    //   } else if(data?.type === 'PENALITE') {
    //     type = 'invoices';
    //   } else if(data?.type === 'AUTRE') {
    //     type = 'invoices';
    //   }else if(data?.type === 'RENOUVELLEMENT') {
    //     type = 'invoices';
    //   } else if(data?.type === 'RESILIATION') {
    //     type = 'invoices';
    //   }
    let url = 'printer/' + this.namespace + '/' + agencyKey + '/' + userKey;
      if(data && data !== undefined) {
        for (const k in data) {
          if (data.hasOwnProperty(k)) {
            if(k !== 'uuid') {
              url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
            }
          }
        }
      }
      // console.log('guyguy', data);
      // console.log('link promotion', url);
      window.open(`${this.urlBase}/${url}`, '_blank');
  }

      // getReport(agencyKey: string, userKey: string, data: any): void {
      //   if (!navigator.onLine) {
      //     NoInternetHelper.internet()
      //     return Observable.create(obs => {
      //       obs.next();
      //       obs.complete();
      //     });
      //   }
      //   var type = '';
      //   if(data?.type === 'COMPTE') {
      //     type = 'compte';
      //   } else if(data?.type === 'RECOUVREMENT') {
      //     type = 'recouvrement';
      //   } else if(data?.type === 'PAIEMENT') {
      //     type = 'paiement';
      //   } else if(data?.type === 'REVERSEMENT') {
      //     type = 'reversement';
      //   } else if(data?.type === 'COMMISSION') {
      //     type = 'commission';
      //   } else if(data?.type === 'SITUATION_BIEN') {
      //     type = 'bien';
      //   }
      //   let url = 'report/agency/owner/' + type + '/' + agencyKey + '/' + userKey;
      //   if(data && data !== undefined) {
      //     for (const k in data) {
      //       if (data.hasOwnProperty(k)) {
      //         if(k !== 'uuid') {
      //           url += '/' + (data[k] !== undefined && data[k] !== '' ? data[k] : null);
      //         }
      //       }
      //     }
      //   }
      //   window.open(`${this.urlBase}/${url}`, '_blank');
      // }
    
      // getGenerer(){
      //   if (!navigator.onLine) {
      //     NoInternetHelper.internet()
      //     return Observable.create(obs => {
      //       obs.next();
      //       obs.complete();
      //     });
      //   }
      //   var url = this.urlBase + '/import/agency/model/customer'
      //   window.open(`${url}`);
      // }
    
      // getExport(agencyKey: string, userKey: string, data: any): void {
      //   if (!navigator.onLine) {
      //     NoInternetHelper.internet()
      //     return;
      //   }
    
      //   let url = 'export/customer/' + agencyKey + '/' + userKey;
      //   if(data && data !== undefined) {
      //     for (const k in data) {
      //       if (data.hasOwnProperty(k)) {
      //         if(k !== 'uuid') {
      //           url += '/' + data[k];
      //         }
      //       }
      //     }
      //   } else {
      //     url += '/CLIENT/null/null/null/null/null/null/null/null/null/DESC/null/null/null/null/10/null'
      //   }
      //   window.open(`${this.urlBase}/${url}`);
      // }
    
      // import(data){
      //   if (!navigator.onLine) {
      //     NoInternetHelper.internet()
      //     return Observable.create(obs => {
      //       obs.next();
      //       obs.complete();
      //     });
      //   }
      //   var url = 'private/import/agency'
      //   return this.api._post(`${url}/customer`, data).pipe(
      //     map((response: any) => response),
      //     catchError((error: any) => throwError(error))
      //   );
      // }

  getDelete(uuid: string): Observable<any> {
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
