import { NgxPermissionsService } from 'ngx-permissions';
import { Globals } from '@theme/utils/globals';
import { MandateAddComponent } from '@proprietaire/mandate/mandate-add/mandate-add.component';
import { Component, OnInit } from '@angular/core';
import { Mandate } from '@model/mandate';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VALIDATION } from '@theme/utils/functions';
import { MandateService } from '@service/mandate/mandate.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-mandate-show',
  templateUrl: './mandate-show.component.html',
  styleUrls: ['./mandate-show.component.scss']
})
export class MandateShowComponent implements OnInit {
  title: string = '';
  mandate: Mandate;
  publicUrl = environment.publicUrl;
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user;
  validation = VALIDATION
  file: any;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private uploader: UploaderService,
    private mandateService: MandateService,
    private permissionsService: NgxPermissionsService
  ) {
    this.mandate = this.mandateService.getMandate();
    this.title = 'Détails du mandate du bien ' + this.mandate?.house?.nom;
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
  }

  editMandale(row) {
    this.modalService.dismissAll();
    this.mandateService.setMandate(row);
    this.mandateService.edit = true;
    this.modal(MandateAddComponent, 'modal-basic-title', 'xl', true, 'static');
  }
  printerMandate(row): void {
    this.mandateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + JSON.parse(localStorage.getItem('token-zen-data'))?.path + 'signe/mandat/' + fileByFolder?.path : null;
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
