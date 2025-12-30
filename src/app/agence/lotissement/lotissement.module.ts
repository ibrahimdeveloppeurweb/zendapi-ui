import { DataTablesModule } from 'angular-datatables';
import { LotShowComponent } from '@lotissement/lot/lot-show/lot-show.component';
import { LotListComponent } from '@lotissement/lot/lot-list/lot-list.component';
import { LotAddComponent } from '@lotissement/lot/lot-add/lot-add.component';
import { LotissementRoutingModule } from '@lotissement/lotissement-routing.module';
import { RouterModule } from '@angular/router';
import { IsletShowComponent } from '@lotissement/islet/islet-show/islet-show.component';
import { IsletListComponent } from '@lotissement/islet/islet-list/islet-list.component';
import { IsletAddComponent } from '@lotissement/islet/islet-add/islet-add.component';
import { SubdivisionShowComponent } from '@lotissement/subdivision/subdivision-show/subdivision-show.component';
import { SubdivisionListComponent } from '@lotissement/subdivision/subdivision-list/subdivision-list.component';
import { SubdivisionAddComponent } from '@lotissement/subdivision/subdivision-add/subdivision-add.component';
import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbCarouselModule, NgbDatepickerModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@theme/shared/shared.module';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { ArchwizardModule } from 'angular-archwizard';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SelectModule } from 'ng-select';
import { NgxDocViewerModule } from 'ngx-doc-viewer';


@NgModule({
  declarations: [
    SubdivisionAddComponent,
    SubdivisionListComponent,
    SubdivisionShowComponent,
    IsletAddComponent,
    IsletListComponent,
    IsletShowComponent,
    LotAddComponent,
    LotListComponent,
    LotShowComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbTabsetModule,
    NgbCarouselModule,
    NgbDropdownModule,
    SelectModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    FileUploadModule,
    ArchwizardModule,
    LotissementRoutingModule,
    DataTablesModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCR7wdbPJRZh49cZ5lq_LCw-Eb0CFNSCdI'}),
    NgxPermissionsModule.forRoot(),
    NgxDocViewerModule
  ]
})
export class LotissementModule { }
