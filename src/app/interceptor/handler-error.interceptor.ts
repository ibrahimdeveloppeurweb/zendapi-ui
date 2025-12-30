import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { AuthService } from '@service/auth/auth.service';
import { EmitterService } from '@service/emitter/emitter.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpResponseBase
} from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class HandlerErrorInterceptor implements HttpInterceptor {
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 8000,
    timerProgressBar: true
  })

  constructor(
    private router: Router,
    private modal: NgbModal,
    private auth: AuthService,
    private emitter: EmitterService
  ) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.emitter.loading();
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === 200 || event.status === 201) {
            if (event.body.hasOwnProperty('message') && this.emitter.isAllowToLoad) {
              if (event.body.message && event.body.message.trim()) {
                this.Toast.fire({
                  icon: 'success',
                  title: 'Opération réussie: ',
                  text: event.body.message
                })
              }
            }
          }
          this.emitter.stopLoading();
        }
      },
      (response: HttpResponseBase) => {
        this.emitter.stopLoading();
        this.emitter.allowLoading();
        if (response instanceof HttpErrorResponse) {
          switch (response.status) {
            case 200: {
              if (response.message.trim() !== '') {
                this.Toast.fire({
                  icon: 'success',
                  title: 'Opération réussie: ',
                  text: response.message
                })
              }
              break;
            }
            case 201: {
              if (response.message.trim() !== '') {
                this.Toast.fire({
                  icon: 'success',
                  title: 'Opération réussie: ',
                  text: response.message
                })
              }
              break;
            }
         
            case 401: {
              this.Toast.fire({
                icon: 'warning',
                title: 'Connexion requise: ',
                text: 'Vous avez été déconnecté !'
              })
              this.modal.dismissAll();
              this.auth.removeDataToken();
              this.auth.removePermissionToken();
              this.router.navigate(['/auth/login']);
              break;
            }
            case 402: {
              const errors = response.error.errors;
              if (!Array.isArray(errors)) {
                Object.keys(errors).map(key => {
                  Swal.fire({
                    title: 'ACCES REFUSE !',
                    text: errors.msg,
                    icon: 'warning',
                    showConfirmButton: false,
                    cancelButtonText: 'Annuler',
                    allowOutsideClick: false
                  })
                });
              }
              break;
            }
            case 403: {
              this.Toast.fire({
                icon: 'warning',
                title: 'Accès Réfusé: ',
                text: 'Vous n\'êtes pas autorisé a accéder a cette ressource !'
              })
              break;
            }
            case 404: {
              let msg = 'Vous n\'êtes pas autorisé a accéder a cette ressource !';
              if (response.hasOwnProperty('statusText')) {
                msg = response.statusText;
              }
              this.Toast.fire({
                icon: 'warning',
                title: 'Ressource introuvable: ',
                text: msg
              })
              break;
            }
            case 422: {
              const errors = response.error.errors ? response.error.errors : response.error;
              if (!Array.isArray(errors)) {
                Object.keys(errors).map(key => {
                  this.Toast.fire({
                    icon: 'warning',
                    title: 'Contenu requis ou absent: ',
                    text: errors.msg ? errors.msg : errors.detail
                  })
                });
              }
              break;
            }
            case 500: {
              const errors = response.error.errors;
              if (errors && !Array.isArray(errors)) {
                Object.keys(errors).map(key => {
                  this.Toast.fire({
                    icon: 'error',
                    title: 'Erreur: ',
                    text: errors[key]
                  })
                });
              } else {
                this.Toast.fire({
                  icon: 'error',
                  title: 'Erreur serveur: ',
                  text: 'Erreur survenue au niveau du serveur.'
                })
              }
              break;
            }
            default: {
              this.Toast.fire({
                icon: 'error',
                title: 'Erreur serveur: ',
                text: 'Erreur survenue au niveau du serveur.'
              })
            }
          }
        }
      }, () => {
        this.emitter.stopLoading();
      })
    );
  }
}
