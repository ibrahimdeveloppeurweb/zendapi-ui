import { Component, Input, OnInit } from '@angular/core';
import { SousFamille } from '@model/sous-famille';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { SousFamilleService } from '@service/sousFamille/sous-famille.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';
import { SousFamilleAddComponent } from '../sous-famille-add/sous-famille-add.component';
import { SousFamilleShowComponent } from '../sous-famille-show/sous-famille-show.component';

@Component({
  selector: 'app-sous-famille-list',
  templateUrl: './sous-famille-list.component.html',
  styleUrls: ['./sous-famille-list.component.scss']
})
export class SousFamilleListComponent implements OnInit {
  @Input() sousFamilles: SousFamille[]
  type: string = 'SOUS'
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private sousFamileService: SousFamilleService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'SOUS_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'SOUS_UPDATED') {
        this.update(data.payload);
      }
    });
  }
  appendToList(row): void {
    this.sousFamilles.unshift(row);
  }
  update(row): void {
    const index = this.sousFamilles.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.sousFamilles[index] = row;
    }
  }
  add(){
    this.sousFamileService.edit = false
    this.modal(SousFamilleAddComponent, 'modal-basic-title', 'md', true, 'static')

  }
  edit(item){
    this.sousFamileService.setSousFamille(item)
    this.sousFamileService.edit = true
    this.modal(SousFamilleAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  show(item){
    this.sousFamileService.setSousFamille(item)
    this.sousFamileService.edit = true
    this.modal(SousFamilleShowComponent, 'modal-basic-title', 'lg', true, 'static')
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
        this.sousFamileService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.sousFamilles.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.sousFamilles.splice(index, 1);
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
