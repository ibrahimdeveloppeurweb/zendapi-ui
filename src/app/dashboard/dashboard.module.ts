import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import {ChartModule} from 'angular2-chartjs';
import { CommonModule } from '@angular/common';
import { DashComponent } from './dash/dash.component';
import { SharedModule } from '@theme/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashCrmComponent } from './dash-crm/dash-crm.component';
import {AngularHighchartsChartModule} from 'angular-highcharts-chart';
import { DashboardRoutingModule } from '@dashboard/dashboard-routing.module';
import { DashDefaultComponent } from '@dashboard/dash-default/dash-default.component';
import { DashProspectionComponent } from './dash-prospection/dash-prospection.component';
import { DashLocataireComponent } from '@dashboard/dash-locataire/dash-locataire.component';
import { DashProprietaireComponent } from '@dashboard/dash-proprietaire/dash-proprietaire.component';
import { DashPromotionComponent } from '@dashboard/dash-promotion/dash-promotion.component';
import { DashLotissementComponent } from '@dashboard/dash-lotissement/dash-lotissement.component';
import { DashViewerComponent } from '@dashboard/dash-viewer/dash-viewer.component';
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DataTablesModule } from 'angular-datatables';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { DashRessourceComponent } from './dash-ressource/dash-ressource.component';
import { DashTicketComponent } from './dash-ticket/dash-ticket.component';
import {DashWalletComponent} from "@dashboard/dash-wallet/dash-wallet.component";



@NgModule({
  declarations: [
    DashComponent,
    DashCrmComponent,
    DashViewerComponent,
    DashTicketComponent,
    DashWalletComponent,
    DashDefaultComponent,
    DashRessourceComponent,
    DashLocataireComponent,
    DashPromotionComponent,
    DashLotissementComponent,
    DashProspectionComponent,
    DashProprietaireComponent,
    DashProprietaireComponent,
  ],
    imports: [
        ChartModule,
        FormsModule,
        CommonModule,
        SharedModule,
        NgbTooltipModule,
        DataTablesModule,
        ReactiveFormsModule,
        NgxPermissionsModule,
        NgbProgressbarModule,
        NgCircleProgressModule,
        DashboardRoutingModule,
        AngularHighchartsChartModule,
   

    ],
  providers: [ { provide: LOCALE_ID, useValue: "fr-FR" }],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class DashboardModule { }
