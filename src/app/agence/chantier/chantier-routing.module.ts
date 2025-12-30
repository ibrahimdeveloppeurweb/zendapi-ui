import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConstructionListComponent } from '@chantier/construction/construction-list/construction-list.component';
import { ConstructionShowComponent } from '@chantier/construction/construction-show/construction-show.component';


const routes: Routes = [
  { path: "", component: ConstructionListComponent },
  { path: "show/:id", component: ConstructionShowComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChantierRoutingModule { }
