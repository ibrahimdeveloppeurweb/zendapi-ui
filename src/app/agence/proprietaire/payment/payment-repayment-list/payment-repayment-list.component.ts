
import { PaymentRepayment } from '@model/payment-repayment';
import { Globals } from '@theme/utils/globals';
import { CONFIRMATION } from '@theme/utils/functions';
import { VALIDATION } from '@theme/utils/functions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { PaymentRepaymentService } from '@service/payment-repayment/payment-repayment.service';
import { PaymentRepaymentShowComponent } from '@proprietaire/payment/payment-repayment-show/payment-repayment-show.component';
import { PaymentRepaymentAddComponent } from '@proprietaire/payment/payment-repayment-add/payment-repayment-add.component';

@Component({
  selector: 'app-payment-repayment-list',
  templateUrl: './payment-repayment-list.component.html',
  styleUrls: ['./payment-repayment-list.component.scss']
})
export class PaymentRepaymentListComponent implements OnInit {
  @Input() payments: PaymentRepayment[]
  @Input() owner: boolean = true
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = false
  confirmation = CONFIRMATION
  validation = VALIDATION
  global = {country: Globals.country, device: Globals.device}
  total: number = 0;
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private paymentService: PaymentRepaymentService,
    private emitter: EmitterService
  ) {
  }

  ngOnInit(): void {
    this.etat = this.payments ? true : false;
    if(this.etat){
      this.payments.forEach(item => { return this.total = this.total + item?.montant })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PAYMENT_REPAYMENT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PAYMENT_REPAYMENT_UPDATED' || data.action === 'PAYMENT_REPAYMENT_VALIDATE') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.payments.unshift(...item);
  }
  update(item): void {
    const index = this.payments.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.payments[index] = item;
    }
  }
  editPayment(row) {
    this.paymentService.setPayment(row)
    this.paymentService.edit = true
    this.paymentService.type = row.type
    this.modal(PaymentRepaymentAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showPayment(row) {
    this.paymentService.setPayment(row)
    this.modal(PaymentRepaymentShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  validatePayment(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet paiement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
      this.paymentService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'PAYMENT_REPAYMENT_VALIDATE', payload: res?.data});
          }
        }
      });
      }
    });
  }
  printerPayment(row): void {
    this.paymentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.paymentService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.payments.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.payments.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
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
