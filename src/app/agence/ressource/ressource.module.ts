
import { CommonModule } from '@angular/common';
import { TinymceModule } from 'angular2-tinymce';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from '@theme/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RessourceRoutingModule } from './ressource-routing.module';
import { ConfigurationComponent } from './configuration/configuration.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { RessourceAddComponent } from './ressource/ressource-add/ressource-add.component';
import { RessourceListComponent } from './ressource/ressource-list/ressource-list.component';
import { RessourceShowComponent } from './ressource/ressource-show/ressource-show.component';
import {NgbNavModule, NgbTabsetModule, NgbDatepickerModule, NgbDropdownModule, NgbCarouselModule, NgbProgressbarModule, NgbCollapseModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { FamilleAddComponent } from './famille/famille-add/famille-add.component';
import { FamilleListComponent } from './famille/famille-list/famille-list.component';
import { FamilleShowComponent } from './famille/famille-show/famille-show.component';
import { SousFamilleAddComponent } from './sousFamille/sous-famille-add/sous-famille-add.component';
import { SousFamilleListComponent } from './sousFamille/sous-famille-list/sous-famille-list.component';
import { SousFamilleShowComponent } from './sousFamille/sous-famille-show/sous-famille-show.component';
import { RessourceAssignComponent } from './ressource/ressource-assign/ressource-assign.component';
import { RessourceHistoriqueComponent } from './ressource/ressource-historique/ressource-historique.component';
import { RessourceHorsUsageComponent } from './ressource-hors-usage/ressource-hors-usage.component';


@NgModule({
  declarations: [
    ConfigurationComponent,
    RessourceAddComponent,
    RessourceListComponent,
    RessourceShowComponent,
    FamilleAddComponent,
    FamilleListComponent,
    FamilleShowComponent,
    SousFamilleAddComponent,
    SousFamilleListComponent,
    SousFamilleShowComponent,
    RessourceAssignComponent,
    RessourceHistoriqueComponent,
    RessourceHorsUsageComponent,
  ],
  imports: [
    NgbModule,
    FormsModule,
    CommonModule,
    SharedModule,
    TinymceModule,
    NgSelectModule,
    DataTablesModule,
    RessourceRoutingModule,
    NgbDropdownModule,
    NgbCarouselModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgbProgressbarModule,
    NgbDatepickerModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgbTabsetModule,
    NgxPermissionsModule.forRoot()
  ],
  exports:[
    RessourceHistoriqueComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class RessourceModule { }
