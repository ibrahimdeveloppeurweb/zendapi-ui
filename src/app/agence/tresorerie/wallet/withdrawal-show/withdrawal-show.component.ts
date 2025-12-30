import { environment } from '@env/environment';
import { Globals } from '@theme/utils/globals';
import { Withdrawll } from '@model/withdrawll';
import { Component, OnInit } from '@angular/core';
import { CONFIRMATION, VALIDATION} from '@theme/utils/functions';
import { UploaderService } from '@service/uploader/uploader.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WithdrallService } from '@service/wallet/withdrawll.service';
import { WithdrawalAddComponent } from '../withdrawal-add/withdrawal-add.component';

@Component({
  selector: 'app-withdrawal-show',
  templateUrl: './withdrawal-show.component.html',
  styleUrls: ['./withdrawal-show.component.scss']
})
export class WithdrawalShowComponent implements OnInit {
  
  publicUrl = environment.publicUrl;
  title: string = ""
  withdrawll: Withdrawll
  
  confirmation = CONFIRMATION
  validation = VALIDATION
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  file: any;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private withdrallService: WithdrallService,
    private uploader: UploaderService
  ) { 
    
    this.withdrawll= this.withdrallService.getWithdrawll();
    this.title = "Détails du retrait de " + this.withdrawll?.owner?.nom;
  }
  editWithdrawll(row) {
    this.modalService.dismissAll()
    this.withdrallService.setWithdrawll(row)
    this.withdrallService.edit = true
    this.withdrallService.type = row.type
    this.modal(WithdrawalAddComponent,'modal-basic-title', 'xl', true, 'static')
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
