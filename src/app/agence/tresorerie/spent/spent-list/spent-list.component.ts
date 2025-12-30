import { Spent } from '@model/spent';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { VALIDATION } from '@theme/utils/functions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { SpentService } from '@service/spent/spent.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { SpentAddComponent } from '../spent-add/spent-add.component';
import { SpentShowComponent } from '@agence/tresorerie/spent/spent-show/spent-show.component';

@Component({
  selector: 'app-spent-list',
  templateUrl: './spent-list.component.html',
  styleUrls: ['./spent-list.component.scss']
})
export class SpentListComponent implements OnInit {
  @Input() spents: Spent[];
  @Input() action: boolean = true
  @Input() tresorerie = true;
  VALIDATION = VALIDATION
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  total = 0;

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private spentService: SpentService
  ) {
  }

  ngOnInit(): void {
    this.etat = this.spents ? true : false;
    if(this.etat){ this.spents.forEach(item => { this.total += item?.montant }) }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'SPPENT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'SPENT_UPDATED' || data.action === 'SPENT_VALIDATE' || data.action === 'SPENT_CONFIRMATE') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.spents.unshift(row);
  }
  update(row): void {
    const index = this.spents.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.spents[index] = row;
    }
  }
  editSpent(row): void {
    this.spentService.setSpent(row);
    this.spentService.edit = true;
    this.spentService.treasury = row?.treasury?.uuid;
    this.modal(SpentAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showSpent(row) {
    this.spentService.setSpent(row)
    this.modal(SpentShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerSpent(row): void {
    this.spentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid, null);
  }
  validateSpent(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet approvisiionnement ?',
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
      this.spentService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'SPENT_VALIDATE', payload: res?.data});
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
        this.spentService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.spents.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.spents.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
  }
  modal(component, type, size, center, backdrop): void {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
}
