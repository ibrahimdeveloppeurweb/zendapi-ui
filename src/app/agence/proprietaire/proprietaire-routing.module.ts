import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OwnerShowComponent } from '@proprietaire/owner/owner-show/owner-show.component';
import { OwnerListComponent } from '@proprietaire/owner/owner-list/owner-list.component';
import { HouseShowComponent } from '@proprietaire/house/house-show/house-show.component';


const routes: Routes = [
  { path: "", component: OwnerListComponent },
  { path: "show/:id", component: OwnerShowComponent },
  { path: "bien/show/:id", component: HouseShowComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProprietaireRoutingModule { }
