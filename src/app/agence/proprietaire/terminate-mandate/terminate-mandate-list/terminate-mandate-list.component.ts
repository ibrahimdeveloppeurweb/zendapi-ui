import { Component, Input, OnInit } from '@angular/core';
import { TerminateMandate } from '@model/terminate-mandate';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { TerminateMandateService } from '@service/terminate-mandate/terminate-mandate.service';
import { VALIDATION } from '@theme/utils/functions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Globals } from '@theme/utils/globals';
import { TerminateMandateShowComponent } from '../terminate-mandate-show/terminate-mandate-show.component';
import { TerminateMandateAddComponent } from '../terminate-mandate-add/terminate-mandate-add.component';

@Component({
  selector: 'app-terminate-mandate-list',
  templateUrl: './terminate-mandate-list.component.html',
  styleUrls: ['./terminate-mandate-list.component.scss']
})
export class TerminateMandateListComponent implements OnInit {

  @Input() terminates: TerminateMandate[] = []
  @Input() action: boolean = true
  dtOptions: any = {};
  total = 0
  etat: boolean = false
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user
  validation = VALIDATION

  constructor(
    private modalService: NgbModal,
    private terminateMandateService: TerminateMandateService,
    private emitter: EmitterService
  ) {
  }

  ngOnInit(): void {
    this.etat = this.terminates ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'TERMINATE_MANDATE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'TERMINATE_MANDATE_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(terminate): void {
    this.terminates.unshift(terminate);
  }
  update(terminate): void {
    const index = this.terminates.findIndex(x => x.uuid === terminate.uuid);
    if (index !== -1) {
      this.terminates[index] = terminate;
    }
  }
  showTerminateMandate(row) {
    this.terminateMandateService.setTerminate(row);
    this.modal(TerminateMandateShowComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  printerTerminateMandate(row): void {
    this.terminateMandateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  editTerminateMandate(row) {
    this.terminateMandateService.setTerminate(row);
    this.terminateMandateService.edit = true;
    this.modal(TerminateMandateAddComponent, 'modal-basic-title', 'lg', true, 'static');
  }
  validate(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider ce mandat ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Valider <i class="fas fa-check"></i>',
      confirmButtonColor: '#9ccc65',
      timer: 2500,
      reverseButtons: true
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.terminateMandateService.getValidate(item).subscribe(res => {
          if (res?.code === 200) {
            const index = this.terminates.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.terminates[index] = res?.data;
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
          Swal.fire('', error.message, 'error');
        });
      }
    });
  }
  delete(item) {
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment supprimer ce mandat ?',
      icon: '',
      showCancelButton: true,
      showCloseButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer <i class="feather icon-trash"></i>',
      confirmButtonColor: '#d33',
      timer: 2500
    }).then((willDelete) => {
      if (willDelete.dismiss) {
      } else {
        this.terminateMandateService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.terminates.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.terminates.splice(index, 1);
            }
            Swal.fire('', res?.message, res?.status);
          }
        }, error => {
          Swal.fire('', error.message, 'error');
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
