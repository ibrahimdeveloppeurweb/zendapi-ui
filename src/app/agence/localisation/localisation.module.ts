import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { SelectModule } from 'ng-select';
import { ToastyModule } from 'ng2-toasty';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import { ShowComponent } from './show/show.component';
import { ArchwizardModule } from 'angular-archwizard';
import { DataTablesModule } from 'angular-datatables';
import { NgxPermissionsModule } from 'ngx-permissions';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { SharedModule } from '@theme/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularHighchartsChartModule } from 'angular-highcharts-chart';
import { LocalisationRoutingModule } from './localisation-routing.module';
import { NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AddComponent } from './add/add.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations: [ShowComponent, AddComponent],
  imports: [
    CommonModule,
    FormsModule,
    ToastyModule,
    SharedModule,
    SelectModule,
    TextMaskModule,
    FileUploadModule,
    DataTablesModule,
    ArchwizardModule,
    HttpClientModule,
    NgbTooltipModule,
    NgbCollapseModule,
    NgbCarouselModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    NgbDatepickerModule,
    LocalisationRoutingModule,
    AngularHighchartsChartModule,
    BsDatepickerModule.forRoot(),
    NgxPermissionsModule.forRoot()
  ],
  exports: [ShowComponent, AddComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class LocalisationModule { }
