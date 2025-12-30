import { Component, Input, OnInit } from '@angular/core';
import { Folder } from '@model/folder';
import { FolderAddComponent } from '@client/folder/folder-add/folder-add.component';
import { PAYMENT, VALIDATION } from '@theme/utils/functions';
import { FolderService } from '@service/folder/folder.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FolderShowComponent } from '@client/folder/folder-show/folder-show.component';
import {EmitterService} from '@service/emitter/emitter.service';
import { DateHelperService } from '@theme/utils/date-helper.service';
import { Globals } from '@theme/utils/globals';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss']
})
export class FolderListComponent implements OnInit {
  @Input() folders: Folder[]
  @Input() action: boolean = true
  @Input() validate: boolean = false
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  VALIDATION = VALIDATION
  PAYMENT = PAYMENT

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private folderService: FolderService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.etat = this.folders ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'FOLDER_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'FOLDER_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.folders.unshift(row);
  }
  update(row): void {
    const index = this.folders.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.folders[index] = row;
    }
  }
  showFolder(row) {
    this.folderService.setFolder(row)
    this.modal(FolderShowComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  editFolder(row) {
    this.folderService.setFolder(row)
    this.folderService.edit = true
    this.modal(FolderAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  activateFolder(row) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider ce dossier ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: 'green',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
          this.folderService.activate(row).subscribe((res) => {
            this.emitter.emit({action: 'FOLDER_ACTIVATE', payload:res?.data});
          const index = this.folders.findIndex((x) => {
            return x.uuid === res?.data.uuid;
          });
          if (index !== -1) {
            this.folders[index] = res?.data;
          }
        });
      }
    });
  }
  printerFolder(row): void {
    this.folderService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  certificateFolder(row): void {
    this.folderService.getPrinter('CERTIFICATE', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer cet enrégistrement ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.folderService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.folders.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.folders.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        });
      }
    });
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => { }, (reason) => { });
  }
  date(value){ return DateHelperService.readable(value); }
}
