
import { Payment } from '@model/payment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { CONFIRMATION, VALIDATION} from '@theme/utils/functions';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentAddComponent } from '@locataire/payment/payment-add/payment-add.component';
import { UploaderService } from '@service/uploader/uploader.service';
import { environment } from '@env/environment';
import { RenewPayment } from '@model/renew-payment';
import { RenewPaymentService } from '@service/renew-payment/renew-payment.service';
import { PaymentService } from '@service/payment/payment.service';



@Component({
  selector: 'app-renew-payment-show',
  templateUrl: './renew-payment-show.component.html',
  styleUrls: ['./renew-payment-show.component.scss']
})
export class RenewPaymentShowComponent implements OnInit {
  publicUrl = environment.publicUrl;
  title: string = ""
  payment: RenewPayment
  confirmation = CONFIRMATION
  validation = VALIDATION
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  file: any;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private renewPaymentService: RenewPaymentService,
    private uploader: UploaderService,
    private paymentService: PaymentService,

  ) {
    this.payment = this.renewPaymentService.getRenewPayment();
    this.title = "Détails du paiement N°" + this.payment?.code;
  }

  ngOnInit(): void {
  }

  editPayment(row) {
    this.modalService.dismissAll()
    this.paymentService.setPayment(row)
    this.paymentService.edit = true
    this.paymentService.type = row.type
    this.modal(PaymentAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerPayment(row): void {
    this.renewPaymentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
