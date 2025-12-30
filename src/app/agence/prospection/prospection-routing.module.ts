import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParametreComponent } from './parametre/parametre.component';
import { AgentShowComponent } from './agent/agent-show/agent-show.component';
import { OffreShowComponent } from './offre/offre-show/offre-show.component';
import { ProspectionListComponent } from './prospection/prospection-list/prospection-list.component';
import { ProspectionShowComponent } from './prospection/prospection-show/prospection-show.component';
import { ReservationShowComponent } from './reservation/reservation-show/reservation-show.component';
import { ProspectionLocationComponent } from './prospection/prospection-location/prospection-location.component';

const routes: Routes = [
  { path: "vente", component: ProspectionListComponent },
  { path: "location", component: ProspectionLocationComponent },
  { path: "parametre", component: ParametreComponent },
  { path: "show/:id", component: ProspectionShowComponent },
  { path: "agent/show/:id", component: AgentShowComponent },
  { path: "offre/show/:id", component: OffreShowComponent },
  { path: "reservation/show/:id", component: ReservationShowComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProspectionRoutingModule { }
