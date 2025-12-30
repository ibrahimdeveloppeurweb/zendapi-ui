
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentFunding } from '@model/payment-funding';
import { Component, Input, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { PaymentFundingService } from '@service/payment-funding/payment-funding.service';
import { PaymentFundingAddComponent } from '@chantier/payment/payment-funding-add/payment-funding-add.component';
import { PaymentFundingShowComponent } from '@chantier/payment/payment-funding-show/payment-funding-show.component';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-payment-funding-list',
  templateUrl: './payment-funding-list.component.html',
  styleUrls: ['./payment-funding-list.component.scss']
})
export class PaymentFundingListComponent implements OnInit {
  @Input() payments: PaymentFunding[]
  @Input() action: boolean = true
  @Input() construction: string = 'LISTING'
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  total = 0;

  constructor(
    private modalService: NgbModal,
    private paymentFundingService: PaymentFundingService,
    private emitter: EmitterService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.etat = this.payments ? true : false;
    if(this.etat){
      this.payments.forEach(item => { return this.total = this.total + item?.montant })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PAYMENT_FUNDING_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PAYMENT_FUNDING_UPDATED' || data.action === 'PAYMENT_FUNDING_VALIDATE') {
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
    this.paymentFundingService.setPayment(row)
    this.paymentFundingService.edit = true
    this.paymentFundingService.type = row.type
    this.modal(PaymentFundingAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showPayment(row) {
    this.paymentFundingService.setPayment(row)
    this.modal(PaymentFundingShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerPayment(row): void {
    this.paymentFundingService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
      this.paymentFundingService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'PAYMENT_FUNDING_VALIDATE', payload: res?.data});
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
        this.paymentFundingService.getDelete(item.uuid).subscribe((res: any) => {
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
