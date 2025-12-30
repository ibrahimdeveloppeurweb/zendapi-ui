import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProspectionRoutingModule } from './prospection-routing.module';
import { ProspectionListComponent } from './prospection/prospection-list/prospection-list.component';
import { ProspectionShowComponent } from './prospection/prospection-show/prospection-show.component';
import { ProspectionAddComponent } from './prospection/prospection-add/prospection-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastyModule } from 'ng2-toasty';
import { SharedModule } from '@theme/shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbAccordionModule, NgbCarouselModule, NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbProgressbarModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { ArchwizardModule } from 'angular-archwizard';
import { DataTablesModule } from 'angular-datatables';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AgmCoreModule } from '@agm/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AgentListComponent } from './agent/agent-list/agent-list.component';
import { AgentShowComponent } from './agent/agent-show/agent-show.component';
import { AgentAddComponent } from './agent/agent-add/agent-add.component';
import { OffreListComponent } from './offre/offre-list/offre-list.component';
import { OffreShowComponent } from './offre/offre-show/offre-show.component';
import { OffreAddComponent } from './offre/offre-add/offre-add.component';
import { OffreTypeAddComponent } from './offre-type/offre-type-add/offre-type-add.component';
import { OffreTypeShowComponent } from './offre-type/offre-type-show/offre-type-show.component';
import { OffreTypeListComponent } from './offre-type/offre-type-list/offre-type-list.component';
import { ReservationAddComponent } from './reservation/reservation-add/reservation-add.component';
import { ReservationListComponent } from './reservation/reservation-list/reservation-list.component';
import { ReservationShowComponent } from './reservation/reservation-show/reservation-show.component';
import { ActivityAddComponent } from './activity/activity-add/activity-add.component';
import { ActivityListComponent } from './activity/activity-list/activity-list.component';
import { ActivityShowComponent } from './activity/activity-show/activity-show.component';
import { TinymceModule } from 'angular2-tinymce';
import { EtapeComponent } from './agent/etape/etape.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { RdvComponent } from './activity/rdv/rdv.component';
import { ParametreComponent } from './parametre/parametre.component';
import { EtapeAddComponent } from './parametre/etape/etape-add/etape-add.component';
import { EtapeListComponent } from './parametre/etape/etape-list/etape-list.component';
import { EtapeShowComponent } from './parametre/etape/etape-show/etape-show.component';
import { NgxSmoothDnDModule } from 'ngx-smooth-dnd';
import { ProspectionLocationComponent } from './prospection/prospection-location/prospection-location.component';
import { PaymentProspectAddComponent } from './payment/payment-prospect-add/payment-prospect-add.component';
import { PaymentProspectListComponent } from './payment/payment-prospect-list/payment-prospect-list.component';
import { PaymentProspectShowComponent } from './payment/payment-prospect-show/payment-prospect-show.component';
import { ActionListComponent } from './action/action-list/action-list.component';
import { ActionShowComponent } from './action/action-show/action-show.component';
import { ActionAddComponent } from './action/action-add/action-add.component';
import { ResponseAddComponent } from './response/response-add/response-add.component';
import { ResponseListComponent } from './response/response-list/response-list.component';
import { ResponseShowComponent } from './response/response-show/response-show.component';
import { CityAddComponent } from '@agence/parametre/city/city-add/city-add.component';
import { CommonAddComponent, } from '@agence/parametre/common/common-add/common-add.component';
import { NeighborhoodAddComponent, } from '@agence/parametre/neighborhood/neighborhood-add/neighborhood-add.component';
@NgModule({
  declarations: [
    ProspectionListComponent,
    ProspectionShowComponent,
    ProspectionAddComponent,
    AgentListComponent,
    AgentShowComponent,
    AgentAddComponent,
    OffreListComponent,
    OffreShowComponent,
    OffreAddComponent,
    EtapeComponent,
    RdvComponent,
    EtapeAddComponent,
    ParametreComponent,
    EtapeListComponent,
    EtapeShowComponent,
    ActivityAddComponent,
    OffreTypeAddComponent,
    ActivityListComponent,
    ActivityShowComponent,
    OffreTypeShowComponent,
    OffreTypeListComponent,
    ReservationAddComponent,
    ReservationListComponent,
    ReservationShowComponent,
    ProspectionLocationComponent,
    PaymentProspectAddComponent,
    PaymentProspectListComponent,
    PaymentProspectShowComponent,
    ActionListComponent,
    ActionShowComponent,
    ActionAddComponent,
    ResponseAddComponent,
    ResponseListComponent,
    ResponseShowComponent,
  ],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    ToastyModule,
    SharedModule,
    TextMaskModule,
    NgbTabsetModule,
    HttpClientModule,
    NgbTooltipModule,
    NgbCarouselModule,
    FileUploadModule,
    ArchwizardModule,
    DataTablesModule,
    NgbDropdownModule,
    NgbCarouselModule,
    NgbAccordionModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    TinymceModule,
    NgSelectModule,
    NgxSmoothDnDModule,
    NgxDocViewerModule,
    ProspectionRoutingModule,
    NgxPermissionsModule.forRoot(),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCR7wdbPJRZh49cZ5lq_LCw-Eb0CFNSCdI' }),

  ],
  exports: [
    AgentListComponent,
    ReservationListComponent,
    OffreListComponent,
    OffreTypeListComponent,
    ActivityAddComponent,
    RdvComponent,
    EtapeListComponent,
    ProspectionListComponent,
    ProspectionLocationComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class ProspectionModule { }
