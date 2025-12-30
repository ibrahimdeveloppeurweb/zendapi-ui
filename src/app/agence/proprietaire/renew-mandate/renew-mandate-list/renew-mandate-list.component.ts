import { Component, Input, OnInit } from '@angular/core';
import { RenewMandate } from '@model/renew-mandate';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmitterService } from '@service/emitter/emitter.service';
import { RenewMandateService } from '@service/renew-mandate/renew-mandate.service';
import { Globals } from '@theme/utils/globals';
import { RenewMandateAddComponent } from '@proprietaire/renew-mandate/renew-mandate-add/renew-mandate-add.component';
import { RenewMandateShowComponent } from '@proprietaire/renew-mandate/renew-mandate-show/renew-mandate-show.component';

@Component({
  selector: 'app-renew-mandate-list',
  templateUrl: './renew-mandate-list.component.html',
  styleUrls: ['./renew-mandate-list.component.scss']
})
export class RenewMandateListComponent implements OnInit {
  @Input() renews: RenewMandate[]
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  total = 0;

  constructor(
    private modalService: NgbModal,
    private renewMandateService: RenewMandateService,
    private emitter: EmitterService
  ) {
  }

  ngOnInit(): void {
    this.etat = this.renews ? true : false;
    if(this.etat){
      this.renews.forEach(item => {
        this.total = this.total + item?.montantCom
        return
      })
    }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'RENEW_MANDATE_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'RENEW_MANDATE_UPDATED' || data.action === 'RENEW_MANDATE_ACTIVATE') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.renews.unshift(item);
  }
  update(item): void {
    const index = this.renews.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.renews[index] = item;
    }
  }
  editRenewMandate(row) {
    this.renewMandateService.setRenewMandate(row)
    this.renewMandateService.edit = true
    this.modal(RenewMandateAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showRenewMandate(row) {
    this.renewMandateService.setRenewMandate(row)
    this.modal(RenewMandateShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerRenewMandate(row): void {
    this.renewMandateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  activateRenewMandate(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet renouvellement ?',
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
      this.renewMandateService.activate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'RENEW_MANDATE_ACTIVATE', payload: res?.data});
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
        this.renewMandateService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.renews.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.renews.splice(index, 1);
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
