import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BudgetListComponent } from './budget/budget-list/budget-list.component';
import { BudgetShowComponent } from './budget/budget-show/budget-show.component';
import { TypeLoadListComponent } from './type-load/type-load-list/type-load-list.component';

const routes: Routes = [
  {path: '', component: BudgetListComponent},
  { path: "show/:id", component: BudgetShowComponent },
  {path: 'charge', component: TypeLoadListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BudgetRoutingModule { }
