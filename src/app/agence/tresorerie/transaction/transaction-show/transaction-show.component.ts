import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Invoice } from '@model/invoice';
import { Transaction } from '@model/transaction';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from '@service/transaction/transaction.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { PAYMENT } from '@theme/utils/functions';
import { Globals } from '@theme/utils/globals';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-transaction-show',
  templateUrl: './transaction-show.component.html',
  styleUrls: ['./transaction-show.component.scss']
})
export class TransactionShowComponent implements OnInit {
  title = '';
  transaction: Transaction;
  invoice: Invoice
  publicUrl = environment.publicUrl;
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user
  PAYMENT = PAYMENT

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private transactionService: TransactionService,
    private permissionsService: NgxPermissionsService
  ) {
    this.transaction = this.transactionService.getTransaction()
    this.title = "Détails de la transaction du " + this.transaction?.code
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
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
