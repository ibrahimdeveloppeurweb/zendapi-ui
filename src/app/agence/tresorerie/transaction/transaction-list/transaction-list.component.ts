import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from '@model/transaction';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EmitterService } from '@service/emitter/emitter.service';
import { TransactionService } from '@service/transaction/transaction.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Globals } from '@theme/utils/globals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionShowComponent } from '../transaction-show/transaction-show.component';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  @Input() transactions: Transaction[] = []
  etat: boolean = false
  dtOptions: any = {};
  total = 0;
  userSession = Globals.user
  global = { country: Globals.country, device: Globals.device }

  constructor(
    public transactionService: TransactionService,
    private emitter: EmitterService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.etat = this.transactions ? true : false;
    if (this.etat) {
      this.transactions.forEach(item => {
        this.total += item?.amount
      })
    }
    this.dtOptions = Globals.dataTable;
  }
  showTransaction(row): void {
    this.transactionService.setTTransaction(row);
    this.modal(TransactionShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  delete(row) {
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
        this.transactionService.getDelete(row.uuid).subscribe((res: any) => {
          const index = this.transactions.findIndex((x) => {
            return x.uuid === row.uuid;
          });
          if (index !== -1) {
            this.transactions.splice(index, 1);
          }
          Swal.fire('Transaction Supprimé', res?.message, 'success');
        });
      }
    });
  }
  modal(component, type, size, center, backdrop): void {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {

    }, (reason) => {

    });
  }
  readableDate(date) { return DateHelperService.readable(date); }
  formatDate(date) { return DateHelperService.fromJsonDate(date); }
  timelapse(date): string { return DateHelperService.getTimeLapse(date); }
}
