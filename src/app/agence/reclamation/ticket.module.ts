import { CommonModule } from '@angular/common';
import { TinymceModule } from 'angular2-tinymce';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@theme/shared/shared.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChatAddComponent } from './chat/chat-add/chat-add.component';
import { TicketRoutingModule } from '@reclamation/ticket-routing.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { TicketShowComponent } from './ticket/ticket-show/ticket-show.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CategoryAddComponent } from './category/category-add/category-add.component';
import { TicketAddComponent } from '@reclamation/ticket/ticket-add/ticket-add.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { ProcedureAddComponent } from './procedure/procedure-add/procedure-add.component';
import { TicketListComponent } from '@reclamation/ticket/ticket-list/ticket-list.component';
import { ProcedureListComponent } from './procedure/procedure-list/procedure-list.component';
import { ProcedureShowComponent } from './procedure/procedure-show/procedure-show.component';
import {NgbNavModule, NgbTabsetModule, NgbDatepickerModule, NgbDropdownModule, NgbCarouselModule, NgbProgressbarModule, NgbCollapseModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ProcedureItemComponent } from './procedure/procedure-item/procedure-item.component';
import { EtapeAddComponent } from './etape/etape-add/etape-add.component';
import { EtapeListComponent } from './etape/etape-list/etape-list.component';
import { QualificationShowComponent } from './qualification/qualification-show/qualification-show.component';
import { QualificationAddComponent } from './qualification/qualification-add/qualification-add.component';
import { QualificationListComponent } from './qualification/qualification-list/qualification-list.component';
import { TicketTableComponent } from './ticket/ticket-table/ticket-table.component';
import { CategoryShowComponent } from './category/category-show/category-show.component';
import { RapportComponent } from './ticket/rapport/rapport.component';
import { NoteComponent } from './ticket/note/note.component';
import { ChantierModule } from '@agence/chantier/chantier.module';
import { NoteListComponent } from './ticket/note-list/note-list.component';
import { NoteShowComponent } from './ticket/note-show/note-show.component';
import { RessourceModule } from '@agence/ressource/ressource.module';



@NgModule({
  declarations: [
    ChatAddComponent,
    TicketAddComponent,
    TicketListComponent,
    TicketShowComponent,
    CategoryAddComponent,
    CategoryListComponent,
    ConfigurationComponent,
    ProcedureAddComponent,
    ProcedureShowComponent,
    ProcedureListComponent,
    ProcedureItemComponent,
    EtapeAddComponent,
    EtapeListComponent,
    QualificationShowComponent,
    QualificationAddComponent,
    QualificationListComponent,
    TicketTableComponent,
    CategoryShowComponent,
    RapportComponent,
    NoteComponent,
    NoteListComponent,
    NoteShowComponent
  ],
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    SharedModule,
    TinymceModule,
    NgSelectModule,
    TicketRoutingModule,
    NgbDropdownModule,
    NgbCarouselModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgbTabsetModule,
    FullCalendarModule,    
    NgxPermissionsModule.forRoot(),
    ChantierModule,
    RessourceModule
  ],
  exports:[
    TicketTableComponent

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class TicketModule { }
