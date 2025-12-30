import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from '@client/customer/customer-list/customer-list.component';
import { CustomerShowComponent } from '@client/customer/customer-show/customer-show.component';


const routes: Routes = [
  { path: "", component: CustomerListComponent },
  { path: "show/:id",  component: CustomerShowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
