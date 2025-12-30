import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbDatepickerModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { TextMaskModule } from 'angular2-text-mask';
import { ToastyModule } from 'ng2-toasty';
import { ArchwizardModule } from 'angular-archwizard';
import { DataTablesModule } from 'angular-datatables';
import { SharedModule } from "@theme/shared/shared.module";
import { ChantierRoutingModule } from '@chantier/chantier-routing.module';
import { ConstructionAddComponent } from '@chantier/construction/construction-add/construction-add.component';
import { ConstructionListComponent } from '@chantier/construction/construction-list/construction-list.component';
import { QuoteListComponent } from '@chantier/quote/quote-list/quote-list.component';
import { QuoteAddComponent } from '@chantier/quote/quote-add/quote-add.component';
import { FundingListComponent } from '@chantier/funding/funding-list/funding-list.component';
import { FundingAddComponent } from '@chantier/funding/funding-add/funding-add.component';
import { ProductionListComponent } from '@chantier/production/production-list/production-list.component';
import { ProductionAddComponent } from '@chantier/production/production-add/production-add.component';
import { ConstructionShowComponent } from '@chantier/construction/construction-show/construction-show.component';
import { QuoteShowComponent } from '@chantier/quote/quote-show/quote-show.component';
import { FundingShowComponent } from '@chantier/funding/funding-show/funding-show.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ProductionShowComponent } from '@chantier/production/production-show/production-show.component';
import { PaymentFundingAddComponent } from '@chantier/payment/payment-funding-add/payment-funding-add.component';
import { PaymentFundingListComponent } from './payment/payment-funding-list/payment-funding-list.component';
import { PaymentFundingShowComponent } from './payment/payment-funding-show/payment-funding-show.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InvoiceCoListComponent } from './invoice-co/invoice-co-list/invoice-co-list.component';
import { InvoiceCoAddComponent } from './invoice-co/invoice-co-add/invoice-co-add.component';
import { InvoiceCoShowComponent } from './invoice-co/invoice-co-show/invoice-co-show.component';
import { InvoicePaymentAddComponent } from './invoice-payment/invoice-payment-add/invoice-payment-add.component';
import { InvoicePaymentListComponent } from './invoice-payment/invoice-payment-list/invoice-payment-list.component';
import { InvoicePaymentShowComponent } from './invoice-payment/invoice-payment-show/invoice-payment-show.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ConstructionTableComponent } from './construction/construction-table/construction-table.component';
import { QuoteOwnerAddComponent } from './quote-owner/quote-owner-add/quote-owner-add.component';
import { QuoteOwnerListComponent } from './quote-owner/quote-owner-list/quote-owner-list.component';
import { QuoteOwnerShowComponent } from './quote-owner/quote-owner-show/quote-owner-show.component';
import { InvoiceOwnerListComponent } from './invoice-owner/invoice-owner-list/invoice-owner-list.component';
import { InvoiceOwnerAddComponent } from './invoice-owner/invoice-owner-add/invoice-owner-add.component';
import { InvoiceOwnerShowComponent } from './invoice-owner/invoice-owner-show/invoice-owner-show.component';

@NgModule({
  declarations: [
    ConstructionAddComponent,
    ConstructionListComponent,
    QuoteListComponent,
    QuoteAddComponent,
    FundingListComponent,
    FundingAddComponent,
    ProductionListComponent,
    ProductionAddComponent,
    ConstructionShowComponent,
    QuoteShowComponent,
    FundingShowComponent,
    ProductionShowComponent,
    PaymentFundingAddComponent,
    PaymentFundingListComponent,
    PaymentFundingShowComponent,
    InvoiceCoAddComponent,
    InvoiceCoListComponent,
    InvoiceCoShowComponent,
    InvoicePaymentAddComponent,
    InvoicePaymentListComponent,
    InvoicePaymentShowComponent,
    ConstructionTableComponent,
    QuoteOwnerAddComponent,
    QuoteOwnerListComponent,
    QuoteOwnerShowComponent,
    InvoiceOwnerListComponent,
    InvoiceOwnerAddComponent,
    InvoiceOwnerShowComponent,
  ],
  exports: [
    PaymentFundingAddComponent,
    PaymentFundingListComponent,
    QuoteListComponent,
    InvoiceCoListComponent,
    InvoicePaymentListComponent,
    ConstructionListComponent,
    ConstructionTableComponent
  ],
  imports: [
    CommonModule,
    ChantierRoutingModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    NgbTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    FileUploadModule,
    TextMaskModule,
    ToastyModule,
    NgbTabsetModule,
    NgbCarouselModule,
    ArchwizardModule,
    SharedModule,
    DataTablesModule,
    NgxDocViewerModule,
    NgxPermissionsModule.forRoot(),
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    })
  ]
})
export class ChantierModule { }
