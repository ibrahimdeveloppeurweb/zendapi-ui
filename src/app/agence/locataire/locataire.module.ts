import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToastyModule} from 'ng2-toasty';
import {TextMaskModule} from 'angular2-text-mask';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {HttpClientModule} from '@angular/common/http';
import { NgbTooltipModule, NgbDatepickerModule, NgbDropdownModule, NgbCarouselModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

import {LocataireRoutingModule} from '@locataire/locataire-routing.module';
import {ContractAddComponent} from '@locataire/contract/contract-add/contract-add.component';
import {ContractListComponent} from '@locataire/contract/contract-list/contract-list.component';
import {TenantAddComponent} from '@locataire/tenant/tenant-add/tenant-add.component';
import {TenantListComponent} from '@locataire/tenant/tenant-list/tenant-list.component';
import {ModalModule} from '@modal/modal.module';
import {SharedModule} from '@shared/shared.module';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DataTablesModule} from 'angular-datatables';
import {ArchwizardModule} from 'angular-archwizard';
import {SelectModule} from 'ng-select';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {RentAddComponent} from '@locataire/rent/rent-add/rent-add.component';
import {PaymentAddComponent} from '@locataire/payment/payment-add/payment-add.component';
import {PaymentListComponent} from '@locataire/payment/payment-list/payment-list.component';
import {RentListComponent} from '@locataire/rent/rent-list/rent-list.component';
import {InventoryAddComponent} from '@locataire/inventory/inventory-add/inventory-add.component';
import {InventoryListComponent} from '@locataire/inventory/inventory-list/inventory-list.component';
import {PenalityAddComponent} from '@locataire/penalty/penality-add/penality-add.component';
import {PenalityListComponent} from '@locataire/penalty/penality-list/penality-list.component';
import {NoticeListComponent} from '@locataire/notice/notice-list/notice-list.component';
import {TerminateAddComponent} from '@locataire/terminate/terminate-add/terminate-add.component';
import {PaymentShowComponent} from '@locataire/payment/payment-show/payment-show.component';
import {TenantShowComponent} from '@locataire/tenant/tenant-show/tenant-show.component';
import {ContractShowComponent} from '@locataire/contract/contract-show/contract-show.component';
import {EntranceInvoiceListComponent} from '@locataire/entrance-invoice/entrance-invoice-list/entrance-invoice-list.component';
import {RentShowComponent} from '@locataire/rent/rent-show/rent-show.component';
import {PenalityShowComponent} from '@locataire/penalty/penality-show/penality-show.component';
import {NoticeShowComponent} from '@locataire/notice/notice-show/notice-show.component';
import {EntranceInvoiceShowComponent} from './entrance-invoice/entrance-invoice-show/entrance-invoice-show.component';
import {TerminateListComponent} from '@locataire/terminate/terminate-list/terminate-list.component';
import {TerminateShowComponent} from '@locataire/terminate/terminate-show/terminate-show.component';
import {InvoiceAddComponent} from '@locataire/invoice/invoice-add/invoice-add.component';
import { InvoiceListComponent } from '@locataire/invoice/invoice-list/invoice-list.component';
import { InvoiceShowComponent } from '@locataire/invoice/invoice-show/invoice-show.component';
import { RenewContractAddComponent } from '@locataire/renew-contract/renew-contract-add/renew-contract-add.component';
import { RenewContractListComponent } from '@locataire/renew-contract/renew-contract-list/renew-contract-list.component';
import { RenewContractShowComponent } from '@locataire/renew-contract/renew-contract-show/renew-contract-show.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import { InventoryShowComponent } from '@locataire/inventory/inventory-show/inventory-show.component';
import { ContractUploadComponent } from '@locataire/contract/contract-upload/contract-upload.component';
import { InventoryUploadComponent } from '@locataire/inventory/inventory-upload/inventory-upload.component';
import { NoticeAddComponent } from '@locataire/notice/notice-add/notice-add.component';
import { ShortContractAddComponent } from './short-contract/short-contract-add/short-contract-add.component';
import { ShortContractListComponent } from './short-contract/short-contract-list/short-contract-list.component';
import { ShortContractShowComponent } from './short-contract/short-contract-show/short-contract-show.component';
import { ExtendAddComponent } from './extend-contract/extend-add/extend-add.component';
import { ExtendListComponent } from './extend-contract/extend-list/extend-list.component';
import { ExtendShowComponent } from './extend-contract/extend-show/extend-show.component';
import { ActivityShowComponent } from './activity/activity-show/activity-show.component';
import { ActivityListComponent } from './activity/activity-list/activity-list.component';
import { ActivityAddComponent } from './activity/activity-add/activity-add.component';
import { TinymceModule } from 'angular2-tinymce';
import { TicketModule } from '@agence/reclamation/ticket.module';
import { RenewPaymentListComponent } from './payment/renew-payment-list/renew-payment-list.component';
import { RenewPaymentShowComponent } from './payment/renew-payment-show/renew-payment-show.component';
import { InventoryModelAddComponent } from '@locataire/inventory-model/inventory-model-add/inventory-model-add.component';
import { InventoryModelListComponent } from '@locataire/inventory-model/inventory-model-list/inventory-model-list.component';
import { InventoryModelShowComponent } from '@locataire/inventory-model/inventory-model-show/inventory-model-show.component';
import { ToastrModule } from 'ngx-toastr';
import {
  GroupedContractAddComponent
} from '@locataire/grouped-contract/grouped-contract-add/grouped-contract-add.component';
import {
  GroupedContractListComponent
} from '@locataire/grouped-contract/grouped-contract-list/grouped-contract-list.component';



@NgModule({
  declarations: [
    ContractAddComponent,
    ContractListComponent,
    TenantAddComponent,
    TenantListComponent,
    RentAddComponent,
    PaymentAddComponent,
    PaymentListComponent,
    RentListComponent,
    InventoryAddComponent,
    InventoryListComponent,
    InventoryShowComponent,
    PenalityAddComponent,
    PenalityListComponent,
    NoticeListComponent,
    NoticeShowComponent,
    NoticeAddComponent,
    TerminateAddComponent,
    ContractShowComponent,
    PaymentShowComponent,
    TenantShowComponent,
    EntranceInvoiceListComponent,
    RentShowComponent,
    PenalityShowComponent,
    EntranceInvoiceShowComponent,
    TerminateListComponent,
    TerminateShowComponent,
    InvoiceAddComponent,
    InvoiceListComponent,
    InvoiceShowComponent,
    RenewContractAddComponent,
    RenewContractListComponent,
    RenewContractShowComponent,
    ContractUploadComponent,
    InventoryUploadComponent,
    ShortContractAddComponent,
    ShortContractListComponent,
    ShortContractShowComponent,
    ExtendAddComponent,
    ExtendListComponent,
    ExtendShowComponent,
    ActivityShowComponent,
    ActivityListComponent,
    ActivityAddComponent,
    RenewPaymentListComponent,
    RenewPaymentShowComponent,
    InventoryModelAddComponent,
    InventoryModelListComponent,
    InventoryModelShowComponent,
    GroupedContractAddComponent,
    GroupedContractListComponent
  ],
  exports: [
    PaymentAddComponent,
    PaymentListComponent,
    ActivityListComponent,
    ContractListComponent,
    TerminateListComponent,
    RenewContractListComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ModalModule,
    FormsModule,
    FileUploadModule,
    TextMaskModule,
    ToastyModule,
    NgbTabsetModule,
    NgbCarouselModule,
    LocataireRoutingModule,
    SharedModule,
    DataTablesModule,
    ArchwizardModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    BsDatepickerModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    NgxDocViewerModule,
    TinymceModule,
    TicketModule,
    ToastrModule.forRoot()
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class LocataireModule {
}
