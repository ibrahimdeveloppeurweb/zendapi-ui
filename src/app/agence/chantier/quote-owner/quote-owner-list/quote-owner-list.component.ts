import { QuoteOwner } from '@model/quote-owner';
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteOwnerService } from '@service/quote-owner/quote-owner.service';
import { QuoteOwnerAddComponent } from '../quote-owner-add/quote-owner-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { VALIDATION } from '@theme/utils/functions';
import { QuoteOwnerShowComponent } from '../quote-owner-show/quote-owner-show.component';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-quote-owner-list',
  templateUrl: './quote-owner-list.component.html',
  styleUrls: ['./quote-owner-list.component.scss']
})
export class QuoteOwnerListComponent implements OnInit {
  @Input() quoteOwners: QuoteOwner[]
  @Input() mode: string = "LOCATIVE"
  @Input() isBon = false;
  @Input() construction = true;

  type: string = 'DEVIS_PROPRIETAIRE'
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
    private quoteOwnerService: QuoteOwnerService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    console.log("📋 Initialisation QuoteOwnerListComponent");
    console.log("QuoteOwners reçus:", this.quoteOwners);
    console.log("Mode:", this.mode);
    console.log("Construction visible:", this.construction);
    console.log("isBon:", this.isBon);
    
    this.etat = this.quoteOwners ? true : false;
    
    if (this.etat) {
      this.quoteOwners.forEach(item => {
        this.total += item?.montantHt || 0;
      });
      console.log("💰 Total calculé:", this.total);
    }
    
    this.dtOptions = Globals.dataTable;
    
    // Écouter les événements
    this.emitter.event.subscribe((data) => {
      console.log("🔔 Événement reçu:", data);
      
      if (data.action === 'QUOTE_OWNER_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'QUOTE_OWNER_VALIDATE' || data.action === 'QUOTE_OWNER_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    console.log("➕ Ajout d'un nouveau QuoteOwner:", row);
    this.quoteOwners.unshift(row);
    this.total += row?.montantHt || 0;
  }

  update(row): void {
    console.log("🔄 Mise à jour d'un QuoteOwner:", row);
    const index = this.quoteOwners.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      // Recalculer le total
      this.total -= this.quoteOwners[index]?.montantHt || 0;
      this.quoteOwners[index] = row;
      this.total += row?.montantHt || 0;
    }
  }

  editQuoteOwner(row) {
    this.quoteOwnerService.setQuote(row);
    this.quoteOwnerService.edit = true;
    this.modal(QuoteOwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
    this.modelRef.componentInstance.type = row.trustee != null ? "SYNDIC" : "LOCATIVE";
    this.modelRef.componentInstance.isBon = this.isBon;
  }

  showQuoteOwner(row) {
    console.log("👁️ Affichage du QuoteOwner:", row);
    this.quoteOwnerService.setQuote(row);
    this.modal(QuoteOwnerShowComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printerQuoteOwner(row): void {
    console.log("🖨️ Impression du QuoteOwner:", row);
    this.quoteOwnerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  validateQuoteOwner(row) {
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
        console.log("✅ Validation du QuoteOwner:", row);
        this.quoteOwnerService.validate(row).subscribe(res => {
          if (res?.status === 'success') {
            if (row) {
              this.emitter.emit({ action: 'QUOTE_OWNER_VALIDATE', payload: res?.data });
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
        this.quoteOwnerService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.quoteOwners.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.total -= this.quoteOwners[index]?.montantHt || 0;
              this.quoteOwners.splice(index, 1);
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
  getTotalProviders(quoteOwner: QuoteOwner): number {
    return quoteOwner?.quoteProviders?.length || 0;
  }

  /**
   * Obtenir la liste des noms de prestataires
   */
  getProviderNames(quoteOwner: QuoteOwner): string {
    if (!quoteOwner?.quoteProviders || quoteOwner.quoteProviders.length === 0) {
      return 'Aucun prestataire';
    }
    
    const names = quoteOwner.quoteProviders
      .map(qp => qp.provider?.nom)
      .filter(name => name)
      .join(', ');
    
    return names || 'N/A';
  }

  /**
   * Obtenir le type consolidé (si plusieurs types différents)
   */
  getConsolidatedType(quoteOwner: QuoteOwner): string {
    if (!quoteOwner?.quoteProviders || quoteOwner.quoteProviders.length === 0) {
      return 'N/A';
    }
    
    const types = [...new Set(quoteOwner.quoteProviders.map(qp => qp.type))];
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
    
    console.log("📊 Colspan calculé:", count, "colonnes avant Montant HT");
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
