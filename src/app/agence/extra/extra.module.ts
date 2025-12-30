import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendrierComponent } from '@extra/calendrier/calendrier.component';
import { MapsComponent } from '@extra/maps/maps.component';
import { ExtraRoutingModule } from '@extra/extra-routing.module';
import { SharedModule } from '@theme/shared/shared.module';
import {AgmCoreModule} from '@agm/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { SendComponent } from './send/send.component';
import { TinymceModule } from 'angular2-tinymce';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { OutilGanttComponent } from './outils/outil-gantt/outil-gantt.component';
import { OutilsComponent } from './outils/outils/outils.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GeoComponent } from './geo/geo.component';
import { FiltreComponent } from './geo/filtre/filtre.component';
import { ItemsComponent } from './geo/items/items.component';
import { ShowComponent } from './geo/show/show.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    CalendrierComponent,
    MapsComponent,
    SendComponent,
    OutilGanttComponent,
    OutilsComponent,
    GeoComponent,
    FiltreComponent,
    ItemsComponent,
    ShowComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ExtraRoutingModule,
    FullCalendarModule,
    TooltipModule,
    TinymceModule,
    NgbCollapseModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCR7wdbPJRZh49cZ5lq_LCw-Eb0CFNSCdI'}),
    NgSelectModule
  ],
  exports: [
    OutilGanttComponent,
    GeoComponent
  ],
  entryComponents: [
    OutilGanttComponent,
    GeoComponent,
    ShowComponent
  ],
})
export class ExtraModule { }
