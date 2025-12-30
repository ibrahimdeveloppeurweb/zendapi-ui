
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { PaymentRepayment } from '@model/payment-repayment';
import { CONFIRMATION, VALIDATION} from '@theme/utils/functions';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentRepaymentService } from '@service/payment-repayment/payment-repayment.service';
import { PaymentRepaymentAddComponent } from '@proprietaire/payment/payment-repayment-add/payment-repayment-add.component';

@Component({
  selector: 'app-payment-repayment-show',
  templateUrl: './payment-repayment-show.component.html',
  styleUrls: ['./payment-repayment-show.component.scss']
})
export class PaymentRepaymentShowComponent implements OnInit {
  title: string = ""
  payment: PaymentRepayment
  confirmation = CONFIRMATION
  validation = VALIDATION
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private paymentService: PaymentRepaymentService
  ) {
    this.payment = this.paymentService.getPayment()
    this.title = "Détails du paiement reversement de la facture: " + this.payment?.code
  }

  ngOnInit(): void {
  }

  editPayment(row) {
    this.modalService.dismissAll()
    this.paymentService.setPayment(row)
    this.paymentService.edit = true
    this.modal(PaymentRepaymentAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerPayment(row): void {
    this.paymentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
