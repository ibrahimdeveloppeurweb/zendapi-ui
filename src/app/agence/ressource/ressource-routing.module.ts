
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConfigurationComponent } from './configuration/configuration.component';
import { RessourceListComponent } from './ressource/ressource-list/ressource-list.component';
import { RessourceShowComponent } from './ressource/ressource-show/ressource-show.component';

const routes: Routes = [
  { path: '', component: RessourceListComponent },
  { path: "show/:id", component: RessourceShowComponent },
  { path: 'configuration', component: ConfigurationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RessourceRoutingModule { }
