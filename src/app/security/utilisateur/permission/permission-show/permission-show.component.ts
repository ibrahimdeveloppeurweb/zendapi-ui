import { PermissionAddComponent } from '@utilisateur/permission/permission-add/permission-add.component';
import { Component, OnInit } from '@angular/core';
import { Permission } from '@model/permission';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionService } from '@service/permission/permission.service';

@Component({
  selector: 'app-permission-show',
  templateUrl: './permission-show.component.html',
  styleUrls: ['./permission-show.component.scss']
})
export class PermissionShowComponent implements OnInit {
  title: string = ""
  permission: Permission

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private permissionService: PermissionService
  ) {
    this.permission = this.permissionService.getPermission()
    this.title = "Détails du permission de " + this.permission?.nom
  }

  ngOnInit(): void {
  }
  editPermission(row) {
    this.modalService.dismissAll()
    this.permissionService.setPermission(row)
    this.permissionService.edit = true
    this.modal(PermissionAddComponent, 'modal-basic-title', 'xl', true, 'static')
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
