import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './ticket/home/home.component';
import { AddComponent } from './ticket/add/add.component';
import { HistoriqueComponent } from './ticket/historique/historique.component';

const routes: Routes = [
  { path: "ticket", component: HomeComponent },
  { path: "ticket/create", component: AddComponent },
  { path: "ticket/historique", component: HistoriqueComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule { }
