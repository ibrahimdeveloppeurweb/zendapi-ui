import { SubdivisionListComponent } from '@lotissement/subdivision/subdivision-list/subdivision-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubdivisionShowComponent } from './subdivision/subdivision-show/subdivision-show.component';
import { LotShowComponent } from './lot/lot-show/lot-show.component';

const routes: Routes = [
  { path: '', component: SubdivisionListComponent },
  { path: "show/:id", component: SubdivisionShowComponent },
  { path: "lot/show/:id", component: LotShowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LotissementRoutingModule { }
