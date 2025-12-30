

import { LOCALE_ID } from '@angular/core';
import {ChartModule} from 'angular2-chartjs';
import { CommonModule } from '@angular/common';
import { ClientModule } from '@client/client.module';
import { SharedModule } from "@theme/shared/shared.module";
import { ValidationComponent } from './validation.component';
import { LocataireModule } from '@locataire/locataire.module';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {AngularHighchartsChartModule} from 'angular-highcharts-chart';
import { ValidationRoutingModule } from './validation-routing.module';
import { ProprietaireModule } from '@proprietaire/proprietaire.module';
import { TresorerieModule } from '@tresorerie/tresorerie.module';
import { DemandeModule } from '@demande/demande.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { ValidationAddComponent } from './validation-add/validation-add.component';


@NgModule({
  declarations: [ValidationComponent, ValidationAddComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ChartModule,
    ClientModule,
    DemandeModule,
    LocataireModule,
    ProprietaireModule,
    TresorerieModule,
    ReactiveFormsModule,
    ValidationRoutingModule,
    AngularDualListBoxModule,
    AngularHighchartsChartModule,
  ],
  providers: [ { provide: LOCALE_ID, useValue: "fr-FR" }],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class ValidationModule { }
