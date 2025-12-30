import { Component, Input, OnInit } from '@angular/core';
import { Famille } from '@model/famille';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { FamilleService } from '@service/famille/famille.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';
import { FamilleAddComponent } from '../famille-add/famille-add.component';
import { FamilleShowComponent } from '../famille-show/famille-show.component';

@Component({
  selector: 'app-famille-list',
  templateUrl: './famille-list.component.html',
  styleUrls: ['./famille-list.component.scss']
})
export class FamilleListComponent implements OnInit {
  @Input() familles: Famille[]
  type: string = 'FAMILLE'
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private familleService: FamilleService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'FAMILLE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'FAMILLE_UPDATED') {
        this.update(data.payload);
      }
    });
  }
  appendToList(row): void {
    this.familles.unshift(row);
  }
  update(row): void {
    const index = this.familles.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.familles[index] = row;
    }
  }
  add(){
    this.familleService.edit = false
    this.modal(FamilleAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  edit(item){
    this.familleService.setFamille(item)
    this.familleService.edit = true
    this.modal(FamilleAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  show(item){
    this.familleService.setFamille(item)
    this.familleService.edit = true
    this.modal(FamilleShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  delete(item){
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
        this.familleService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.familles.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.familles.splice(index, 1);
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
