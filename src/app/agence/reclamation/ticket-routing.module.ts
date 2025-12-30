
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicketListComponent } from '@reclamation/ticket/ticket-list/ticket-list.component';
import { TicketShowComponent } from '@reclamation/ticket/ticket-show/ticket-show.component';
import { ConfigurationComponent } from '@reclamation/configuration/configuration.component';


const routes: Routes = [
  { path: "", component: TicketListComponent },
  { path: "show/:id", component: TicketShowComponent },
  { path: "configuration", component: ConfigurationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketRoutingModule { }
