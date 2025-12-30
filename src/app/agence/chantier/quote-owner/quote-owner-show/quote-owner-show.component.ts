import { Component, OnInit } from '@angular/core';
import { QuoteOwner } from '@model/quote-owner';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteOwnerService } from '@service/quote-owner/quote-owner.service';
import { VALIDATION } from '@theme/utils/functions';
import { Globals } from '@theme/utils/globals';
import { UploaderService } from '@service/uploader/uploader.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-quote-owner-show',
  templateUrl: './quote-owner-show.component.html',
  styleUrls: ['./quote-owner-show.component.scss']
})
export class QuoteOwnerShowComponent implements OnInit {
  title: string = "";
  quote: QuoteOwner;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  validation = VALIDATION;
  file: string;
  publicUrl = environment.publicUrl;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private quoteOwnerService: QuoteOwnerService
  ) {
    this.quote = this.quoteOwnerService.getQuote();
    this.title = this.quote.isBon 
      ? "Détails du bon de commande " + this.quote.libelle 
      : "Détails du devis propriétaire " + this.quote.code;
  }

  ngOnInit(): void {
  }

  /**
   * Calcule le montant initial total (somme des Total Unitaire de tous les prestataires)
   * Total Unitaire = Prix unitaire × Quantité
   */
  calculateTotalInitial(): number {
    if (!this.quote?.quoteProviders) return 0;
    
    let total = 0;
    this.quote.quoteProviders.forEach(prestataire => {
      // Utiliser montantInitialPrestataire si disponible
      if (prestataire.montantInitial) {
        total += prestataire.montantInitial;
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
    if (!this.quote?.quoteProviders) return 0;
    
    let total = 0;
    this.quote.quoteProviders.forEach(prestataire => {
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

  editQuote(row: QuoteOwner): void {
    this.modalService.dismissAll();
    this.quoteOwnerService.setQuote(row);
    this.quoteOwnerService.edit = true;
    // À adapter avec votre composant d'édition pour QuoteOwner
    // this.modal(QuoteOwnerAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printerQuote(row: QuoteOwner): void {
    this.quoteOwnerService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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