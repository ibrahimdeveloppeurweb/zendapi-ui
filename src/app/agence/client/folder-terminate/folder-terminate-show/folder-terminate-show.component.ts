import { Globals } from '@theme/utils/globals';
import { Component, OnInit } from '@angular/core';
import { VALIDATION } from '@theme/utils/functions';
import { FolderTerminate } from '@model/folder-terminate';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FolderTerminateService } from '@service/folder-terminate/folder-terminate.service';
import { FolderTerminateAddComponent } from '../folder-terminate-add/folder-terminate-add.component';

@Component({
  selector: 'app-folder-terminate-show',
  templateUrl: './folder-terminate-show.component.html',
  styleUrls: ['./folder-terminate-show.component.scss']
})
export class FolderTerminateShowComponent implements OnInit {
  terminate ?: FolderTerminate;
  title: string = ""
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  validation = VALIDATION

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private terminateService: FolderTerminateService
  ) {
    this.terminate = this.terminateService.getFolderTerminate();
    this.title = "Détails de la résiliation du dossier N°" + this.terminate?.folder?.code
  }

  ngOnInit(): void {
  }

  editFolderTerminate(row) {
    this.modalService.dismissAll();
    this.terminateService.setFolderTerminate(row);
    this.terminateService.edit = true;
    this.modal(FolderTerminateAddComponent, 'modal-basic-title', 'xl', true, 'static');
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
