import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { FundRequest } from '@model/fund-request';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FundRequestService } from '@service/fund-request/fund-request.service';
import { FundRequestAddComponent } from '@demande/fund-request-add/fund-request-add.component';

@Component({
  selector: 'app-fund-request-show',
  templateUrl: './fund-request-show.component.html',
  styleUrls: ['./fund-request-show.component.scss']
})
export class FundRequestShowComponent implements OnInit {
  title: string = ""
  fund: FundRequest
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private fundRequestService: FundRequestService
  ) {
    this.fund = this.fundRequestService.getFundRequest()
    this.title = "Détails de la demande " + this.fund.motif
  }

  ngOnInit(): void {
  }

  editFund(row) {
    this.modalService.dismissAll()
    this.fundRequestService.setFundRequest(row)
    this.fundRequestService.edit = true
    this.modal(FundRequestAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerFund(row): void {
    this.fundRequestService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {

    }, (reason) => {

    });
  }

}
