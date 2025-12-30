import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { InvoiceCo } from '@model/prestataire/invoice-co';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InvoiceCoService } from '@service/invoice-co/invoice-co.service';
import { CONFIRMATION, VALIDATION } from '@theme/utils/functions';
import { Globals } from '@theme/utils/globals';
import { InvoiceCoAddComponent } from '../invoice-co-add/invoice-co-add.component';
import { UploaderService } from '@service/uploader/uploader.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-invoice-co-show',
  templateUrl: './invoice-co-show.component.html',
  styleUrls: ['./invoice-co-show.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceCoShowComponent implements OnInit {
  title: string = ""
  invoice: InvoiceCo
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user;  
  confirmation = CONFIRMATION
  validation = VALIDATION
  file: string;
  publicUrl = environment.publicUrl;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private invoiceService: InvoiceCoService
  ) {
    this.invoice = this.invoiceService.getInvoiceCo()
    this.title = "Détails de la facture de " + this.invoice.libelle
  }

  ngOnInit(): void {
  }

  editInvoice(row) {
    this.modalService.dismissAll()
    this.invoiceService.setInvoiceCo(row)
    this.invoiceService.edit = true
    this.modal(InvoiceCoAddComponent, 'modal-basic-title', 'xl', true, 'static')
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
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
    console.log(this.file);
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
}
