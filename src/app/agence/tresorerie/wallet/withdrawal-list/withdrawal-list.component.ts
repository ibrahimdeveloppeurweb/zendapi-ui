
import { Globals } from '@theme/utils/globals';
import { CONFIRMATION } from '@theme/utils/functions';
import { VALIDATION } from '@theme/utils/functions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { EmitterService } from '@service/emitter/emitter.service';
import { Withdrawll } from '@model/withdrawll';
import { WithdrallService } from '@service/wallet/withdrawll.service';
import { WithdrawalAddComponent } from '../withdrawal-add/withdrawal-add.component';
import { WithdrawalShowComponent } from '../withdrawal-show/withdrawal-show.component';

@Component({
  selector: 'app-withdrawal-list',
  templateUrl: './withdrawal-list.component.html',
  styleUrls: ['./withdrawal-list.component.scss']
})
export class WithdrawalListComponent implements OnInit {
  @Input() withdrawlls: Withdrawll[]
  @Input() owner: boolean = true
  @Input() action: boolean = true
  dtOptions: any = {};
  etat: boolean = false
  confirmation = CONFIRMATION
  validation = VALIDATION
  global = {country: Globals.country, device: Globals.device}
  total: number = 0;
  userSession = Globals.user

  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private withdrawllService: WithdrallService,
  ) {
  }

  ngOnInit(): void {
    this.etat = this.withdrawlls ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'WITHDRAWLL_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'WITHDRAWLL_UPDATED' || data.action === 'WITHDRAWLL_VALIDATE') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.withdrawlls.unshift(...item);
  }
  update(item): void {
    const index = this.withdrawlls.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.withdrawlls[index] = item;
    }
  }
  edit(row) {
    this.withdrawllService.setWithdrawll(row)
    this.withdrawllService.edit = true
    this.modal(WithdrawalAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  show(row) {
    this.withdrawllService.setWithdrawll(row)
    this.modal(WithdrawalShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  validate(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet paiement ?',
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
      this.withdrawllService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'WITHDRAWLL_VALIDATE', payload: res?.data});
          }
        }
      });
      }
    });
  }
  printerPayment(row): void {
    // this.withdrawllService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
        this.withdrawllService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.withdrawlls.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.withdrawlls.splice(index, 1);
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
