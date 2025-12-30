import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { ProviderContract } from '@model/prestataire/provider-contract';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProviderContractService } from '@service/provider-contract/provider-contract.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { CONFIRMATION, VALIDATION } from '@theme/utils/functions';
import { Globals } from '@theme/utils/globals';
import { ProviderContractAddComponent } from '../provider-contract-add/provider-contract-add.component';

@Component({
  selector: 'app-provider-contract-show',
  templateUrl: './provider-contract-show.component.html',
  styleUrls: ['./provider-contract-show.component.scss']
})
export class ProviderContractShowComponent implements OnInit {

  title: string = ""
  contract: ProviderContract
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user;
  confirmation = CONFIRMATION
  validation = VALIDATION
  file: string;
  publicUrl = environment.publicUrl;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private providerContractService: ProviderContractService
  ) {
    this.contract = this.providerContractService.getProviderContract()
    this.title = "Détails du contrat de " + this.contract.libelle
  }

  ngOnInit(): void {
  }

  editContract(row) {
    this.modalService.dismissAll()
    this.providerContractService.setProviderContract(row)
    this.providerContractService.edit = true
    this.modal(ProviderContractAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerContract(row): void {
    this.providerContractService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
    console.log(this.file);
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }

}
