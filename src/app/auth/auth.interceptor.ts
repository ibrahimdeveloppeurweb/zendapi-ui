import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '@service/auth/auth.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const req = this.notIntercept(request) ? request : this.addAuthenticationToken(request);
    return next.handle(req).pipe(
      catchError(error => {
        switch (error.status) {
          case 401:
            this.logout();
            return throwError(error);
          default: return throwError(error);
        }
      })
    );
  }

  notIntercept(request) {
    return !this.authService.getDataToken() || request.url.includes('auth');
  }

  isRefresh(request) {
    return request.url.includes('auth/refresh');
  }

  private addAuthenticationToken(request: HttpRequest<any>): HttpRequest<any> {
    const dataToken = this.authService.getDataToken();
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${dataToken.token}`
      }
    });
  }

  private logout() {
    this.authService.removeDataToken();
    this.authService.removePermissionToken();
    location.reload();
  }
}
