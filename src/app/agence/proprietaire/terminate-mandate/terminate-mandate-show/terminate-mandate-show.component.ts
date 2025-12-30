import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { VALIDATION } from '@theme/utils/functions';
import { NgxPermissionsService } from 'ngx-permissions';
import { TerminateMandate } from '@model/terminate-mandate';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MandateAddComponent } from '@proprietaire/mandate/mandate-add/mandate-add.component';
import { TerminateMandateService } from '@service/terminate-mandate/terminate-mandate.service';
import { TerminateMandateAddComponent } from '../terminate-mandate-add/terminate-mandate-add.component';

@Component({
  selector: 'app-terminate-mandate-show',
  templateUrl: './terminate-mandate-show.component.html',
  styleUrls: ['./terminate-mandate-show.component.scss']
})
export class TerminateMandateShowComponent implements OnInit {
  title: string = '';
  terminate: TerminateMandate;
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user;
  validation = VALIDATION

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private terminateMandateService: TerminateMandateService,
    private permissionsService: NgxPermissionsService
  ) {
    this.terminate = this.terminateMandateService.getTerminate();
    this.title = 'Détails du mandate du bien ' + this.terminate?.mandate?.house?.nom;
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
  }
  editMandale(row) {
    this.modalService.dismissAll();
    this.terminateMandateService.setTerminate(row);
    this.terminateMandateService.edit = true;
    this.modal(MandateAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }

  editTerminateMandate(row) {
    this.modalService.dismissAll()
    this.terminateMandateService.setTerminate(row);
    this.terminateMandateService.edit = true;
    this.modal(TerminateMandateAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  printerMandate(row): void {
    this.terminateMandateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
