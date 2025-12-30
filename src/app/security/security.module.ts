import { NgxPermissionsModule } from 'ngx-permissions';
import { ToastrModule } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { UtilisateurModule } from '@utilisateur/utilisateur.module';
import localeFr from '@angular/common/locales/fr';
import { CommonModule, registerLocaleData } from '@angular/common';
registerLocaleData(localeFr);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UtilisateurModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    }),
    NgxPermissionsModule.forRoot(),
  ],
  providers: [ { provide: LOCALE_ID, useValue: "fr-FR" }]
})
export class SecurityModule { }
