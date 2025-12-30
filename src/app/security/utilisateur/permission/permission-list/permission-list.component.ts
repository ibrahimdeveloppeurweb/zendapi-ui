import { PermissionAddComponent } from '@utilisateur/permission/permission-add/permission-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from '@service/permission/permission.service';
import { Permission } from '@model/permission';
import { Globals } from '@theme/utils/globals';
import { Component, OnInit, Input } from '@angular/core';
import { PermissionShowComponent } from '../permission-show/permission-show.component';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss']
})
export class PermissionListComponent implements OnInit {
  @Input() permissions: Permission[]
  type: string = "PERMISSION"
  etat: boolean = false
  dtOptions: any = {};
  global = {country: Globals.country, device: Globals.device}

  constructor(
    private modalService: NgbModal,
    private permissionService: PermissionService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    if(this.permissions){ this.etat = true }
    this.dtOptions = Globals.dataTable;
  }

  showPermission(row) {
    this.permissionService.setPermission(row)
    this.modal(PermissionShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  editPermission(row) {
    this.modalService.dismissAll()
    this.permissionService.setPermission(row)
    this.permissionService.edit = true
    this.modal(PermissionAddComponent, 'modal-basic-title', 'lg', true, 'static')
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
        Swal.fire('', 'Enrégistrement supprimé avec succès !', 'success');
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
}
