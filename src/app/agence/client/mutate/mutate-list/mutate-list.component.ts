import { Mutate } from '@model/mutate';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { VALIDATION } from '@theme/utils/functions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, OnInit } from '@angular/core';
import { MutateService } from '@service/mutate/mutate.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { MutateAddComponent } from '../mutate-add/mutate-add.component';
import { MutateShowComponent } from '../mutate-show/mutate-show.component';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-mutate-list',
  templateUrl: './mutate-list.component.html',
  styleUrls: ['./mutate-list.component.scss']
})
export class MutateListComponent implements OnInit {
  @Input() mutates: Mutate[]
  @Input() client: boolean = true
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  validation = VALIDATION
  total = 0;

  constructor(
    private modalService: NgbModal,
    private mutateService: MutateService,
    private emitter: EmitterService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }

  ngOnInit(): void {
    this.etat = this.mutates ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'MUTATE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'MUTATE_UPDATED' || data.action === 'MUTATE_VALIDATE') {
        this.update(data.payload);
      }
    });
  }
  appendToList(item): void {
    this.mutates.unshift(...item);
  }
  update(item): void {
    const index = this.mutates.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.mutates[index] = item;
    }
  }
  editMutate(row) {
    this.mutateService.setMutate(row)
    this.mutateService.edit = true
    this.modal(MutateAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showMutate(row) {
    this.mutateService.setMutate(row)
    this.modal(MutateShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerMutate(row): void {
    this.mutateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  validateMutate(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet enrégistrement ?',
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
      this.mutateService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'MUTATE_VALIDATE', payload: res?.data});
          }
        }
      });
      }
    });
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
        this.mutateService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.mutates.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.mutates.splice(index, 1);
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
    }).result.then((result) => {}, (reason) => {});
  }
}
