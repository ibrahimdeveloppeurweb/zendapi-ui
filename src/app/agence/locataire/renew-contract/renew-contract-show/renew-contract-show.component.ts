import {Renew} from '@model/renew';
import { Globals } from '@theme/utils/globals';
import {Component, OnInit} from '@angular/core';
import {RenewService} from '@service/renew/renew.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { RenewContractAddComponent } from '@locataire/renew-contract/renew-contract-add/renew-contract-add.component';
@Component({
  selector: 'app-renew-contract-show',
  templateUrl: './renew-contract-show.component.html',
  styleUrls: ['./renew-contract-show.component.scss']
})
export class RenewContractShowComponent implements OnInit {
  title = '';
  renew: Renew;
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user


  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private renewService: RenewService
  ) {
    this.renew = this.renewService.getRenew()
    this.title = "Détails du renouvellement" + this.renew?.code
  }

  ngOnInit(): void {
  }

  editRenew(row) {
    this.modalService.dismissAll();
    this.renewService.setRenew(row);
    this.renewService.edit = true;
    this.modal(RenewContractAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  printerRenew(row): void {
    this.renewService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
