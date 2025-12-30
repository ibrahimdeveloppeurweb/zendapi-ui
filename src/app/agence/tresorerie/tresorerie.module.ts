import { SelectModule } from 'ng-select';
import { ToastyModule } from 'ng2-toasty';
import { ChartModule } from 'angular2-chartjs';
import { CommonModule } from '@angular/common';
import { TextMaskModule } from 'angular2-text-mask';
import { ArchwizardModule } from 'angular-archwizard';
import { ClientModule } from '@client/client.module';
import { SharedModule } from '@shared/shared.module';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from "@angular/common/http";
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { LocataireModule } from '@locataire/locataire.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DemandeModule } from '@agence/demande/demande.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChantierModule } from '@agence/chantier/chantier.module';
import { AngularHighchartsChartModule } from 'angular-highcharts-chart';
import { ProprietaireModule } from '@proprietaire/proprietaire.module';
import { SpentAddComponent } from './spent/spent-add/spent-add.component';
import { SpentListComponent } from './spent/spent-list/spent-list.component';
import { SpentShowComponent } from './spent/spent-show/spent-show.component';
import { TresorerieRoutingModule } from '@tresorerie/tresorerie-routing.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { DayAddComponent } from '@agence/tresorerie/day/day-add/day-add.component';
import { DayEndComponent } from '@agence/tresorerie/day/day-end/day-end.component';
import { DayListComponent } from '@agence/tresorerie/day/day-list/day-list.component';
import { DayShowComponent } from '@agence/tresorerie/day/day-show/day-show.component';
import { SupplyAddComponent } from '@agence/tresorerie/supply/supply-add/supply-add.component';
import { SupplyListComponent } from '@agence/tresorerie/supply/supply-list/supply-list.component';
import { SupplyShowComponent } from '@agence/tresorerie/supply/supply-show/supply-show.component';
import { TreasuryAddComponent } from '@agence/tresorerie/treasury/treasury-add/treasury-add.component';
import { TreasuryListComponent } from '@agence/tresorerie/treasury/treasury-list/treasury-list.component';
import { TreasuryShowComponent } from '@agence/tresorerie/treasury/treasury-show/treasury-show.component';
import { ConfirmationAddComponent } from '@agence/tresorerie/confirmation/confirmation-add/confirmation-add.component';
import { NgbTooltipModule, NgbDatepickerModule, NgbDropdownModule, NgbCarouselModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { TransactionListComponent } from '@agence/tresorerie/transaction/transaction-list/transaction-list.component';
import { TransactionShowComponent } from '@agence/tresorerie/transaction/transaction-show/transaction-show.component';
import { TreasuryAccountStatementComponent } from '@agence/tresorerie/treasury/treasury-account-statement/treasury-account-statement.component';
import { SupplyWalletComponent } from './supply/supply-wallet/supply-wallet.component';
import { WithdrawalListComponent } from './wallet/withdrawal-list/withdrawal-list.component';
import { WithdrawalAddComponent } from './wallet/withdrawal-add/withdrawal-add.component';
import { WithdrawalShowComponent } from './wallet/withdrawal-show/withdrawal-show.component';
import { DepositAddComponent } from './wallet/deposit-add/deposit-add.component';
import { DepositListComponent } from './wallet/deposit-list/deposit-list.component';
import { DepositShowComponent } from './wallet/deposit-show/deposit-show.component'

@NgModule({
  declarations: [
    SupplyAddComponent,
    SupplyListComponent,
    SupplyShowComponent,
    ConfirmationAddComponent,
    DayAddComponent,
    DayListComponent,
    DayEndComponent,
    DayShowComponent,
    SpentAddComponent,
    SpentListComponent,
    SpentShowComponent,
    TreasuryAddComponent,
    TreasuryListComponent,
    TreasuryShowComponent,
    TransactionListComponent,
    TransactionShowComponent,
    TreasuryAccountStatementComponent,
    SupplyWalletComponent,
    WithdrawalListComponent,
    WithdrawalAddComponent,
    WithdrawalShowComponent,
    DepositAddComponent,
    DepositListComponent,
    DepositShowComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    AngularHighchartsChartModule,
    FormsModule,
    FileUploadModule,
    TextMaskModule,
    ToastyModule,
    NgbTabsetModule,
    NgbCarouselModule,
    TresorerieRoutingModule,
    SharedModule,
    FormsModule,
    DataTablesModule,
    ArchwizardModule,
    SelectModule,
    LocataireModule,
    ProprietaireModule,
    ClientModule,
    DemandeModule,
    ChantierModule,
    ChartModule,
    AngularDualListBoxModule,
    BsDatepickerModule.forRoot(),
    NgxPermissionsModule.forRoot()
  ],
  exports: [
    SpentListComponent,
    SupplyListComponent,
    WithdrawalListComponent,
  ], 
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class TresorerieModule { }
