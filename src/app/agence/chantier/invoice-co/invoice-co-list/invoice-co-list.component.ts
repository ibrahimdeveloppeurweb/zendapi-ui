import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { InvoiceCo } from '@model/prestataire/invoice-co';
import { Globals } from '@theme/utils/globals';
import { InvoiceCoShowComponent } from '../invoice-co-show/invoice-co-show.component';
import { InvoiceCoAddComponent } from '../invoice-co-add/invoice-co-add.component';
import { InvoiceCoService } from '@service/invoice-co/invoice-co.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VALIDATION } from '@theme/utils/functions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-invoice-co-list',
  templateUrl: './invoice-co-list.component.html',
  styleUrls: ['./invoice-co-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceCoListComponent implements OnInit {

  @Input() invoiceCos: InvoiceCo[]
  @Input() prestataire = true;
  @Input() construction = true;

  dtOptions: any = {};
  etat :boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  validation = VALIDATION
  total = 0;
  modelRef: any;

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private invoiceCoService: InvoiceCoService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.etat = this.invoiceCos ? true : false;
    if(this.etat){ this.invoiceCos.forEach(item => { this.total += item?.montant }) }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      console.log(data.payload)
      if (data.action === 'INVOICE_CO_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'INVOICE_CO_VALIDATE' || data.action === 'INVOICE_CO_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.invoiceCos.unshift(row);
  }
  update(row): void {
    const index = this.invoiceCos.findIndex((x => x.id === row.id) || (x => x.uuid === row.uuid));
    if (index !== -1) {
      this.invoiceCos[index] = row;
    }
  }
  editInvoiceCo(row) {
    this.invoiceCoService.setInvoiceCo(row)
    this.invoiceCoService.edit = true
    this.modal(InvoiceCoAddComponent, 'modal-basic-title', 'xl', true, 'static')
    this.modelRef.componentInstance.type = row.trustee != null?  "SYNDIC":"LOCATIVE"
  }
  showInvoiceCo(row) {
    this.invoiceCoService.setInvoiceCo(row)
    this.modal(InvoiceCoShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerInvoiceCo(row): void {
    this.invoiceCoService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  validateInvoiceCo(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cette facture ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
      this.invoiceCoService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'INVOICE_CO_VALIDATE', payload: res?.data});
          }
        }
      });
      }
    });
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
        this.invoiceCoService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.invoiceCos.findIndex(x => x.uuid === item.uuid);
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
  }
  modal(component, type, size, center, backdrop) {
    this.modelRef = this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    });
  }

}
