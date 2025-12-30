import { Component, Input, OnInit } from '@angular/core';
import { Family } from '@model/Family';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { Globals } from '@theme/utils/globals';
import { FamilyService } from '@service/family/family.service';
import { FamilyAddComponent } from '@agence/prestataire/family/family-add/family-add.component';
import { FamilyShowComponent } from '@agence/prestataire/family/family-show/family-show.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.scss']
})
export class FamilyListComponent implements OnInit {
  @Input() familys: Family[]
  type: string = 'FAMILY'
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private familyService: FamilyService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.etat = this.familys ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'FAMILY_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'FAMILY_UPDATE') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.familys.unshift(row);
  }
  update(row): void {
    const index = this.familys.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.familys[index] = row;
    }
  }
  edit(row) {
    this.familyService.setFamily(row)
    this.familyService.edit = true
    this.modal(FamilyAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  show(row) {
    this.familyService.setFamily(row);
    this.modal(FamilyShowComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  printer(row): void {
    this.familyService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
        this.familyService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.familys.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.familys.splice(index, 1);
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
