import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssembleeRoutingModule } from './assemblee-routing.module';
import { AssembleeAddComponent } from './assemblee/assemblee-add/assemblee-add.component';
import { AssembleeListComponent } from './assemblee/assemblee-list/assemblee-list.component';
import { AssembleeShowComponent } from './assemblee/assemblee-show/assemblee-show.component';


@NgModule({
  declarations: [
    AssembleeAddComponent,
    AssembleeListComponent,
    AssembleeShowComponent
  ],
  imports: [
    CommonModule,
    AssembleeRoutingModule
  ]
})
export class AssembleeModule { }
