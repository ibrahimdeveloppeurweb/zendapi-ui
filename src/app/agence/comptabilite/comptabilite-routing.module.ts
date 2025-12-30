import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AchatComponent } from './achat/achat.component';
import { JournauxListComponent } from './journaux/journaux-list/journaux-list.component';
import { OperationListComponent } from './operation/operation-list/operation-list.component';

const routes: Routes = [
  {path: 'ventilation', component: OperationListComponent},
  {path: 'journaux', component: JournauxListComponent},
  {path: 'achat', component: AchatComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptabiliteRoutingModule { }
