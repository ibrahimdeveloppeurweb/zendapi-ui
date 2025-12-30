import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardGuard } from '@dashboard/dashboard.guard';
import { DashComponent } from '@dashboard/dash/dash.component';
import { DashCrmComponent } from './dash-crm/dash-crm.component';
import { DashDefaultComponent } from '@dashboard/dash-default/dash-default.component';
import { DashProspectionComponent } from './dash-prospection/dash-prospection.component';
import { DashPromotionComponent } from '@dashboard/dash-promotion/dash-promotion.component';
import { DashLocataireComponent } from '@dashboard/dash-locataire/dash-locataire.component';
import { DashLotissementComponent } from '@dashboard/dash-lotissement/dash-lotissement.component';
import { DashProprietaireComponent } from '@dashboard/dash-proprietaire/dash-proprietaire.component';
import { DashTicketComponent } from '@dashboard/dash-ticket/dash-ticket.component';
import { DashRessourceComponent } from'@dashboard/dash-ressource/dash-ressource.component';
import {DashWalletComponent} from "@dashboard/dash-wallet/dash-wallet.component";


const routes: Routes = [
  // { path: "principal", component: DashDefaultComponent },
  { path: "crm", component: DashCrmComponent },
  { path: "wallet", component: DashWalletComponent },
  { path: "principal", component: DashComponent },
  { path: "prospection", component: DashProspectionComponent },
  { path: "locataire", component: DashLocataireComponent, canActivate: [DashboardGuard] },
  { path: "promotion", component: DashPromotionComponent, canActivate: [DashboardGuard] },
  { path: "lotissement", component: DashLotissementComponent, canActivate: [DashboardGuard] },
  { path: "proprietaire", component: DashProprietaireComponent, canActivate: [DashboardGuard] },
  { path: "dash-ticket", component:  DashTicketComponent},
  { path: "dash-ressource", component:  DashRessourceComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
