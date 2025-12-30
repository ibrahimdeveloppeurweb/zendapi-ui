import { Component, Input, OnInit } from '@angular/core';
import { Procedure } from '@model/procedure';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { ProcedureService } from '@service/procedure/procedure.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgxPermissionsService } from 'ngx-permissions';
import { ProcedureAddComponent } from '../procedure-add/procedure-add.component';
import { ProcedureShowComponent } from '../procedure-show/procedure-show.component';

@Component({
  selector: 'app-procedure-list',
  templateUrl: './procedure-list.component.html',
  styleUrls: ['./procedure-list.component.scss']
})
export class ProcedureListComponent implements OnInit {
  @Input() procedures: Procedure[]
  type: string = 'PROCEDURE'
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private procedureService: ProcedureService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'PROCEDURE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'PROCEDURE_UPDATED') {
        this.update(data.payload);
      }
    });
  }
  appendToList(row): void {
    this.procedures.unshift(row);
  }
  update(row): void {
    const index = this.procedures.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.procedures[index] = row;
    }
  }
  add(){
    this.procedureService.edit = false
    this.modal(ProcedureAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  edit(item){
    this.procedureService.setProcedure(item)
    this.procedureService.edit = true
    this.modal(ProcedureAddComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  show(item){
    this.procedureService.setProcedure(item)
    this.procedureService.edit = true
    this.modal(ProcedureShowComponent, 'modal-basic-title', 'lg', true, 'static')
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
        this.procedureService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.procedures.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.procedures.splice(index, 1);
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
