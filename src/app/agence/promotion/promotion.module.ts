import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DataTablesModule } from 'angular-datatables';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxPermissionsModule } from 'ngx-permissions';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { SharedModule } from '@theme/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PromotionRoutingModule } from '@promotion/promotion-routing.module';
import { HomeAddComponent } from '@promotion/home/home-add/home-add.component';
import { HomeListComponent } from '@promotion/home/home-list/home-list.component';
import { HomeShowComponent } from '@promotion/home/home-show/home-show.component';
import { WorksiteAddComponent } from '@promotion/worksite/worksite-add/worksite-add.component';
import { BuildingAddComponent }  from  '@promotion/building/building-add/building-add.component';
import { WorksiteListComponent } from '@promotion/worksite/worksite-list/worksite-list.component';
import { WorksiteShowComponent } from '@promotion/worksite/worksite-show/worksite-show.component';
import { HomeTypeAddComponent } from '@promotion/home-type/home-type-add/home-type-add.component';
import { BuildingListComponent }  from  '@promotion/building/building-list/building-list.component';
import { BuildingShowComponent }  from  '@promotion/building/building-show/building-show.component';
import { HomeTypeListComponent } from '@promotion/home-type/home-type-list/home-type-list.component';
import { HomeTypeShowComponent } from '@promotion/home-type/home-type-show/home-type-show.component';
import { PromotionListComponent } from '@promotion/promotion/promotion-list/promotion-list.component';
import { PromotionShowComponent } from '@promotion/promotion/promotion-show/promotion-show.component';
import { PromotionAddComponent } from '@agence/promotion/promotion/promotion-add/promotion-add.component';
import { NgbActiveModal, NgbCarouselModule, NgbDropdownModule, NgbProgressbarModule, NgbTabsetModule, NgbTooltipModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskAddComponent } from './taks/task-add/task-add.component';
import { TaskListComponent } from './taks/task-list/task-list.component';
import { TaskShowComponent } from './taks/task-show/task-show.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { ReportAddComponent } from './report/report-add/report-add.component';
import { ReportListComponent } from './report/report-list/report-list.component';
import { ReportShowComponent } from './report/report-show/report-show.component';

@NgModule({
  declarations: [
    PromotionAddComponent,
    PromotionListComponent,
    PromotionShowComponent,
    HomeAddComponent,
    HomeListComponent,
    HomeShowComponent,
    HomeTypeAddComponent,
    HomeTypeListComponent,
    HomeTypeShowComponent,
    WorksiteAddComponent,
    WorksiteListComponent,
    WorksiteShowComponent,
    BuildingAddComponent,
    BuildingListComponent,
    BuildingShowComponent,
    TaskAddComponent,
    TaskListComponent,
    TaskShowComponent,
    ReportAddComponent,
    ReportListComponent,
    ReportShowComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbTooltipModule,
    NgbPopoverModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    DataTablesModule,
    NgbTabsetModule,
    FileUploadModule,
    ArchwizardModule,
    PromotionRoutingModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    HttpClientModule,
    NgbCarouselModule,
    NgCircleProgressModule.forRoot({}),
    NgxPermissionsModule.forRoot(),
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCR7wdbPJRZh49cZ5lq_LCw-Eb0CFNSCdI'}),
    NgxDocViewerModule,
    NgSelectModule
  ],
  providers: [
    NgbActiveModal,
 ],
 schemas: [
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
]
})
export class PromotionModule { }
