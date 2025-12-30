import { NgxPermissionsService } from 'ngx-permissions';
import { Component, OnInit } from '@angular/core';
import { RenewMandate } from '@model/renew-mandate';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RenewMandateService } from '@service/renew-mandate/renew-mandate.service';
import { Globals } from '@theme/utils/globals';
import { RenewMandateAddComponent } from '@proprietaire/renew-mandate/renew-mandate-add/renew-mandate-add.component';

@Component({
  selector: 'app-renew-mandate-show',
  templateUrl: './renew-mandate-show.component.html',
  styleUrls: ['./renew-mandate-show.component.scss']
})
export class RenewMandateShowComponent implements OnInit {
  title = '';
  renew: RenewMandate;
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private renewMandateService: RenewMandateService,
    private permissionsService: NgxPermissionsService
    ) {
      this.renew = this.renewMandateService.getRenewMandate()
      this.title = "Détails du renouvellement N˚" + this.renew?.code
      const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
      this.permissionsService.loadPermissions(permission);
    }

  ngOnInit(): void {
  }

  editRenew(row) {
    this.modalService.dismissAll();
    this.renewMandateService.setRenewMandate(row);
    this.renewMandateService.edit = true;
    this.modal(RenewMandateAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerRenewMandate(row): void {
    this.renewMandateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
