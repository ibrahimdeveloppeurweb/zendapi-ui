import { PaymentCustomerAddComponent } from '@client/payment/payment-customer-add/payment-customer-add.component';
import { Component, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import { VALIDATION } from '@theme/utils/functions';
import { CONFIRMATION } from '@theme/utils/functions';
import { PaymentCustomer } from '@model/payment-customer';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploaderService } from '@service/uploader/uploader.service';
import { environment } from '@env/environment';
import { PaymentReservationService } from '@service/payment-reservation/payment-reservation.service';

@Component({
  selector: 'app-payment-prospect-show',
  templateUrl: './payment-prospect-show.component.html',
  styleUrls: ['./payment-prospect-show.component.scss']
})
export class PaymentProspectShowComponent implements OnInit {

  publicUrl = environment.publicUrl;
  title: string = ""
  payment: any
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  file: any;
  validation = VALIDATION
  confirmation = CONFIRMATION

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private paymentResercationService: PaymentReservationService,
    private uploader: UploaderService
  ) {
    this.payment = this.paymentResercationService.getPayment()
    console.log(this.payment)
    this.title = "Détails du paiement N° " + this.payment.code
  }

  ngOnInit(): void {
  }

  editPayment(row) {
    this.modalService.dismissAll()
    this.paymentResercationService.setPayment(row)
    this.paymentResercationService.edit = true
    this.paymentResercationService.type = row.type
    this.modal(PaymentCustomerAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerPayment(row): void {
    this.paymentResercationService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }

}
