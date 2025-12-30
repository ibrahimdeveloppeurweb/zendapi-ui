import { PaymentCustomer } from '@model/payment-customer';
import { Component, Input, OnInit } from '@angular/core';
import { Globals } from '@theme/utils/globals';
import { EmitterService } from '@service/emitter/emitter.service';
import { VALIDATION } from '@theme/utils/functions';
import { CONFIRMATION } from '@theme/utils/functions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentCustomerService } from '@service/payment-customer/payment-customer.service';
import { PaymentCustomerAddComponent } from '@client/payment/payment-customer-add/payment-customer-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { PaymentProspectShowComponent } from '../payment-prospect-show/payment-prospect-show.component';
import { PaymentService } from '@service/payment/payment.service';
import { PaymentProspectAddComponent } from '../payment-prospect-add/payment-prospect-add.component';
import { PaymentReservationService } from '@service/payment-reservation/payment-reservation.service';

@Component({
  selector: 'app-payment-prospect-list',
  templateUrl: './payment-prospect-list.component.html',
  styleUrls: ['./payment-prospect-list.component.scss']
})
export class PaymentProspectListComponent implements OnInit {
  @Input() payements: any[]
  @Input() client: boolean = true
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  validation = VALIDATION
  confirmation = CONFIRMATION
  total = 0;

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private paymentReservationService: PaymentReservationService
  ) {
    console.log('cic',this.payements)
  }

  ngOnInit(): void {
    this.etat = this.payements ? true : false;
    if(this.etat){
      this.total = 0;
      console.log(this.payements)

      this.payements.forEach(item => { 
        console.log(item)

          if (item && item.montant) {
            console.log(item.montant)
              this.total += item.montant;
          }
      });
      console.log(this.total)
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PAYMENT_CUSTOMER_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PAYMENT_UPDATED' || data.action === 'PAYMENT_VALIDATE') {
        this.paymentReservationService.getList().subscribe((res: any) => {
          return this.payements = res
        })
      }
    });
  }

  appendToList(item): void {
    this.payements.unshift(...item);
  }
  update(item): void {
    const index = this.payements.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.payements[index] = item;
    }
  }
  editPayment(row) {
    this.paymentReservationService.setPayment(row)
    this.paymentReservationService.edit = true
    this.paymentReservationService.type = row.type
    this.modal(PaymentProspectAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showPayment(row) {
    this.paymentReservationService.setPayment(row)
    this.modal(PaymentProspectShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerPayment(row): void {    
    this.paymentReservationService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
        row.interface = 'prospect'
      this.paymentReservationService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'PAYMENT_VALIDATE', payload: res?.data});
          }
        }
      });
      }
    });
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
        this.paymentReservationService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.payements.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.payements.splice(index, 1);
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
    }).result.then((result) => {}, (reason) => {});
  }
}
