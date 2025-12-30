import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { CONFIRMATION, VALIDATION} from '@theme/utils/functions';
import { UploaderService } from '@service/uploader/uploader.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Deposit } from '@model/deposit';
import { DepositService } from '@service/wallet/deposit.service';
import { DepositAddComponent } from '../deposit-add/deposit-add.component';
@Component({
  selector: 'app-deposit-show',
  templateUrl: './deposit-show.component.html',
  styleUrls: ['./deposit-show.component.scss']
})
export class DepositShowComponent implements OnInit {
  
  publicUrl = environment.publicUrl;
  title: string = ""
  deposit: Deposit
  confirmation = CONFIRMATION
  validation = VALIDATION
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  file: any;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private depositService: DepositService,
    private uploader: UploaderService
  ) { 
    
    this.deposit= this.depositService.getDeposit();
    this.title = "Détails du depot de " + this.deposit?.owner?.nom;
  }
  editdeposit(row) {
    this.modalService.dismissAll()
    this.depositService.setDeposit(row)
    this.depositService.edit = true
    this.depositService.type = row.type
    this.modal(DepositAddComponent,'modal-basic-title', 'xl', true, 'static')
  }

  ngOnInit(): void {
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
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }

}

