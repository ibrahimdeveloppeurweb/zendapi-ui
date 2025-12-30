import { EntranceInvoiceService } from '@service/entrance-invoice/entrance-invoice.service';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PAYMENT } from '@theme/utils/functions';
import { InvoiceService } from '@service/invoice/invoice.service';
import { Invoice } from '@model/invoice';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-entrance-invoice-show',
  templateUrl: './entrance-invoice-show.component.html',
  styleUrls: ['./entrance-invoice-show.component.scss']
})
export class EntranceInvoiceShowComponent implements OnInit {
  title: string = '';
  invoice?: Invoice;
  global = { country: Globals.country, device: Globals.device };
  payment = PAYMENT
  userSession = Globals.user

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private invoiceService: EntranceInvoiceService
  ) {
    this.invoice = this.invoiceService.getEntranceInvoice();
    this.title = "Détails de la facture d'entrée N° " + this.invoice?.code
  }

  ngOnInit(): void {
  }
  printerInvoice(row): void {
    this.invoiceService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
