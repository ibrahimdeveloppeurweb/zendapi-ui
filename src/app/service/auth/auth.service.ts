
import { throwError } from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '@env/environment';
import { catchError, map} from 'rxjs/operators';
import { Injectable} from '@angular/core';
import { PermissionToken } from '@model/auth/auth.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { NoInternetHelper } from '@theme/utils/no-internet-helper';
import { DataToken, ResetData, DataLock, RateToken } from '@model/auth/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient = null,
    public router: Router
  ) {}

  login(data) {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return ;
    }

    data = {...data, type: 'AGENCY'}; //Affectation des valeur
    return this.http.post(`${environment.serverUrl}/login`, data)
    .pipe(
      map((res: any) => {
        this.setDataToken(res);
        this.setPermissionToken(res);
        this.removeDataLock()
        return res;
      })
    );
  }

  logout(user){
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return ;
    }

    const refreshToken = JSON.parse(localStorage.getItem('token-zen-data')).refreshToken;
    const body = {refreshToken, user};

    return this.http.post(`${environment.serverUrl}/logout`, body)
    .pipe(
      map((res: any) => {
        this.removeDataToken();
        this.removePermissionToken();
        this.router.navigate(['/auth/login']);
        return res;
      })
    );
  }

  forgot(data) {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return
    }

    data = {...data, type: 'AGENCY'}; //Affectation des valeur
    return this.http.post(`${environment.serverUrl}/forgot`, data)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  editPassword(body: ResetData) {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return ;
    }

    return this.http.post(`${environment.serverUrl}/auth/edit/password`, body).pipe(
      map((response: any) => { return response }),
      catchError((error: any) => throwError(error))
    );
  }

  restPassword(body: ResetData) {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return ;
    }

    return this.http.post(`${environment.serverUrl}/auth/rest/password`, body).pipe(
      map((response: any) => { return response }),
      catchError((error: any) => throwError(error))
    );
  }

  actualiserPassword(body: ResetData) {
    if (!navigator.onLine) {
      NoInternetHelper.internet()
      return ;
    }

    return this.http.post(`${environment.serverUrl}/auth/rest/access`, body).pipe(
      map((response: any) => { return response }),
      catchError((error: any) => throwError(error))
    );
  }

  getDataToken(): DataToken {
    return JSON.parse(localStorage.getItem('token-zen-data'));
  }
  getDataLock(): DataToken {
    return JSON.parse(localStorage.getItem('lock-zen'));
  }
  getRateToken(): RateToken {
    return JSON.parse(localStorage.getItem('rate-token'));
  }
  getPermissionToken(): PermissionToken {
    return JSON.parse(localStorage.getItem('permission-zen'));
  }
  getToken(): string {
    return this.getDataToken().token;
  }
  getRefreshToken(): string {
    return this.getDataToken().refreshToken;
  }

  async refreshToken() {
    const refreshToken = JSON.parse(localStorage.getItem('token-zen-data')).refreshToken;
    const token = JSON.parse(localStorage.getItem('token-zen-data')).token;
    const body = {refreshToken};
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    this.http.post(`${environment.serverUrl}/token/refresh`, body, {headers})
      .subscribe((res) => {
      }, (error) => {
    });
  }

  setDataToken(res): void {
    if (res && res?.data) {
      const dataToken = res?.data as DataToken;
      localStorage.setItem('token-zen-data', JSON.stringify(dataToken));
    }
  }
  setDataLock(res): void {
    if (res) {
      const dataLock = res as DataLock;
      localStorage.setItem('lock-zen', JSON.stringify(dataLock));
    }
  }
  setRateToken(res): void {
    if (res && res?.data) {
      const RateToken = res?.data as RateToken;
      localStorage.setItem('rate-token', JSON.stringify(RateToken));
    }
  }
  setPermissionToken(user): void {
    if (user && user?.data) {
      const PermissionToken = user?.data?.permissions as PermissionToken;
      localStorage.setItem('permission-zen', JSON.stringify(PermissionToken));
    }
  }
  removeDataToken() {
    localStorage.removeItem('token-zen-data');
  }
  removePermissionToken() {
    localStorage.removeItem('permission-zen');
  }
  removeDataLock() {
    localStorage.removeItem('lock-zen');
  }
}
