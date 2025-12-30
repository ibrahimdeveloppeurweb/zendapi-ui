import { NgxPermissionsService } from 'ngx-permissions';
import { Repayment } from '@model/repayment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { VALIDATION } from '@theme/utils/functions';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RepaymentService } from '@service/repayment/repayment.service';
import { InvoiceRepaymentService } from '@service/invoice-repayment/invoice-repayment.service';
import { RepaymentAddComponent } from '@agence/proprietaire/repayment/repayment-add/repayment-add.component';

@Component({
  selector: 'app-repayment-show',
  templateUrl: './repayment-show.component.html',
  styleUrls: ['./repayment-show.component.scss']
})
export class RepaymentShowComponent implements OnInit {
  title: string = ""
  // repayment: Repayment
  repayment: any
  validation = VALIDATION
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private repaymentService: RepaymentService,
    private invoiceRepaymentService: InvoiceRepaymentService,
    private permissionsService: NgxPermissionsService
  ) {
    this.repayment = this.repaymentService.getRepayment();
    this.title = "Détails du reversements de type " + this.repayment.type + " N°" +this.repayment.code
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
  }

  getTotalCaution(): number {
    if (!this.repayment?.optionInvoiceRepayments) {
      return 0;
    }
    
    return this.repayment.optionInvoiceRepayments.reduce((total, item) => {
      // La caution n'est affichée que pour les factures d'entrée
      // et si elle n'est pas gérée par l'agence
      if (item?.invoice?.type === 'ENTREE' && 
          item?.invoice?.contract?.cautionReverser !== 'AGENCE' && 
          item?.caution) {
        return total + parseFloat(item.caution);
      }
      return total;
    }, 0);
  }

  getTotalCharges(): number {
    if (!this.repayment?.optionInvoiceRepayments) {
      return 0;
    }
    
    return this.repayment.optionInvoiceRepayments.reduce((total, item) => {
      if (!item?.invoice?.contract) {
        return total;
      }
      
      // Pour les factures d'entrée: charge * moisAvance
      // Pour les autres: charge simple
      const charges = item.invoice.type === 'ENTREE' 
        ? item.invoice.contract.charge * item.invoice.contract.moisAvance
        : item.invoice.contract.charge;
      
      return total + (charges || 0);
    }, 0);
  }

  editRepayment(row) {
    this.modalService.dismissAll()
    this.repaymentService.setRepayment(row)
    this.repaymentService.edit = true
    this.repaymentService.type = row.type
    this.modal(RepaymentAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerRepayment(row): void {
    this.repaymentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid)
  }
  printerInvoiceRepayment(row: any): void {
    this.invoiceRepaymentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
