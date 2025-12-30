import { Injectable } from '@angular/core';
import { ApiService } from '@theme/utils/api.service';
import { Path } from '@model/path';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from "rxjs/operators";
import { environment } from '@env/environment';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';

@Injectable({
  providedIn: 'root'
})
export class PathService {
  path: Path;
  public edit: boolean = false;
  private urlBase = environment.publicUrl;
  private url = "private/admin/path";

  constructor(private api: ApiService) {}

  setPath(path: Path) {
    this.path = path
  }

  getPath(): Path {
    return this.path
  }

  getList(type ?: string): Observable<Path[]> {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return Observable.create(obs => {
        obs.next();
        obs.complete();
      });
    }

    return this.api._get(`${this.url}/`, {type: type}).pipe(
      map((response: any) => response),
      catchError((error: any) => throwError(error))
    );
  }

}
