import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SyndicRoutingModule } from './syndic-routing.module';
import { SyndicAddComponent } from './syndic/syndic-add/syndic-add.component';
import { SyndicListComponent } from './syndic/syndic-list/syndic-list.component';
import { SyndicShowComponent } from './syndic/syndic-show/syndic-show.component';
import { SyndicMandateAddComponent } from './syndic-mandate/syndic-mandate-add/syndic-mandate-add.component';
import { SyndicMandateListComponent } from './syndic-mandate/syndic-mandate-list/syndic-mandate-list.component';
import { SyndicMandateShowComponent } from './syndic-mandate/syndic-mandate-show/syndic-mandate-show.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from '@theme/shared/components';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { ToastyModule } from 'ng2-toasty';
import { NgbCarouselModule, NgbDatepickerModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@theme/shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { AgmCoreModule } from '@agm/core';
import { ProprietaireModule } from '@agence/proprietaire/proprietaire.module';
import { InfrastructureAddComponent } from './infrastructure/infrastructure-add/infrastructure-add.component';
import { InfrastructureListComponent } from './infrastructure/infrastructure-list/infrastructure-list.component';
import { InfrastructureShowComponent } from './infrastructure/infrastructure-show/infrastructure-show.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ExtraModule } from '@agence/extra/extra.module';
import { PrestataireModule } from '@agence/prestataire/prestataire.module';
import { ChantierModule } from '@agence/chantier/chantier.module';
import { FundsApealsListComponent } from './funds-apeals/funds-apeals-list/funds-apeals-list.component';
import { FundsApealsShowComponent } from './funds-apeals/funds-apeals-show/funds-apeals-show.component';
import { FundsNoticeListComponent } from './funds-notice/funds-notice-list/funds-notice-list.component';
import { FundsNoticeShowComponent } from './funds-notice/funds-notice-show/funds-notice-show.component';
import { FundsPaymentListComponent } from './funds-payment/funds-payment-list/funds-payment-list.component';
import { FundsPaymentShowComponent } from './funds-payment/funds-payment-show/funds-payment-show.component';
import { FundsPaymentAddComponent } from './funds-payment/funds-payment-add/funds-payment-add.component';
import { BudgetModule } from '@agence/budget/budget.module';
import { OwnerCoAddComponent } from './owner-co/owner-co-add/owner-co-add.component';
import { OwnerCoListComponent } from './owner-co/owner-co-list/owner-co-list.component';
import { OwnerCoShowComponent } from './owner-co/owner-co-show/owner-co-show.component';

import { SyndicCondominiumAddComponent } from './syndic-condominium/syndic-condominium-add/syndic-condominium-add.component';
import { SyndicCondominiumListComponent } from './syndic-condominium/syndic-condominium-list/syndic-condominium-list.component';
import { SyndicCondominiumShowComponent } from './syndic-condominium/syndic-condominium-show/syndic-condominium-show.component';
import { SyndicCondominiumShowItemComponent } from './syndic-condominium/syndic-condominium-show-item/syndic-condominium-show-item.component';
import { SyndicBudgetListComponent } from './syndic/syndic-budget-list/syndic-budget-list.component';
import { TypeLoadListComponent } from '../budget/type-load/type-load-list/type-load-list.component';
import { SyndicBudgetShowComponent } from './syndic/syndic-budget-show/syndic-budget-show.component';






@NgModule({
  declarations: [
    SyndicAddComponent,
    SyndicListComponent,
    SyndicShowComponent,
    SyndicMandateAddComponent,
    SyndicMandateListComponent,
    SyndicMandateShowComponent,
    InfrastructureAddComponent,
    InfrastructureListComponent,
    InfrastructureShowComponent,
    FundsApealsListComponent,
    FundsApealsShowComponent,
    FundsNoticeListComponent,
    FundsNoticeShowComponent,
    FundsPaymentListComponent,
    FundsPaymentShowComponent,
    FundsPaymentAddComponent,
    OwnerCoAddComponent,
    OwnerCoListComponent,
    OwnerCoShowComponent,
    SyndicCondominiumAddComponent,
    SyndicCondominiumListComponent,
    SyndicCondominiumShowComponent,
    SyndicCondominiumShowItemComponent,
    SyndicBudgetListComponent,
    SyndicBudgetShowComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    ExtraModule,
    ModalModule,
    SyndicRoutingModule,
    HttpClientModule,
    TextMaskModule,
    FormsModule,
    FileUploadModule,
    ToastyModule,
    NgbTabsetModule,
    NgbCarouselModule,
    DataTablesModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    BsDatepickerModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    NgxDocViewerModule,
    ProprietaireModule,
    PrestataireModule,
    ChantierModule,
    BudgetModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyCR7wdbPJRZh49cZ5lq_LCw-Eb0CFNSCdI' }),
  ],
  exports: [
    SyndicAddComponent,
    SyndicMandateAddComponent,
    SyndicMandateListComponent,
    SyndicMandateShowComponent,
    InfrastructureAddComponent,
    InfrastructureShowComponent,
    InfrastructureListComponent,
    FundsApealsListComponent,
    // FundsNoticeListC
    // 3
    // 
    // omponent,
    // FundsPaymentListComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class SyndicModule { }
