import { NgModule } from '@angular/core';
import { GeoComponent } from '@extra/geo/geo.component';
import { SendComponent } from './send/send.component';
import { Routes, RouterModule } from '@angular/router';
import { MapsComponent } from '@extra/maps/maps.component';
import { CalendrierComponent } from '@extra/calendrier/calendrier.component';
import { OutilGanttComponent } from './outils/outil-gantt/outil-gantt.component';

const routes: Routes = [
  { path: "maps", component: MapsComponent },
  { path: "send", component: SendComponent },
  { path: "geo-localisation/:id/:type/:mode", component: GeoComponent},
  { path: "calendrier", component: CalendrierComponent },
  { path: "gantt/:id/:type", component: OutilGanttComponent}
  // { path: "send/read", component: SendShowComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraRoutingModule { }
