import {ApiService} from '../../theme/utils/api.service';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { environment } from '../../../environments/environment';
import { NoInternetHelper } from '../../theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class RapportSyndicService {

  private urlBase = environment.publicUrl;
  private namespace = "";
  private url = "printer/trustee/rapport";

  constructor(private api: ApiService) { }

  getPrinter (agencyKey: string, userKey: string, data: any, uuid: string) {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return;
    }

    let url = (data) ? this.url + '/' + agencyKey + '/' + userKey + '/' + data.type + '/' + data.annee + '/' + uuid : this.url;

    window.open(`${this.urlBase}/${url}/`, '_blank');
  }
}
