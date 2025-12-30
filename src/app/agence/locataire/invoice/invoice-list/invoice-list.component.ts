
import { Invoice } from '@model/invoice';
import { Globals } from '@theme/utils/globals';
import { PAYMENT } from '@theme/utils/functions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import {EmitterService} from '@service/emitter/emitter.service';
import { InvoiceService } from '@service/invoice/invoice.service';
import { InvoiceAddComponent } from '@locataire/invoice/invoice-add/invoice-add.component';
import { InvoiceShowComponent } from '@locataire/invoice/invoice-show/invoice-show.component';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {
  @Input() autres: Invoice[]
  @Input() locataire: boolean = true
  PAYMENT = PAYMENT
  @Input() type: string = 'autre'
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  total: number = 0;
  paye: number = 0;
  impaye: number = 0;
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private invoiceService: InvoiceService,
    private emitter: EmitterService
  ) {
  }

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
    this.etat = this.autres ? true : false;
    if(this.etat){
      this.autres?.forEach(item => {
        this.total += item?.montant
        this.paye += item?.paye
        this.impaye += item?.impaye
        return
      })
    }
  }

  appendToList(autre): void {
    this.autres?.unshift(autre);
  }
  update(autre): void {
    const index = this.autres?.findIndex(x => x.uuid === autre?.uuid);
    if (index !== -1) {
      this.autres[index] = autre;
    }
  }
  addAutre() {
    this.modalService.dismissAll()
    this.invoiceService.edit = false
    this.modal(InvoiceAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  editAutre(row): void {
    this.invoiceService.setInvoice(row);
    this.invoiceService.edit = true;
    this.invoiceService.type = row.type;
    this.modal(InvoiceAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showAutre(row) {
    this.invoiceService.setInvoice(row)
    this.modal(InvoiceShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerInvoice(row): void {
    this.invoiceService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
          this.invoiceService.getDelete(item.uuid).subscribe(res => {
        }, error => {
          Swal.fire('', error.message, 'error');
        })
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

    }, (reason) => {

    });
  }
}
