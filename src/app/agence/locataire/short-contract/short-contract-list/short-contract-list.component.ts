import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { VALIDATION } from '@theme/utils/functions';
import { ShortContract } from '@model/short-contract';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { ShortContractService } from '@service/short-contract/short-contract.service';
import { ShortContractAddComponent } from '../short-contract-add/short-contract-add.component';
import { ShortContractShowComponent } from '../short-contract-show/short-contract-show.component';
import { ExtendAddComponent } from '@agence/locataire/extend-contract/extend-add/extend-add.component';

@Component({
  selector: 'app-short-contract-list',
  templateUrl: './short-contract-list.component.html',
  styleUrls: ['./short-contract-list.component.scss']
})
export class ShortContractListComponent implements OnInit {
  paye: number = 0;
  total: number = 0;
  impaye: number = 0;
  dtOptions: any = {};
  etat: boolean = false;
  validation = VALIDATION;
  @Input() locataire = true;
  userSession = Globals.user;
  @Input() contracts: ShortContract[];
  global = {country: Globals.country, device: Globals.device}

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private contractService: ShortContractService,
  ) {
  }

  ngOnInit(): void {
    this.etat = this.contracts ? true : false;
    if(this.etat){
      this.contracts.forEach(item => {
        this.total += item?.invoice?.montant
        this.paye += item?.invoice?.paye
        this.impaye += item?.invoice?.impaye
      })
    }
    this.etat = this.contracts ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'SHORT_CONTRACT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'SHORT_CONTRACT_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(contract): void {
    this.contracts.unshift(contract);
  }
  update(row): void {
    const index = this.contracts.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.contracts[index] = row;
    }
  }
  editContract(row): void {
    this.contractService.setShortContract(row);
    this.contractService.edit = true;
    this.modal(ShortContractAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  showContract(row): void {
    this.contractService.setShortContract(row);
    this.modal(ShortContractShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerContract(row): void {
    this.contractService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  extendContract(row): void {
    this.contractService.setShortContract(row);
    this.modal(ExtendAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  activateContract(row) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider ce contrat ?',
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
          this.contractService.activate(row).subscribe((res) => {
          const index = this.contracts.findIndex((x) => {
            return x.uuid === res?.data.uuid;
          });
          if (index !== -1) {
            this.contracts[index] = res?.data;
          }
        });
      }
    });
  }
  delete(contract) {
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
        this.contractService.getDelete(contract.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.contracts.findIndex(x => x.id === contract.id);
            if (index !== -1) {
              this.contracts.splice(index, 1);
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
