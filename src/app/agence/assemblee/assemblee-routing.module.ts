import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssembleeListComponent } from './assemblee/assemblee-list/assemblee-list.component';

const routes: Routes = [
  {path: '', component: AssembleeListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssembleeRoutingModule { }
