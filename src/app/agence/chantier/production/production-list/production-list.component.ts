import { Component, Input, OnInit } from '@angular/core';
import { Production } from '@model/production';
import { ProductionService } from '@service/production/production.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductionAddComponent } from '../production-add/production-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { ProductionShowComponent } from '../production-show/production-show.component';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-production-list',
  templateUrl: './production-list.component.html',
  styleUrls: ['./production-list.component.scss']
})
export class ProductionListComponent implements OnInit {
  @Input() productions: Production[]
  @Input() construction: boolean = true
  type: string = 'REALISATION'
  dtOptions: any = {};
  etat: boolean = false
  total = 0
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private productionService: ProductionService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.etat = this.productions ? true : false;
    if(this.etat){ this.productions.forEach(item => { this.total += item?.construction?.budget }) }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PRODUCTION_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PRODUCTION_VALIDATE' || data.action === 'PRODUCTION_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.productions.unshift(row);
  }
  update(row): void {
    const index = this.productions.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.productions[index] = row;
    }
  }
  editProduction(row) {
    this.productionService.setProduction(row)
    this.productionService.edit = true
    this.productionService.construction = null
    this.modal(ProductionAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showProduction(row) {
    this.productionService.setProduction(row)
    this.modal(ProductionShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerProduction(row): void {
    this.productionService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  validateProduction(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cette realisation ?',
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
      this.productionService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'PRODUCTION_VALIDATE', payload: res?.data});
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
        this.productionService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.productions.findIndex(x => x.uuid === item.uuid);
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
  }
  /**
   * Calcule l'évolution globale d'une production basée sur ses optionProductions
   */
  getGlobalProgress(item: Production): number {
    if (!item?.optionProductions || item.optionProductions.length === 0) {
      return 0;
    }
    
    let total = 0;
    let completed = 0;
    
    item.optionProductions.forEach((option: any) => {
      total++;
      if (option?.evolution) {
        completed++;
      }
    });
    
    return total > 0 ? Math.floor((completed * 100) / total) : 0;
  }

  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {}, (reason) => { });
  }
}
