import { HomeTypeShowComponent } from '@promotion/home-type/home-type-show/home-type-show.component';

import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HomeType } from '@model/home-type';
import { Component, Input, OnInit } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { HomeTypeService } from '@service/home-type/home-type.service';
import { HomeTypeAddComponent } from '@promotion/home-type/home-type-add/home-type-add.component';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-home-type-list',
  templateUrl: './home-type-list.component.html',
  styleUrls: ['./home-type-list.component.scss']
})
export class HomeTypeListComponent implements OnInit {
  @Input() homeTypes: HomeType[]
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  total = 0;

  constructor(
    private modalService: NgbModal,
    private homeTypeService: HomeTypeService,
    private emitter: EmitterService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.etat = this.homeTypes ? true : false;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'HOME_TYPE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'HOME_TYPE_UPDATE') {
        this.update(data.payload);
      }
    });
  }
  appendToList(item): void {
    this.homeTypes.unshift(...item);
  }
  update(item): void {
    const index = this.homeTypes.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.homeTypes[index] = item;
    }
  }
  editHomeType(row) {
    this.homeTypeService.setHomeType(row)
    this.homeTypeService.edit = true
    this.homeTypeService.type = row.type
    this.modal(HomeTypeAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  showHomeType(row) {
    this.homeTypeService.setHomeType(row)
    this.modal(HomeTypeShowComponent, 'modal-basic-title', 'lg', true, 'static')
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
        this.homeTypeService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.homeTypes.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.homeTypes.splice(index, 1);
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
}
