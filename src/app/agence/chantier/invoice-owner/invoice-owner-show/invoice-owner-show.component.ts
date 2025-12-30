import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VALIDATION } from '@theme/utils/functions';
import { Globals } from '@theme/utils/globals';
import { UploaderService } from '@service/uploader/uploader.service';
import { environment } from '@env/environment';
import { InvoiceOwner } from '@model/invoice-owner';
import { InvoiceOwnerService } from '@service/invoice-owner/invoice-owner.service';

@Component({
  selector: 'app-invoice-owner-show',
  templateUrl: './invoice-owner-show.component.html',
  styleUrls: ['./invoice-owner-show.component.scss']
})
export class InvoiceOwnerShowComponent implements OnInit {
  title: string = "";
  invoiceOwner: InvoiceOwner;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  validation = VALIDATION;
  file: string;
  publicUrl = environment.publicUrl;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private invoiceOwnerService: InvoiceOwnerService,
  ) {
    this.invoiceOwner = this.invoiceOwnerService.getInvoiceOwner();
    this.title = "Détails de la facture " + this.invoiceOwner.libelle;
  }

  ngOnInit(): void {
  }

  /**
   * Calcule le montant initial total (somme des Total Unitaire de tous les prestataires)
   * Total Unitaire = Prix unitaire × Quantité
   */
  calculateTotalInitial(): number {
    if (!this.invoiceOwner?.quoteProviders) return 0;
    
    let total = 0;
    this.invoiceOwner.quoteProviders.forEach(prestataire => {
      // Utiliser montantInitialPrestataire si disponible
      if (prestataire.montantInitialPrestataire) {
        total += prestataire.montantInitialPrestataire;
      } else {
        // Sinon calculer à partir des options
        if (prestataire.options && prestataire.options.length > 0) {
          prestataire.options.forEach(option => {
            const prixInitial = option.prix || 0;
            const qte = option.qte || 1;
            total += prixInitial * qte; // Total Unitaire
          });
        }
      }
    });
    
    return total;
  }

  /**
   * Calcule le montant initial d'un prestataire spécifique
   * (somme des Total Unitaire de ses options)
   */
  calculatePrestataireInitial(prestataire: any): number {
    if (!prestataire?.options || prestataire.options.length === 0) return 0;
    
    let total = 0;
    prestataire.options.forEach(option => {
      const prixInitial = option.prix || 0;
      const qte = option.qte || 1;
      total += prixInitial * qte; // Total Unitaire
    });
    
    return total;
  }

  /**
   * Calcule la différence totale (somme des différences de chaque prestataire)
   * Différence = Total Majoré - Total Unitaire pour chaque prestataire
   */
  calculateTotalDifference(): number {
    if (!this.invoiceOwner?.quoteProviders) return 0;
    
    let total = 0;
    this.invoiceOwner.quoteProviders.forEach(prestataire => {
      // Utiliser montantDifference si disponible
      if (prestataire.montantDifference !== undefined && prestataire.montantDifference !== null) {
        total += prestataire.montantDifference;
      } else {
        // Sinon calculer à partir des options
        total += this.calculatePrestataireDifference(prestataire);
      }
    });
    
    return total;
  }

  /**
   * Calcule la différence d'un prestataire spécifique
   * (somme des différences de ses options)
   */
  calculatePrestataireDifference(prestataire: any): number {
    if (!prestataire?.options || prestataire.options.length === 0) return 0;
    
    let difference = 0;
    prestataire.options.forEach(option => {
      const prixInitial = option.prix || 0;
      const prixMajore = option.prixMajore || prixInitial;
      const qte = option.qte || 1;
      
      const totalUnitaire = prixInitial * qte;
      const totalMajore = prixMajore * qte;
      difference += (totalMajore - totalUnitaire);
    });
    
    return difference;
  }

  editInvoice(row: InvoiceOwner): void {
    this.modalService.dismissAll();
    this.invoiceOwnerService.setInvoiceOwner(row);
    this.invoiceOwnerService.edit = true;
    // À adapter avec votre composant d'édition pour InvoiceOwner
    // this.modal(InvoiceOwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printerInvoice(row: InvoiceOwner): void {
    this.invoiceOwnerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }

  showFile(item: any): void {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }

  closeViewer(): void {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
}