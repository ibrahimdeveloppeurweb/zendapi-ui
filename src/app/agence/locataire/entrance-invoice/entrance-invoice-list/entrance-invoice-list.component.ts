import { EntranceInvoice } from '@model/entrance-invoice';
import { EntranceInvoiceService } from '@service/entrance-invoice/entrance-invoice.service';
import {Component, Input, OnInit} from '@angular/core';
import {Invoice} from '@model/invoice';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { PAYMENT } from '@theme/utils/functions';
import {EntranceInvoiceShowComponent} from '../entrance-invoice-show/entrance-invoice-show.component';
import {Globals} from '@theme/utils/globals';
import {EmitterService} from '@service/emitter/emitter.service';

@Component({
  selector: 'app-entrance-invoice-list',
  templateUrl: './entrance-invoice-list.component.html',
  styleUrls: ['./entrance-invoice-list.component.scss']
})
export class EntranceInvoiceListComponent implements OnInit {
  @Input() invoices: EntranceInvoice[];
  @Input() locataire: boolean = true;
  @Input() action: boolean = true;
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  payment = PAYMENT
  total: number = 0;
  paye: number = 0;
  impaye: number = 0;

  constructor(
    private modalService: NgbModal,
    private invoiceService: EntranceInvoiceService,
    private emitter: EmitterService
  ) { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'INVOICE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'INVOICE_UPDATED') {
        this.update(data.payload);
      }
    });
    this.etat = this.invoices ? true : false;
    if(this.etat){
      this.invoices.forEach(item => {
        this.total += item?.montant
        this.paye += item?.paye
        this.impaye += item?.impaye
        return
      })
    }
  }

  appendToList(item): void {
    this.invoices.unshift(item);
  }
  update(item): void {
    const index = this.invoices.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.invoices[index] = item;
    }
  }
  showEntranceInvoice(row): void {
    this.invoiceService.setEntranceInvoice(row);
    this.modal(EntranceInvoiceShowComponent, 'modal-basic-title', 'xl', true, 'static');
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
