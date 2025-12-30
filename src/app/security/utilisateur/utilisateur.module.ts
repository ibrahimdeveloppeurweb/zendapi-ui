import {SelectModule} from 'ng-select';
import { ToastyModule } from 'ng2-toasty';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import {ArchwizardModule} from 'angular-archwizard';
import { SharedModule } from '@shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { NgxPermissionsModule } from 'ngx-permissions';
import { HttpClientModule } from "@angular/common/http";
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LockComponent } from '../../auth/lock/lock.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {AngularHighchartsChartModule} from 'angular-highcharts-chart';
import { UserAddComponent } from '@utilisateur/user/user-add/user-add.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { UserShowComponent } from '@utilisateur/user/user-show/user-show.component';
import { UtilisateurRoutingModule } from '@utilisateur/utilisateur-routing.module';
import { UserListComponent } from '@utilisateur/user/user-list/user-list.component';
import { UserAccessComponent } from '@utilisateur/user/user-access/user-access.component';
import { ServiceAddComponent } from '@utilisateur/service/service-add/service-add.component';
import { ServiceShowComponent } from '@utilisateur/service/service-show/service-show.component';
import { ServiceListComponent } from '@utilisateur/service/service-list/service-list.component';
import { PermissionAddComponent } from '@utilisateur/permission/permission-add/permission-add.component';
import { PermissionListComponent } from '@utilisateur/permission/permission-list/permission-list.component';
import { UserEditPasswordComponent } from '@utilisateur/user/user-edit-password/user-edit-password.component';
import { UserRestPasswordComponent } from '@utilisateur/user/user-rest-password/user-rest-password.component';
import { NgbTooltipModule, NgbDatepickerModule, NgbDropdownModule, NgbCarouselModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { UserImgComponent } from './user/user-img/user-img.component';


@NgModule({
  declarations: [
    UserAddComponent,
    UserListComponent,
    PermissionAddComponent,
    PermissionListComponent,
    UserShowComponent,
    ServiceAddComponent,
    ServiceShowComponent,
    ServiceListComponent,
    UserEditPasswordComponent,
    UserRestPasswordComponent,
    UserAccessComponent,
    LockComponent,
    UserImgComponent
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    AngularHighchartsChartModule,
    FormsModule,
    FileUploadModule,
    TextMaskModule,
    ToastyModule,
    NgbTabsetModule,
    NgbCarouselModule,
    UtilisateurRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    ArchwizardModule,
    SelectModule,
    NgxPermissionsModule.forRoot(),
    AngularDualListBoxModule,
    BsDatepickerModule.forRoot()
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class UtilisateurModule { }
