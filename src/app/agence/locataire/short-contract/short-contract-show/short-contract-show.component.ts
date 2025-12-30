
import { Invoice } from '@model/invoice';
import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { ShortContract } from '@model/short-contract';
import { NgxPermissionsService } from 'ngx-permissions';
import { UploaderService } from '@service/uploader/uploader.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShortContractService } from '@service/short-contract/short-contract.service';
import { ShortContractAddComponent } from '../short-contract-add/short-contract-add.component';

@Component({
  selector: 'app-short-contract-show',
  templateUrl: './short-contract-show.component.html',
  styleUrls: ['./short-contract-show.component.scss']
})
export class ShortContractShowComponent implements OnInit {
  file: any;
  title = '';
  invoice: Invoice
  contract: ShortContract;
  userSession = Globals.user
  publicUrl = environment.publicUrl;
  global = {country: Globals.country, device: Globals.device}
  totalQte: number = 0;
  totalPrix: number = 0;
  totalRemise: number = 0;
  totalMontant: number = 0;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private contractService: ShortContractService,
    private permissionsService: NgxPermissionsService
  ) {
    this.contract = this.contractService.getShortContract()
    this.title = "Détails du " + this.contract?.libelle
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
  }

  onCalcul(){
    this.contract?.invoice?.options.forEach(item =>{
      this.totalQte += item?.qte;
      this.totalPrix += item?.prix;
      this.totalRemise += item?.remise;
      this.totalMontant += item?.total;
    } )
  }

  editContract(row) {
    this.modalService.dismissAll();
    this.contractService.setShortContract(row);
    this.contractService.edit = true;
    this.modal(ShortContractAddComponent, 'modal-basic-title', 'xl', true, 'static');
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
