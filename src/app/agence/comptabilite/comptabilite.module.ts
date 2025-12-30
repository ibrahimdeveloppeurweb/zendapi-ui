import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComptabiliteRoutingModule } from './comptabilite-routing.module';
import { BalanceAddComponent } from './balance/balance-add/balance-add.component';
import { BalanceListComponent } from './balance/balance-list/balance-list.component';
import { BalanceShowComponent } from './balance/balance-show/balance-show.component';
import { GrandLivreAddComponent } from './grand-livre/grand-livre-add/grand-livre-add.component';
import { GrandLivreShowComponent } from './grand-livre/grand-livre-show/grand-livre-show.component';
import { GrandLivreListComponent } from './grand-livre/grand-livre-list/grand-livre-list.component';
import { JournauxAddComponent } from './journaux/journaux-add/journaux-add.component';
import { JournauxListComponent } from './journaux/journaux-list/journaux-list.component';
import { JournauxShowComponent } from './journaux/journaux-show/journaux-show.component';
import { AchatComponent } from './achat/achat.component';
import { VenteComponent } from './vente/vente.component';
import { TresorerieComponent } from './tresorerie/tresorerie.component';
import { NoteFraisComponent } from './note-frais/note-frais.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '@theme/shared/components';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { ToastyModule } from 'ng2-toasty';
import { NgbCarouselModule, NgbDatepickerModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { SelectModule } from 'ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { OperationListComponent } from './operation/operation-list/operation-list.component';
import { OperationAddComponent } from './operation/operation-add/operation-add.component';


@NgModule({
  declarations: [
    BalanceAddComponent, 
    BalanceListComponent, 
    BalanceShowComponent, 
    GrandLivreAddComponent, 
    GrandLivreShowComponent, 
    GrandLivreListComponent, 
    JournauxAddComponent, 
    JournauxListComponent, 
    JournauxShowComponent, 
    AchatComponent, 
    VenteComponent, 
    TresorerieComponent, 
    NoteFraisComponent,
    OperationListComponent,
    OperationAddComponent
  ],
  imports: [
    CommonModule,
    ComptabiliteRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ModalModule,
    FormsModule,
    FileUploadModule,
    ToastyModule,
    NgbTabsetModule,
    NgbCarouselModule,
    SharedModule,
    DataTablesModule,
    // SelectModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    BsDatepickerModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    NgxDocViewerModule
  ],
  exports: [
    AchatComponent, 
    VenteComponent, 
    TresorerieComponent, 
    NoteFraisComponent,
    OperationListComponent,
    OperationAddComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class ComptabiliteModule { }
