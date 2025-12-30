import { PaymentFundingAddComponent } from '@chantier/payment/payment-funding-add/payment-funding-add.component';
import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import { PaymentFunding } from '@model/payment-funding';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentFundingService } from '@service/payment-funding/payment-funding.service';

@Component({
  selector: 'app-payment-funding-show',
  templateUrl: './payment-funding-show.component.html',
  styleUrls: ['./payment-funding-show.component.scss']
})
export class PaymentFundingShowComponent implements OnInit {
  title: string = ""
  payment: PaymentFunding
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private paymentFundingService: PaymentFundingService
  ) {

    this.payment = this.paymentFundingService.getPayment()
    this.title = "Détails du paiement de " + this.payment.code
  }

  ngOnInit(): void {
  }

  editPayment(row) {
    this.modalService.dismissAll()
    this.paymentFundingService.setPayment(row)
    this.paymentFundingService.edit = true
    this.paymentFundingService.type = row.type
    this.modal(PaymentFundingAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printerPayment(row): void {
    this.paymentFundingService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
