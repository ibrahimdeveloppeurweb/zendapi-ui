
import { Invoice } from '@model/invoice';
import { Globals } from '@theme/utils/globals';
import { PAYMENT } from '@theme/utils/functions';
import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '@service/invoice/invoice.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceAddComponent } from '@locataire/invoice/invoice-add/invoice-add.component';

@Component({
  selector: 'app-invoice-show',
  templateUrl: './invoice-show.component.html',
  styleUrls: ['./invoice-show.component.scss']
})
export class InvoiceShowComponent implements OnInit {
  title: string = "";
  invoice: Invoice;
  global = { country: Globals.country, device: Globals.device };
  payment = PAYMENT;
  userSession = Globals.user;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private invoiceService: InvoiceService
  ) {
    this.invoice = this.invoiceService.getInvoice()
    this.title = "Détails de la facture N° " + this.invoice?.code
  }

  ngOnInit(): void {
  }

  editInvoice(row) {
    this.modalService.dismissAll()
    this.invoiceService.setInvoice(row)
    this.invoiceService.edit = true
    this.modal(InvoiceAddComponent, 'modal-basic-title', 'xl', true, 'static')
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
    }).result.then((result) => { }, (reason) => { });
  }
}
