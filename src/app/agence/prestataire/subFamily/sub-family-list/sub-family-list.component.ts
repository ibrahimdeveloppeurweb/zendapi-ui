import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { FamilyService } from '@service/family/family.service';
import { FamilyAddComponent } from '@agence/prestataire/family/family-add/family-add.component';
import { FamilyShowComponent } from '@agence/prestataire/family/family-show/family-show.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';
import { SubFamily } from '@model/sub-family';
import { SubFamilyAddComponent } from '../sub-family-add/sub-family-add.component';
import { SubFamilyShowComponent } from '../sub-family-show/sub-family-show.component';
import { SubFamilyService } from '@service/subFamily/sub-family.service';
@Component({
  selector: 'app-sub-family-list',
  templateUrl: './sub-family-list.component.html',
  styleUrls: ['./sub-family-list.component.scss']
})
export class SubFamilyListComponent implements OnInit {

  @Input() subFamilys: SubFamily[]
  type: string = 'SUBFAMILY'
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private subFamilyService: SubFamilyService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.etat = this.subFamilys ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'SUBFAMILY_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'SUBFAMILY_UPDATE') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.subFamilys.unshift(row);
  }
  update(row): void {
    const index = this.subFamilys.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.subFamilys[index] = row;
    }
  }
  edit(row) {
    this.subFamilyService.setSubFamily(row)
    this.subFamilyService.edit = true
    this.modal(SubFamilyAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  show(row) {
    this.subFamilyService.setSubFamily(row);
    this.modal(SubFamilyShowComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  printer(row): void {
    this.subFamilyService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
        this.subFamilyService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.subFamilys.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.subFamilys.splice(index, 1);
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
