import { AgmCoreModule } from '@agm/core';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { ToastyModule } from 'ng2-toasty';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import { DataTablesModule } from 'angular-datatables';
import { ArchwizardModule } from 'angular-archwizard';
import { HttpClientModule } from "@angular/common/http";
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { SharedModule } from "@theme/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ProprietaireRoutingModule } from '@proprietaire/proprietaire-routing.module';
import { OwnerAddComponent } from '@proprietaire/owner/owner-add/owner-add.component';
import { HouseAddComponent } from '@proprietaire/house/house-add/house-add.component';
import { HouseShowComponent } from '@proprietaire/house/house-show/house-show.component';
import { OwnerShowComponent } from '@proprietaire/owner/owner-show/owner-show.component';
import { OwnerListComponent } from '@proprietaire/owner/owner-list/owner-list.component';
import { HouseListComponent } from '@proprietaire/house/house-list/house-list.component';
import { RentalAddComponent } from '@proprietaire/rental/rental-add/rental-add.component';
import { RentalShowComponent } from '@proprietaire/rental/rental-show/rental-show.component';
import { RentalListComponent } from '@proprietaire/rental/rental-list/rental-list.component';
import { MandateAddComponent } from '@proprietaire/mandate/mandate-add/mandate-add.component';
import { MandateListComponent } from '@proprietaire/mandate/mandate-list/mandate-list.component';
import { MandateShowComponent } from '@proprietaire/mandate/mandate-show/mandate-show.component';
import { RepaymentAddComponent } from '@proprietaire/repayment/repayment-add/repayment-add.component';
import { RepaymentShowComponent } from '@proprietaire/repayment/repayment-show/repayment-show.component';
import { RepaymentListComponent } from '@proprietaire/repayment/repayment-list/repayment-list.component';
import { RenewMandateShowComponent } from '@proprietaire/renew-mandate/renew-mandate-show/renew-mandate-show.component';
import { RenewMandateListComponent } from '@proprietaire/renew-mandate/renew-mandate-list/renew-mandate-list.component';
import { RenewMandateAddComponent } from '@agence/proprietaire/renew-mandate/renew-mandate-add/renew-mandate-add.component';
import { PaymentRepaymentAddComponent } from '@proprietaire/payment/payment-repayment-add/payment-repayment-add.component';
import { PaymentRepaymentListComponent } from '@proprietaire/payment/payment-repayment-list/payment-repayment-list.component';
import { NgbTooltipModule, NgbDatepickerModule, NgbDropdownModule, NgbCarouselModule, NgbTabsetModule, NgbProgressbarModule, NgbCollapseModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentRepaymentShowComponent } from './payment/payment-repayment-show/payment-repayment-show.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MandateUploadComponent } from '@proprietaire/mandate/mandate-upload/mandate-upload.component';
import { TerminateMandateAddComponent } from "@proprietaire/terminate-mandate/terminate-mandate-add/terminate-mandate-add.component";
import { TerminateMandateListComponent } from '@proprietaire/terminate-mandate/terminate-mandate-list/terminate-mandate-list.component';
import { TerminateMandateShowComponent } from '@proprietaire/terminate-mandate/terminate-mandate-show/terminate-mandate-show.component';
import { EquipmentAddComponent } from './equipment/equipment-add/equipment-add.component';
import { EquipmentListComponent } from './equipment/equipment-list/equipment-list.component';
import { EquipmentShowComponent } from './equipment/equipment-show/equipment-show.component';
import { PieceAddComponent } from './piece/piece-add/piece-add.component';
import { PieceListComponent } from './piece/piece-list/piece-list.component';
import { PieceShowComponent } from './piece/piece-show/piece-show.component';
import { AttributionComponent } from './attribution/attribution.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { ActivityAddComponent } from './activity/activity-add/activity-add.component';
import { ActivityListComponent } from './activity/activity-list/activity-list.component';
import { ActivityShowComponent } from './activity/activity-show/activity-show.component';
import { RdvComponent } from './activity/rdv/rdv.component';
import { TinymceModule } from 'angular2-tinymce';
import { OwnerCommitteeComponent } from './owner/owner-committee/owner-committee.component';
import { CondominiumAddComponent } from './condominium/condominium-add/condominium-add.component';
import { CondominiumListComponent } from './condominium/condominium-list/condominium-list.component';
import { CondominiumShowComponent } from './condominium/condominium-show/condominium-show.component';
import { CondominiumShowItemComponent } from './condominium/condominium-show-item/condominium-show-item.component';
import { TicketModule } from '@agence/reclamation/ticket.module';
import { OwnerWalletComponent } from './owner/owner-wallet/owner-wallet.component';
import { AngularHighchartsChartModule } from 'angular-highcharts-chart';
import { OwnerWithdrawllComponent } from './owner/owner-withdrawll/owner-withdrawll.component';
import { OwnerReleveComponent } from './owner/owner-releve/owner-releve.component';
import { OwnerDepositComponent } from './owner/owner-deposit/owner-deposit.component';
import { HouseShareComponent } from './house/house-share/house-share.component';
import { RepayAddComponent } from './repay/repay-add/repay-add.component';
import { RentalBlockAddComponent } from './rental-block-add/rental-block-add.component';
import { RepaymentNotificationsModalComponent } from './repayment-notifications/repayment-notifications-modal.component';
@NgModule({
  declarations: [
    OwnerAddComponent,
    HouseAddComponent,
    HouseShowComponent,
    OwnerListComponent,
    OwnerShowComponent,
    HouseListComponent,
    RentalAddComponent,
    RentalShowComponent,
    RentalListComponent,
    MandateAddComponent,
    MandateListComponent,
    MandateShowComponent,
    RepaymentAddComponent,
    RepaymentListComponent,
    RepaymentShowComponent,
    RenewMandateAddComponent,
    RenewMandateListComponent,
    RenewMandateShowComponent,
    PaymentRepaymentAddComponent,
    PaymentRepaymentListComponent,
    PaymentRepaymentShowComponent,
    MandateUploadComponent,
    TerminateMandateAddComponent,
    TerminateMandateListComponent,
    TerminateMandateShowComponent,
    EquipmentAddComponent,
    EquipmentListComponent,
    EquipmentShowComponent,
    PieceAddComponent,
    PieceListComponent,
    PieceShowComponent,
    AttributionComponent,
    ActivityAddComponent,
    ActivityListComponent,
    ActivityShowComponent,
    RdvComponent,
    OwnerCommitteeComponent,
    CondominiumAddComponent,
    CondominiumListComponent,
    CondominiumShowComponent,
    CondominiumShowItemComponent,
    OwnerWalletComponent,
    OwnerWithdrawllComponent,
    OwnerReleveComponent,
    OwnerDepositComponent,
    HouseShareComponent,
    RepayAddComponent,
    RentalBlockAddComponent,
    RepaymentNotificationsModalComponent,
  ],
  exports: [
    RepaymentAddComponent,
    RepaymentListComponent,
    HouseAddComponent,
    PaymentRepaymentAddComponent,
    PaymentRepaymentListComponent,
    TerminateMandateAddComponent,
    TerminateMandateListComponent,
    TerminateMandateShowComponent,
    ActivityListComponent,
    MandateListComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ToastyModule,
    SharedModule,
    TextMaskModule,
    NgbTabsetModule,
    HttpClientModule,
    NgbTooltipModule,
    FileUploadModule,
    ArchwizardModule,
    DataTablesModule,
    NgbDropdownModule,
    NgbCarouselModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    AngularDualListBoxModule,
    ProprietaireRoutingModule,
    NgxPermissionsModule.forRoot(),
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCR7wdbPJRZh49cZ5lq_LCw-Eb0CFNSCdI' }),
    NgxDocViewerModule,
    TinymceModule,
    TicketModule,
    AngularHighchartsChartModule
  ],
  providers: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ProprietaireModule { }
