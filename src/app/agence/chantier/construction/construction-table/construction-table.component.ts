import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Construction } from '@model/construction';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConstructionService } from '@service/construction/construction.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Globals } from '@theme/utils/globals';
import { NgxPermissionsService } from 'ngx-permissions';
import { ConstructionAddComponent } from '../construction-add/construction-add.component';

@Component({
  selector: 'app-construction-table',
  templateUrl: './construction-table.component.html',
  styleUrls: ['./construction-table.component.scss']
})
export class ConstructionTableComponent implements OnInit {

  @Input() constructions: Construction[] = [];
  total = 0;
  dtOptions: any = {};
  etat: boolean = false;
  global = { country: Globals.country, device: Globals.device };
  userSession = Globals.user;
  modelRef: NgbModalRef
  constructor(
    public router: Router,
    private modalService: NgbModal,
    private emitter: EmitterService,
    private constructionService: ConstructionService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
   }

  ngOnInit(): void {
    this.etat = this.constructions ? true : false;
    if (this.etat) {
      this.constructions.forEach(item => {
        this.total += (item?.budget ? item?.budget : 0)
      })
    }
  }

  showConstruction(row) {
     this.constructionService.setConstruction(row);
    this.router.navigate(['/admin/intervention/show/' + row.uuid]);
  }
  printerConstruction(row): void {
    this.constructionService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  editConstruction(row) {
    this.constructionService.setConstruction(row);
    this.constructionService.edit = true;
    this.constructionService.type = row.type;
    this.modal(ConstructionAddComponent, 'modal-basic-title', 'lg', true, 'static');
    this.modelRef.componentInstance.type = this.constructionService.type == "SYNDIC" ? "SYNDIC" : "LOCATIVE"
  }

  delete(construction) {
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
        this.constructionService.getDelete(construction.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.constructions.findIndex(x => x.uuid === construction.uuid);
            if (index !== -1) {
              this.constructions.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
        });
        Swal.fire('', 'Enrégistrement supprimé avec succès !', 'success');
      }
    });
  }

  modal(component, type, size, center, backdrop, inputs?) {
    this.modelRef = this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    })
  }

  /**
   * Calcule l'évolution GLOBALE des réalisations pour une construction
   * Utilise exactement la même logique que getGlobalProgress() dans production-show
   * Calcule le pourcentage basé sur toutes les optionProductions
   * Les optionProductions peuvent être dans item.production.optionProductions ou item.optionProductions
   */
  getEvolution(item: Construction): number {
    // Récupérer les optionProductions (peuvent être dans production ou directement dans construction)
    let optionProductions: any[] = [];
    
    if (item?.production?.optionProductions && Array.isArray(item.production.optionProductions) && item.production.optionProductions.length > 0) {
      optionProductions = item.production.optionProductions;
    } else if (item?.optionProductions && Array.isArray(item.optionProductions) && item.optionProductions.length > 0) {
      optionProductions = item.optionProductions;
    }
    
    // Si pas d'optionProductions, retourner 0
    if (optionProductions.length === 0) {
      return 0;
    }
    
    // Calculer l'évolution globale : nombre de tâches terminées / nombre total de tâches
    let total = 0;
    let completed = 0;
    
    optionProductions.forEach((option: any) => {
      total++;
      if (option?.evolution === true || option?.evolution === 'true') {
        completed++;
      }
    });
    
    return total > 0 ? Math.floor((completed * 100) / total) : 0;
  }

  readableDate(date): string { return DateHelperService.readable(date); }
  formatDate(date): string { return DateHelperService.fromJsonDate(date); }
  timelapse(dateD, dateF): string { return DateHelperService.getTimeLapse(dateD, dateF, false, 'dmy'); }

}
