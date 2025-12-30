import { Component, Input, OnInit } from '@angular/core';
import { Etape } from '@model/etape';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { EtapeService } from '@service/etape/etape.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';
import { EtapeAddComponent } from '../etape-add/etape-add.component';
import { EtapeShowComponent } from '../etape-show/etape-show.component';

@Component({
  selector: 'app-etape-list',
  templateUrl: './etape-list.component.html',
  styleUrls: ['./etape-list.component.scss']
})
export class EtapeListComponent implements OnInit {
  @Input() etapes: Etape[]
  type: string = 'ETAPE'
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private etapeService: EtapeService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'ETAPE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'ETAPE_UPDATE') {
        this.update(data.payload);
      }
    });
  }
  appendToList(row): void {
    this.etapes.unshift(row);
  }
  update(row): void {
    const index = this.etapes.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.etapes[index] = row;
    }
  }
  add(){
    this.etapeService.edit = false
    this.modal(EtapeAddComponent, 'modal-basic-title', 'md', true, 'static')

  }
  edit(item){
    this.etapeService.setEtape(item)
    this.etapeService.edit = true
    this.modal(EtapeAddComponent, 'modal-basic-title', 'md', true, 'static')
  }
  show(item){
    this.etapeService.setEtape(item)
    this.etapeService.edit = true
    this.modal(EtapeShowComponent, 'modal-basic-title', 'lg', true, 'static')
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
        this.etapeService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.etapes.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.etapes.splice(index, 1);
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
