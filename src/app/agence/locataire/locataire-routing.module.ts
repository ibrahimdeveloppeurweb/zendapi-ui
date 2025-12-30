import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TenantListComponent } from '@locataire/tenant/tenant-list/tenant-list.component';
import { TenantShowComponent } from './tenant/tenant-show/tenant-show.component';
import {ContractShowComponent} from '@locataire/contract/contract-show/contract-show.component';

const routes: Routes = [
  { path: "", component: TenantListComponent },
  { path: "show/:id", component: TenantShowComponent },
  { path: "contract/:id", component: ContractShowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocataireRoutingModule {

}

