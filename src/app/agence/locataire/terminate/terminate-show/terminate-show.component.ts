import { NgxPermissionsService } from 'ngx-permissions';
import { Globals } from '@theme/utils/globals';
import { TerminateAddComponent } from '@locataire/terminate/terminate-add/terminate-add.component';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VALIDATION } from '@theme/utils/functions';
import { Terminate } from '@model/terminate';
import { TerminateService } from '@service/terminate/terminate.service';

@Component({
  selector: 'app-terminate-show',
  templateUrl: './terminate-show.component.html',
  styleUrls: ['./terminate-show.component.scss']
})
export class TerminateShowComponent implements OnInit {
  terminate ?: Terminate;
  title: string = ""
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  validation = VALIDATION

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private terminateService: TerminateService,
    private permissionsService: NgxPermissionsService
  ) {
    this.terminate = this.terminateService.getTerminate();
    this.title = "Détails de la résiliation du contrat" + this.terminate?.contract?.libelle
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
  }

  editTerminate(row) {
    this.modalService.dismissAll();
    this.terminateService.setTerminate(row);
    this.terminateService.edit = true;
    this.modal(TerminateAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerTerminate(row): void {
    this.terminateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
