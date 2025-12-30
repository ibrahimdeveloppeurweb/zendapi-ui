import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { RateComponent } from '@modal/rate/rate.component';
import { UpdateComponent } from '@modal/update/update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenerationComponent } from './generation/generation.component';
import { ImportationComponent } from './importation/Importation.component';
import { NgbDatepickerModule, NgbTooltipModule, } from '@ng-bootstrap/ng-bootstrap';
import { AssignationTicketComponent } from './assignation-ticket/assignation-ticket.component';
import { SelectModule } from 'ng-select';
import { WalletUpgradeComponent } from './wallet-upgrade/wallet-upgrade.component';

@NgModule({
  declarations: [
    RateComponent,
    GenerationComponent,
    ImportationComponent,
    UpdateComponent,
    AssignationTicketComponent,
    WalletUpgradeComponent
  ],
  exports: [
    RateComponent,
    UpdateComponent,
    GenerationComponent,
    AssignationTicketComponent
  ],
  imports: [
    FormsModule,
    SharedModule,
    CommonModule,
    SelectModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    ReactiveFormsModule,
  ]
})
export class ModalModule { }
