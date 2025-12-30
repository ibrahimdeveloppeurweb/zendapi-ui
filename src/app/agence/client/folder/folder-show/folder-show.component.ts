import { FolderAddComponent } from '@client/folder/folder-add/folder-add.component';
import { Component, OnInit } from '@angular/core';
import { Folder } from '@model/folder';
import { Globals } from '@theme/utils/globals';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VALIDATION } from '@theme/utils/functions';
import { FolderService } from '@service/folder/folder.service';
import { UploaderService } from '@service/uploader/uploader.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-folder-show',
  templateUrl: './folder-show.component.html',
  styleUrls: ['./folder-show.component.scss']
})
export class FolderShowComponent implements OnInit {
  publicUrl = environment.publicUrl;
  title: string = "";
  folder: Folder;
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user;
  file: any;
  validation = VALIDATION


  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private folderService: FolderService,
    private uploader: UploaderService
  ) {
    this.folder = this.folderService.getFolder()
    this.title = "Détails du dossier de " + this.folder?.customer?.nom
  }

  ngOnInit(): void {
  }

  editFolder(row) {
    this.modalService.dismissAll()
    this.folderService.setFolder(row)
    this.folderService.edit = true
    this.modal(FolderAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerFolder(row): void {
    this.folderService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
  showFile(item) {
    const fileByFolder = this.uploader.getDataFileByFolder();
    this.file = fileByFolder?.path ? this.publicUrl + '/' + fileByFolder?.path : null;
  }
  closeViewer() {
    this.file = '';
    this.uploader.setDataFileByFolder('');
  }
}
