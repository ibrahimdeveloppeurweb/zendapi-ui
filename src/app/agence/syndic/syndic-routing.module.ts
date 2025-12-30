import { CondominiumShowComponent } from '@agence/proprietaire/condominium/condominium-show/condominium-show.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SyndicListComponent } from './syndic/syndic-list/syndic-list.component';
import { SyndicShowComponent } from './syndic/syndic-show/syndic-show.component';
import { SyndicCondominiumShowItemComponent } from './syndic-condominium/syndic-condominium-show-item/syndic-condominium-show-item.component';
import { SyndicCondominiumShowComponent } from './syndic-condominium/syndic-condominium-show/syndic-condominium-show.component';
import { SyndicBudgetShowComponent } from './syndic/syndic-budget-show/syndic-budget-show.component';
import { OwnerCoShowComponent } from './owner-co/owner-co-show/owner-co-show.component';

const routes: Routes = [
  {path: '', component: SyndicListComponent},
  {path: "show/:id", component: SyndicShowComponent},
  { path: "copropriete/show/:id", component: SyndicCondominiumShowComponent },
  { path: "budget/show/:id", component: SyndicBudgetShowComponent },
  { path: "coproprietaire/show/:id", component: OwnerCoShowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SyndicRoutingModule { }
