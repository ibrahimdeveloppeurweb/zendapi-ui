import { DemandeRoutingModule } from '@demande/demande-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastyModule } from 'ng2-toasty';
import { TextMaskModule } from 'angular2-text-mask';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgbTooltipModule, NgbDatepickerModule, NgbDropdownModule, NgbCarouselModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from "@angular/common/http";
import { SharedModule } from '@shared/shared.module';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import {ArchwizardModule} from 'angular-archwizard';
import {SelectModule} from 'ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FundRequestAddComponent } from '@demande/fund-request-add/fund-request-add.component';
import { FundRequestListComponent } from '@demande/fund-request-list/fund-request-list.component';
import {AngularHighchartsChartModule} from 'angular-highcharts-chart';
import { FundRequestShowComponent } from '@demande/fund-request-show/fund-request-show.component';
import { FundRequestDisburseComponent } from '@demande/fund-request-disburse/fund-request-disburse.component';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [
    FundRequestAddComponent,
    FundRequestListComponent,
    FundRequestShowComponent,
    FundRequestDisburseComponent
  ],
  exports: [
    FundRequestAddComponent,
    FundRequestListComponent
  ],
  imports: [
    CommonModule,
    DemandeRoutingModule,
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
    SharedModule,
    FormsModule,
    DataTablesModule,
    NgxPermissionsModule.forRoot(),
    ArchwizardModule,
    SelectModule,
    BsDatepickerModule.forRoot(),
  ]
})
export class DemandeModule { }
