import { NgxPermissionsService } from 'ngx-permissions';
import {Invoice} from '@model/invoice';
import {Contract} from '@model/contract';
import { Globals } from '@theme/utils/globals';
import {Component, OnInit} from '@angular/core';
import {ContractService} from '@service/contract/contract.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ContractAddComponent} from '@locataire/contract/contract-add/contract-add.component';
import { environment } from '@env/environment';
import { UploaderService } from '@service/uploader/uploader.service';

@Component({
  selector: 'app-contract-show',
  templateUrl: './contract-show.component.html',
  styleUrls: ['./contract-show.component.scss']
})
export class ContractShowComponent implements OnInit {
  title = '';
  contract: Contract;
  invoice: Invoice
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  file: any;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private contractService: ContractService,
    private permissionsService: NgxPermissionsService
  ) {
    this.contract = this.contractService.getContract()
    console.log(this.contract)
    this.title = "Détails du " + this.contract?.libelle
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
  }

  editContract(row) {
    this.modalService.dismissAll();
    this.contractService.setContract(row);
    this.contractService.edit = true;
    this.modal(ContractAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerContract(row): void {
    this.contractService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + JSON.parse(localStorage.getItem('token-zen-data'))?.path + 'signe/contrat/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
  modal(component, type, size, center, backdrop) {
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
