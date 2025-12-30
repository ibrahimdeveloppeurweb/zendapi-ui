import { ProviderListComponent } from '@prestataire/provider/provider-list/provider-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProviderShowComponent } from './provider/provider-show/provider-show.component';


const routes: Routes = [
  { path: "", component: ProviderListComponent },
  { path: "show/:id", component: ProviderShowComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestataireRoutingModule { }
