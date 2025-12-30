import { ToastyModule } from 'ng2-toasty';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { TextMaskModule } from 'angular2-text-mask';
import { ArchwizardModule } from 'angular-archwizard';
import { DataTablesModule } from 'angular-datatables';
import { NgxPermissionsModule } from 'ngx-permissions';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { SharedModule } from "@theme/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientRoutingModule } from '@client/client-routing.module';
import { FolderAddComponent } from '@client/folder/folder-add/folder-add.component';
import { MutateAddComponent } from '@client/mutate/mutate-add/mutate-add.component';
import { MutateListComponent } from '@client/mutate/mutate-list/mutate-list.component';
import { MutateShowComponent } from '@client/mutate/mutate-show/mutate-show.component';
import { FolderListComponent } from '@client/folder/folder-list/folder-list.component';
import { FolderShowComponent } from '@client/folder/folder-show/folder-show.component';
import { CustomerAddComponent } from '@client/customer/customer-add/customer-add.component';
import { CustomerShowComponent } from '@client/customer/customer-show/customer-show.component';
import { CustomerListComponent } from '@client/customer/customer-list/customer-list.component';
import { InvoiceCustomerListComponent } from './invoice/invoice-customer-list/invoice-customer-list.component';
import { InvoiceCustomerShowComponent } from './invoice/invoice-customer-show/invoice-customer-show.component';
import { PaymentCustomerAddComponent } from '@client/payment/payment-customer-add/payment-customer-add.component';
import { PaymentCustomerShowComponent } from '@client/payment/payment-customer-show/payment-customer-show.component';
import { PaymentCustomerListComponent } from '@client/payment/payment-customer-list/payment-customer-list.component';
import { FolderTerminateAddComponent } from '@client/folder-terminate/folder-terminate-add/folder-terminate-add.component';
import { FolderTerminateListComponent } from '@client/folder-terminate/folder-terminate-list/folder-terminate-list.component';
import { FolderTerminateShowComponent } from '@client/folder-terminate/folder-terminate-show/folder-terminate-show.component';
import { NgbCarouselModule, NgbDatepickerModule, NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivityAddComponent } from './activity/activity-add/activity-add.component';
import { ActivityListComponent } from './activity/activity-list/activity-list.component';
import { ActivityShowComponent } from './activity/activity-show/activity-show.component';
import { RdvComponent } from './activity/rdv/rdv.component';
import { TinymceModule } from 'angular2-tinymce';
import { TicketModule } from '@agence/reclamation/ticket.module';

@NgModule({
  declarations: [
    FolderAddComponent,
    MutateAddComponent,
    MutateListComponent,
    MutateShowComponent,
    FolderShowComponent,
    FolderListComponent,
    CustomerAddComponent,
    CustomerShowComponent,
    CustomerListComponent,
    FolderTerminateAddComponent,
    PaymentCustomerAddComponent,
    FolderTerminateListComponent,
    PaymentCustomerShowComponent,
    PaymentCustomerListComponent,
    FolderTerminateShowComponent,
    InvoiceCustomerListComponent,
    InvoiceCustomerShowComponent,
    ActivityAddComponent,
    ActivityListComponent,
    ActivityShowComponent,
    RdvComponent
  ],
  exports: [
    PaymentCustomerAddComponent,
    PaymentCustomerListComponent,
    ActivityListComponent,
    FolderListComponent,
    FolderTerminateListComponent,
    
  ],

  imports: [
    FormsModule,
    ToastyModule,
    SharedModule,
    CommonModule,
    TextMaskModule,
    NgbTabsetModule,
    NgbTooltipModule,
    FileUploadModule,
    ArchwizardModule,
    DataTablesModule,
    NgbDropdownModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    ClientRoutingModule,
    NgbDatepickerModule,
    NgxPermissionsModule.forRoot(),
    NgxDocViewerModule,
    TinymceModule,
    TicketModule
  ]
})
export class ClientModule { }
