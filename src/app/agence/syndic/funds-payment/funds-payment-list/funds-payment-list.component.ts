import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FundsPaymentService } from '@service/syndic/funds-payment.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FundsPaymentShowComponent } from '../funds-payment-show/funds-payment-show.component';
import { EmitterService } from '@service/emitter/emitter.service';

@Component({
  selector: 'app-funds-payment-list',
  templateUrl: './funds-payment-list.component.html',
  styleUrls: ['./funds-payment-list.component.scss']
})
export class FundsPaymentListComponent implements OnInit {

  @Input() fundsPayments: any[] = []
  @Input() showActionBtn: boolean = true
  dtOptions = {}
  userSession = Globals.user;

  constructor(
    private modalService: NgbModal,
    private fundsPaymentsService: FundsPaymentService,
    private emitter: EmitterService
  ) {
    console.log(this.fundsPayments)
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PROVISION_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PROVISION_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.fundsPayments.unshift(item);
  }

  update(row): void {
    const index = this.fundsPayments.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.fundsPayments[index] = row;
    }
  }

  show(row){
    this.fundsPaymentsService.setFundsPayment(row)
    this.modal(FundsPaymentShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }

  delete(item){
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
        this.fundsPaymentsService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.fundsPayments.findIndex(x => x.id === item.id);
            if (index !== -1) { this.fundsPayments.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
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
    }).result.then((result) => {
    }, (reason) => { });
  }

  onValidate(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous valider ce paiement ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Confirmer <i class="fas fa-check"></i>',
      cancelButtonText: 'Annuler <i class="feather icon-x-circle"></i>',
      confirmButtonColor: '#1bc943',
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.fundsPaymentsService.validate(item.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            this.emitter.emit({ action: 'PROVISION_UPDATED', payload: res?.data });
            this.onClose();
          }
        })
      }
    });
  }

  onClose(){
    this.modalService.dismissAll();
  }

  onPrinter(row): void {
    this.fundsPaymentsService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row.trustee.uuid, row.uuid);
  }

}
