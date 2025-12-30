import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportCustomerComponent } from '@rapport/report-customer/report-customer.component';
import { ReportOwnerComponent } from '@rapport/report-owner/report-owner.component';
import { ReportTenantComponent } from '@rapport/report-tenant/report-tenant.component';
import { RapportGuard } from '@rapport/rapport.guard';

const routes: Routes = [
  { path: "proprietaire", component: ReportOwnerComponent, canActivate: [RapportGuard] },
  { path: "locataire", component: ReportTenantComponent, canActivate: [RapportGuard] },
  { path: "client", component: ReportCustomerComponent, canActivate: [RapportGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportRoutingModule { }
