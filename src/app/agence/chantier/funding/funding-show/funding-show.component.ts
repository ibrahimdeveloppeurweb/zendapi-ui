import { FundingAddComponent } from '@chantier/funding/funding-add/funding-add.component';
import { Component, OnInit } from '@angular/core';
import { Funding } from '@model/funding';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FundingService } from '@service/funding/funding.service';
import { Globals } from '@theme/utils/globals';
import { VALIDATION } from '@theme/utils/functions';

@Component({
  selector: 'app-funding-show',
  templateUrl: './funding-show.component.html',
  styleUrls: ['./funding-show.component.scss']
})
export class FundingShowComponent implements OnInit {
  title: string = ""
  funding: Funding
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  validation = VALIDATION

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private fundingService: FundingService
  ) {
    this.funding = this.fundingService.getFunding()
    this.title = "Détails sur le financement de l'intervention " + this.funding.construction?.nom
  }

  ngOnInit(): void {
  }

  editFunding(row) {
    this.fundingService.setFunding(row)
    this.fundingService.edit = true
    this.modal(FundingAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerFunding(row): void {
    this.fundingService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
}
