import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BudgetRoutingModule } from './budget-routing.module';
import { TypeLoadListComponent } from './type-load/type-load-list/type-load-list.component';
import { TypeLoadAddComponent } from './type-load/type-load-add/type-load-add.component';
import { TypeLoadShowComponent } from './type-load/type-load-show/type-load-show.component';
import { BudgetListComponent } from './budget/budget-list/budget-list.component';
import { BudgetShowComponent } from './budget/budget-show/budget-show.component';
import { BudgetAddComponent } from './budget/budget-add/budget-add.component';

import { SharedModule } from '@theme/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ExtraModule } from '../extra/extra.module';
import { ModalModule } from '@theme/shared/components';
import { NgbCarouselModule, NgbDropdownModule, NgbPopoverModule, NgbProgressbarModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { BudgetDevelopComponent } from './budget/budget-develop/budget-develop.component';
import { BudgetEtatBudgetaireComponent } from './budget/budget-etat-budgetaire/budget-etat-budgetaire.component';
import { AngularHighchartsChartModule } from 'angular-highcharts-chart';
import { ChartModule } from 'angular2-chartjs';
import { BudgetEtatFinancierComponent } from './budget/budget-etat-financier/budget-etat-financier.component';
import { SyndicModule } from '../syndic/syndic.module';

@NgModule({
  declarations: [
    TypeLoadListComponent,
    TypeLoadAddComponent,
    TypeLoadShowComponent,
    BudgetListComponent,
    BudgetShowComponent,
    BudgetAddComponent,
    BudgetDevelopComponent,
    BudgetEtatBudgetaireComponent,
    BudgetEtatFinancierComponent
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    ExtraModule,
    ModalModule,
    BudgetRoutingModule,
    RouterModule,
    NgbTooltipModule,
    NgbPopoverModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    NgbTabsetModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    HttpClientModule,
    ChartModule,
    NgbCarouselModule,
    NgxPermissionsModule.forRoot(),
    AngularHighchartsChartModule,
    AgmCoreModule.forRoot({apiKey: 'AIzaSyCR7wdbPJRZh49cZ5lq_LCw-Eb0CFNSCdI'}),
  ],
  exports: [
    BudgetListComponent,
    TypeLoadListComponent
  ]
})
export class BudgetModule {}
