import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RapportRoutingModule } from '@rapport/rapport-routing.module';
import { ReportOwnerComponent } from '@rapport/report-owner/report-owner.component';
import { ReportCustomerComponent } from '@rapport/report-customer/report-customer.component';
import { ReportTenantComponent } from '@rapport/report-tenant/report-tenant.component';
import { SharedModule } from '@theme/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ReportOwnerComponent,
    ReportCustomerComponent,
    ReportTenantComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RapportRoutingModule
  ]
})
export class RapportModule { }
