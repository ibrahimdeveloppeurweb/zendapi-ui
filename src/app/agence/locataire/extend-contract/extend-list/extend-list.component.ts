
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExtendContract } from '@model/extend-contract';
import { Component, Input, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { ExtendAddComponent } from '../extend-add/extend-add.component';
import { ExtendShowComponent } from '../extend-show/extend-show.component';
import { ExtendContractService } from '@service/extend-contract/extend-contract.service';

@Component({
  selector: 'app-extend-list',
  templateUrl: './extend-list.component.html',
  styleUrls: ['./extend-list.component.scss']
})
export class ExtendListComponent implements OnInit {
  total: number = 0;
  dtOptions: any = {};
  etat: boolean = false;
  @Input() locataire = true;
  userSession = Globals.user;
  @Input() extends: ExtendContract[];
  global = {country: Globals.country, device: Globals.device}

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private extendService: ExtendContractService,
  ) {
  }

  ngOnInit(): void {
    this.extends.forEach(item => {
      this.total += item.invoice.montant
    })
    this.etat = this.extends ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'EXTEND_CONTRACT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'EXTEND_CONTRACT_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(rent): void {
    this.extends.unshift(rent);
  }
  update(row): void {
    const index = this.extends.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.extends[index] = row;
    }
  }
  edit(row): void {
    this.extendService.edit = true;
    this.extendService.setExtend(row);
    this.modal(ExtendAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  show(row): void {
    this.extendService.setExtend(row);
    this.modal(ExtendShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printer(row): void {
    this.extendService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  activate(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment activer cet prolongement?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
      this.extendService.activate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'EXTEND_ACTIVATE', payload: res?.data});
          }
        }
      });
      }
    });
  }
  delete(terminate) {
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
        this.extendService.getDelete(terminate.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.extends.findIndex(x => x.id === terminate.id);
            if (index !== -1) {
              this.extends.splice(index, 1);
            }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
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
    }).result.then((result) => {

    }, (reason) => {

    });
  }
}
