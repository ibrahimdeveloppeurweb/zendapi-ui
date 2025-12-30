
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { ClipboardModule } from 'ngx-clipboard';
import localeFr from '@angular/common/locales/fr';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '@theme/shared/shared.module';
import { AuthComponent } from '@theme/layout/auth/auth.component';
import { AdminComponent } from '@theme/layout/admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NavigationComponent } from '@theme/layout/admin/navigation/navigation.component';
import { NavContentComponent } from '@theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavGroupComponent } from '@theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from '@theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from '@theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavBarComponent } from '@theme/layout/admin/nav-bar/nav-bar.component';
import { NavRightComponent } from '@theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { ConfigurationComponent } from '@theme/layout/admin/configuration/configuration.component';
import { ToggleFullScreenDirective } from '@theme/shared/full-screen/toggle-full-screen';
import { NavigationItem } from '@theme/layout/admin/navigation/navigation';
import { NgbButtonsModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule} from 'angular-datatables';
import { SecurityModule } from './security/security.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '@appRoot/interceptor/jwt-interceptor';
import { HandlerErrorInterceptor } from '@appRoot/interceptor/handler-error.interceptor';
import { AgmCoreModule } from '@agm/core';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { APP_INITIALIZER } from '@angular/core';
import { InternetConnectivity, HttpConnectivity } from 'ngx-connectivity';
import { CookieService } from 'ngx-cookie-service';
import { SyndicModule } from './agence/syndic/syndic.module';
import { BudgetModule } from './agence/budget/budget.module';


export function permissionFactory(ngxPermissionsService: NgxPermissionsService) {
  const permission = JSON.parse(localStorage.getItem('token-zen-data'))?.permission ? JSON.parse(localStorage.getItem('token-zen-data'))?.permission : [];
  return () => ngxPermissionsService.loadPermissions(permission)
}

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    NavigationComponent,
    NavContentComponent,
    NavGroupComponent,
    NavCollapseComponent,
    NavItemComponent,
    NavBarComponent,
    NavRightComponent,
    ConfigurationComponent,
    ToggleFullScreenDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbButtonsModule,
    NgbTabsetModule,
    NgbAccordionModule,
    CommonModule,
    DataTablesModule,
    SecurityModule,
    AuthModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    ClipboardModule,
    SyndicModule,
    BudgetModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCR7wdbPJRZh49cZ5lq_LCw-Eb0CFNSCdI'
    }),
    NgxPermissionsModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    { provide: localeFr, useValue: 'fr-FR' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HandlerErrorInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: permissionFactory, deps: [NgxPermissionsService], multi: true },
    NavigationItem,
    InternetConnectivity,
    HttpConnectivity,
    CookieService
  ],
  exports: [
    NavigationComponent,
    NavBarComponent,
    ConfigurationComponent,
    NgxPermissionsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
