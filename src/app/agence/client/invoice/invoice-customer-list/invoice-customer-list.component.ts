import { Component, Input, OnInit } from '@angular/core';
import { InvoiceFolder } from '@model/invoice-folder';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { PAYMENT } from '@theme/utils/functions';
import { Globals } from '@theme/utils/globals';
import { EmitterService } from '@service/emitter/emitter.service';
import { InvoiceFolderService } from '@service/invoice-folder/invoice-folder.service';
import { InvoiceCustomerShowComponent } from '../invoice-customer-show/invoice-customer-show.component';

@Component({
  selector: 'app-invoice-customer-list',
  templateUrl: './invoice-customer-list.component.html',
  styleUrls: ['./invoice-customer-list.component.scss']
})
export class InvoiceCustomerListComponent implements OnInit {
  @Input() invoices: InvoiceFolder[]
  @Input() client: boolean = true
  PAYMENT = PAYMENT
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  total: number = 0;
  paye: number = 0;
  impaye: number = 0;
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private invoiceService: InvoiceFolderService
  ) { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.etat = this.invoices ? true : false;
    if(this.etat){
      this.invoices?.forEach(item => {
        this.total += item?.montant
        this.paye += item?.paye
        this.impaye += item?.impaye
        return
      })
    }
  }
  showInvoice(row) {
    this.invoiceService.setInvoice(row)
    this.modal(InvoiceCustomerShowComponent, 'modal-basic-title', 'xl', true, 'static')
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
