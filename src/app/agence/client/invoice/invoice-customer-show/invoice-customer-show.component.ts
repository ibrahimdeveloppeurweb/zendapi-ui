
import { Globals } from '@theme/utils/globals';
import { PAYMENT } from '@theme/utils/functions';
import { Component, OnInit } from '@angular/core';
import { InvoiceFolder } from '@model/invoice-folder';
import { InvoiceFolderService } from '@service/invoice-folder/invoice-folder.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invoice-customer-show',
  templateUrl: './invoice-customer-show.component.html',
  styleUrls: ['./invoice-customer-show.component.scss']
})
export class InvoiceCustomerShowComponent implements OnInit {
  title: string = ""
  invoice: InvoiceFolder
  global = {country: Globals.country, device: Globals.device}
  payment = PAYMENT
  userSession = Globals.user

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private invoiceService: InvoiceFolderService
  ) {
    this.invoice = this.invoiceService.getInvoice()
    this.title = "Détails de la facture N° " + this.invoice?.code
  }

  ngOnInit(): void {
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
