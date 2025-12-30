import { Component, Input, OnInit } from '@angular/core';
import { ProviderContract } from '@model/prestataire/provider-contract';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { ProviderContractService } from '@service/provider-contract/provider-contract.service';
import { VALIDATION } from '@theme/utils/functions';
import { Globals } from '@theme/utils/globals';
import { NgxPermissionsService } from 'ngx-permissions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ProviderContractAddComponent } from '../provider-contract-add/provider-contract-add.component';
import { ProviderContractShowComponent } from '../provider-contract-show/provider-contract-show.component';

@Component({
  selector: 'app-provider-contract-list',
  templateUrl: './provider-contract-list.component.html',
  styleUrls: ['./provider-contract-list.component.scss']
})
export class ProviderContractListComponent implements OnInit {

  @Input() providerContracts: ProviderContract[]
  @Input() prestataire = true;
  @Input() construction = true;

  dtOptions: any = {};
  etat :boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  validation = VALIDATION
  total = 0;
  modelRef: any;

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private providerContractService: ProviderContractService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.etat = this.providerContracts ? true : false;
    if(this.etat){ this.providerContracts.forEach(item => { this.total += item?.montant }) }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PROVIDER_CONTRACT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PROVIDER_CONTRACT_VALIDATE' || data.action === 'PROVIDER_CONTRACT_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.providerContracts.unshift(row);
  }
  update(row): void {
    const index = this.providerContracts.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.providerContracts[index] = row;
    }
  }
  editProviderContract(row) {
    this.providerContractService.setProviderContract(row)
    this.providerContractService.edit = true
    this.modal(ProviderContractAddComponent, 'modal-basic-title', 'xl', true, 'static')
    this.modelRef.componentInstance.type = row.trustee != null?  "SYNDIC":"LOCATIVE"
  }
  showProviderContract(row) {
    this.providerContractService.setProviderContract(row)
    this.modal(ProviderContractShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerProviderContract(row): void {
    this.providerContractService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  validateProviderContract(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cette facture ?',
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
      this.providerContractService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'PROVIDER_CONTRACT_VALIDATE', payload: res?.data});
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
        this.providerContractService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.providerContracts.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.providerContracts.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
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
