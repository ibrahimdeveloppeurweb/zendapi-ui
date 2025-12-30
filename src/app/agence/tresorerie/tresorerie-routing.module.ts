import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TreasuryListComponent } from '@agence/tresorerie/treasury/treasury-list/treasury-list.component';
import { TreasuryShowComponent } from '@agence/tresorerie/treasury/treasury-show/treasury-show.component';

const routes: Routes = [
  { path: "", component: TreasuryListComponent },
  { path: "show/:id", component: TreasuryShowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TresorerieRoutingModule { }
