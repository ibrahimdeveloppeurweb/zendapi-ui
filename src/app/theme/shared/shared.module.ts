import {CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import {LightboxModule} from 'ngx-lightbox';
import {CommonModule} from '@angular/common';
import {ClickOutsideModule} from 'ng-click-outside';
import { TextMaskModule } from 'angular2-text-mask';
import {FilterComponent} from '@shared/filter/filter.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ReportComponent } from '@shared/report/report.component';
import {LoadingComponent} from '@shared/loading/loading.component';
import { NoDataComponent } from '@shared/no-data/no-data.component';
import {ToastService} from '@shared/components/toast/toast.service';
import { NoDroitComponent } from '@shared/no-droit/no-droit.component';
import {ToastComponent} from '@shared/components/toast/toast.component';
import { CountryFilterPipe } from '@shared/contact-mask/country-filter.pipe';
import {DataFilterPipe} from '@shared/components/data-table/data-filter.pipe';
import {GalleryComponent} from '@shared/components/gallery/gallery.component';
import {EntityFinderComponent} from '@shared/entity-finder/entity-finder.component';
import {AlertModule, BreadcrumbModule, CardModule, ModalModule} from './components';
import { ContactMaskComponent } from '@shared/contact-mask/contact-mask.component';
import {ImageUploaderComponent} from '@shared/image-uploader/image-uploader.component';
import {ApexChartService} from '@shared/components/chart/apex-chart/apex-chart.service';
import {FolderUploaderComponent} from '@shared/folder-uploader/folder-uploader.component';
import {TodoListRemoveDirective} from '@shared/components/todo/todo-list-remove.directive';
import {ApexChartComponent} from '@shared/components/chart/apex-chart/apex-chart.component';
import {TodoCardCompleteDirective} from '@shared/components/todo/todo-card-complete.directive';
import { NgbAccordionModule, NgbCollapseModule, NgbTooltipModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import { DxGanttComponent } from './components/dx-gantt/dx-gantt/dx-gantt.component';
import { FolderUploadComponent } from './folder-upload/folder-upload.component';
import { FolderUpload2Component } from './folder-upload-2/folder-upload-2.component';
import {
  DxGanttModule,
  DxPopupModule,
  DxButtonModule,
  DxTemplateModule,
  DxSelectBoxModule,
  DxTextAreaModule,
  DxDateBoxModule,
  DxFormModule,
  DxLoadPanelModule,
  DxCheckBoxModule,
  DxNumberBoxModule
} from 'devextreme-angular';
import { PopComponent } from './pop/pop.component';
/*import 'hammerjs';
import 'mousetrap';
import { GalleryModule } from '@ks89/angular-modal-gallery';*/

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  // suppressScrollX: true;
  wheelPropagation: false
};

import { SearchComponent } from './components/search/search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddEntityFinderComponent } from './add-entity-finder/add-entity-finder.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from '@appRoot/interceptor/jwt-interceptor';
import { LogComponent } from './log/log.component';

@NgModule({
  declarations: [
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    ApexChartComponent,
    ToastComponent,
    GalleryComponent,
    FilterComponent,
    ReportComponent,
    ImageUploaderComponent,
    FolderUploaderComponent,
    EntityFinderComponent,
    LoadingComponent,
    NoDataComponent,
    NoDroitComponent,
    ContactMaskComponent,
    CountryFilterPipe,
    DxGanttComponent,
    PopComponent,
    SearchComponent,
    AddEntityFinderComponent,
    FolderUploadComponent,
    FolderUpload2Component,
    LogComponent
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    CardModule,
    BreadcrumbModule,
    ModalModule,
    ClickOutsideModule,
    LightboxModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgbDropdownModule,
    TextMaskModule,
    DxGanttModule,
    DxPopupModule,
    DxButtonModule,
    DxTemplateModule,
    DxSelectBoxModule,
    DxTextAreaModule,
    DxDateBoxModule,
    DxFormModule,
    DxLoadPanelModule,
    DxCheckBoxModule,
    DxNumberBoxModule,
    NgSelectModule
  ],
  exports: [
    CommonModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    CardModule,
    BreadcrumbModule,
    ModalModule,
    DataFilterPipe,
    TodoListRemoveDirective,
    TodoCardCompleteDirective,
    ClickOutsideModule,
    ApexChartComponent,
    GalleryComponent,
    ToastComponent,
    FilterComponent,
    ReportComponent,
    ImageUploaderComponent,
    FolderUploaderComponent,
    EntityFinderComponent,
    LoadingComponent,
    NoDataComponent,
    NoDroitComponent,
    ContactMaskComponent,
    DxGanttComponent,
    SearchComponent,
    NgSelectModule,
    FolderUploadComponent,
    FolderUpload2Component,
    LogComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    ApexChartService,
    ToastService
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class SharedModule {
}
