import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { LandingRoutingModule } from '@landing/landing-routing.module';
// import { SharedModule } from '@theme/shared/shared.module';
import {AgmCoreModule} from '@agm/core';
import { TinymceModule } from 'angular2-tinymce';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './ticket/home/home.component';
import { AddComponent } from './ticket/add/add.component';
import { HistoriqueComponent } from './ticket/historique/historique.component';
import { LandingComponent } from './landing.component';




@NgModule({
  declarations: [
    HomeComponent,
    AddComponent,
    HistoriqueComponent,
    LandingComponent
  ],
  imports: [
    CommonModule,
    // SharedModule,
    ReactiveFormsModule,
    FormsModule,
    // LandingRoutingModule,
    TooltipModule,
    TinymceModule,
    NgbCollapseModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCR7wdbPJRZh49cZ5lq_LCw-Eb0CFNSCdI'}),
    NgSelectModule
  ],
  exports: [
  ],
  entryComponents: [
  ],
})
export class LandingModule { }
