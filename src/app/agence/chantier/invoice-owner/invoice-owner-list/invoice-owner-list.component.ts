
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteOwnerService } from '@service/quote-owner/quote-owner.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { VALIDATION } from '@theme/utils/functions';
import { NgxPermissionsService } from 'ngx-permissions';
import { InvoiceOwnerAddComponent } from '../invoice-owner-add/invoice-owner-add.component';
import { InvoiceOwnerShowComponent } from '../invoice-owner-show/invoice-owner-show.component';
import { InvoiceOwner } from '@model/invoice-owner';
import { InvoiceOwnerService } from '@service/invoice-owner/invoice-owner.service';

@Component({
  selector: 'app-invoice-owner-list',
  templateUrl: './invoice-owner-list.component.html',
  styleUrls: ['./invoice-owner-list.component.scss']
})
export class InvoiceOwnerListComponent implements OnInit {
  @Input() invoiceOwners: InvoiceOwner[]
  @Input() mode: string = "LOCATIVE"
  @Input() isBon = false;
  @Input() construction = true;

  type: string = 'FACTURE_PROPRIETAIRE'
  dtOptions: any = {};
  etat: boolean = false
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user
  validation = VALIDATION
  total = 0;
  modelRef: any;

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private invoiceOwnerService: InvoiceOwnerService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    console.log("dddddddd",this.invoiceOwners);
    
    this.etat = this.invoiceOwners ? true : false;
    
    if (this.etat) {
      console.log("  this.etat",this.etat);
      
      this.invoiceOwners.forEach(item => {
        this.total += item?.montant || 0;
      });
    }
    
    this.dtOptions = Globals.dataTable;
    
    // Écouter les événements
    this.emitter.event.subscribe((data) => {
      
      if (data.action === 'INVOICE_OWNER_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'INVOICE_OWNER_VALIDATE' || data.action === 'INVOICE_OWNER_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.invoiceOwners.unshift(row);
    this.total += row?.montantHt || 0;
  }

  update(row): void {
    const index = this.invoiceOwners.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      // Recalculer le total
      this.total -= this.invoiceOwners[index]?.montantHt || 0;
      this.invoiceOwners[index] = row;
      this.total += row?.montantHt || 0;
    }
  }

  editInvoiceOwner(row) {
    this.invoiceOwnerService.setInvoiceOwner(row);
    this.invoiceOwnerService.edit = true;
    this.modal(InvoiceOwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = row.trustee != null ? "SYNDIC" : "LOCATIVE";
    this.modelRef.componentInstance.isBon = this.isBon;
  }

  showInvoiceOwner(row) {
    this.invoiceOwnerService.setInvoiceOwner(row);
    this.modal(InvoiceOwnerShowComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printerInvoiceOwner(row): void {
    this.invoiceOwnerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  validateInvoiceOwner(row) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider ce devis propriétaire ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        this.invoiceOwnerService.validate(row).subscribe(res => {
          if (res?.status === 'success') {
            if (row) {
              this.emitter.emit({ action: 'INVOICE_OWNER_VALIDATE', payload: res?.data });
              Swal.fire('Succès', 'Le devis a été validé avec succès', 'success');
            }
          }
        }, error => {
          console.error("❌ Erreur lors de la validation:", error);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la validation', 'error');
        });
      }
    });
  }

  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enregistrement ?',
      icon: 'warning',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (!willDelete.dismiss) {
        console.log("🗑️ Suppression du QuoteOwner:", item);
        this.invoiceOwnerService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.invoiceOwners.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.total -= this.invoiceOwners[index]?.montantHt || 0;
              this.invoiceOwners.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
            console.log("✅ QuoteOwner supprimé");
          }
        }, error => {
          console.error("❌ Erreur lors de la suppression:", error);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression', 'error');
        });
      }
    });
  }

  /**
   * Obtenir le nombre total de prestataires pour un QuoteOwner
   */
  getTotalProviders(invoice: InvoiceOwner): number {
    return invoice?.quoteProviders?.length || 0;
  }

  /**
   * Obtenir la liste des noms de prestataires
   */
  getProviderNames(invoice: InvoiceOwner): string {
    if (!invoice?.quoteProviders || invoice.quoteProviders.length === 0) {
      return 'Aucun prestataire';
    }
    
    const names = invoice.quoteProviders
      .map(qp => qp.provider?.nom)
      .filter(name => name)
      .join(', ');
    
    return names || 'N/A';
  }

  /**
   * Obtenir le type consolidé (si plusieurs types différents)
   */
  getConsolidatedType(invoice: InvoiceOwner): string {
    if (!invoice?.quoteProviders || invoice.quoteProviders.length === 0) {
      return 'N/A';
    }
    
    const types = [...new Set(invoice.quoteProviders.map(qp => qp.type))];
    return types.join(' / ');
  }

  /**
   * Calcule le nombre de colonnes pour le colspan du footer
   * Prend en compte les colonnes conditionnelles pour éviter l'erreur DataTables
   * 
   * Structure du tableau :
   * - Prestataires (toujours visible)
   * - Syndic (si mode == 'SYNDIC')
   * - Bien (si mode == 'LOCATIVE')
   * - Intervention (si construction == true)
   * - Libellé (toujours visible)
   * - Type (toujours visible)
   * - Date (toujours visible)
   * - État (toujours visible)
   * - Montant HT (toujours visible)
   * - Action (toujours visible)
   */
  getColspanCount(): number {
    let count = 5; // Colonnes fixes : Prestataires, Libellé, Type, Date, État
    
    // Ajouter les colonnes conditionnelles
    if (this.mode === 'SYNDIC') {
      count++; // Colonne Syndic
    }
    if (this.mode === 'LOCATIVE') {
      count++; // Colonne Bien
    }
    if (this.construction) {
      count++; // Colonne Intervention
    }
    
    return count;
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

