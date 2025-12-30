import { ProductionAddComponent } from '@chantier/production/production-add/production-add.component';
import { Component, OnInit } from '@angular/core';
import { Production } from '@model/production';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '@theme/utils/globals';
import { VALIDATION } from '@theme/utils/functions';
import { ProductionService } from '@service/production/production.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-production-show',
  templateUrl: './production-show.component.html',
  styleUrls: ['./production-show.component.scss']
})
export class ProductionShowComponent implements OnInit {
  title: string = ""
  production: Production
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  validation = VALIDATION
  publicUrl = environment.publicUrl

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private productionService: ProductionService
  ) {
    this.production = this.productionService.getProduction()
    this.title = "Détails sur la realistaion du devis " + this.production?.code
  }

  ngOnInit(): void {
  }

  /**
   * Calcule l'évolution globale de la production
   */
  getGlobalProgress(): number {
    if (!this.production?.optionProductions || this.production.optionProductions.length === 0) {
      return 0;
    }
    
    let total = 0;
    let completed = 0;
    
    this.production.optionProductions.forEach((option: any) => {
      total++;
      if (option?.evolution) {
        completed++;
      }
    });
    
    return total > 0 ? Math.floor((completed * 100) / total) : 0;
  }

  /**
   * Calcule le pourcentage de progression pour un devis
   */
  getQuoteProgress(quote: any): number {
    if (!quote?.optionProductions || quote.optionProductions.length === 0) {
      return 0;
    }
    
    let total = 0;
    let completed = 0;
    
    quote.optionProductions.forEach((option: any) => {
      total++;
      if (option?.evolution) {
        completed++;
      }
    });
    
    return total > 0 ? Math.floor((completed * 100) / total) : 0;
  }

  /**
   * Obtient la couleur de la barre de progression
   */
  getProgressColor(percent: number): string {
    if (percent < 50) {
      return 'bg-danger';
    } else if (percent >= 50 && percent <= 90) {
      return 'bg-warning';
    } else {
      return 'bg-success';
    }
  }

  /**
   * Obtient l'icône selon l'extension du fichier
   */
  getFileIcon(file: any): string {
    if (!file?.type) return 'fas fa-file';
    
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) {
      return 'fas fa-image';
    } else if (type === 'application/pdf') {
      return 'fas fa-file-pdf';
    } else if (type.includes('word') || type.includes('document')) {
      return 'fas fa-file-word';
    } else if (type.includes('excel') || type.includes('spreadsheet')) {
      return 'fas fa-file-excel';
    } else {
      return 'fas fa-file';
    }
  }

  /**
   * Ouvre un fichier dans un nouvel onglet
   */
  openFile(file: any): void {
    if (file?.fullPath) {
      window.open(this.publicUrl + '/' + file.fullPath, '_blank');
    } else if (file?.fileSrc && file.fileSrc.startsWith('data:')) {
      // Pour les fichiers base64
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${file.fileSrc}" style="max-width: 100%; height: auto;" />`);
      }
    }
  }

  editProduction(row) {
    this.modalService.dismissAll()
    this.productionService.setProduction(row)
    this.productionService.edit = true
    this.modal(ProductionAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerProduction(row): void {
    this.productionService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
