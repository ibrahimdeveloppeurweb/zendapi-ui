
import { Deposit } from '@model/deposit';
import { Globals } from '@theme/utils/globals';
import { VALIDATION } from '@theme/utils/functions';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CONFIRMATION } from '@theme/utils/functions';
import { Component, OnInit, Input } from '@angular/core';
import { DepositService } from '@service/wallet/deposit.service';
import { EmitterService } from '@service/emitter/emitter.service';
import { DepositAddComponent } from '@agence/tresorerie/wallet/deposit-add/deposit-add.component';
import { DepositShowComponent } from '@agence/tresorerie/wallet/deposit-show/deposit-show.component';

@Component({
  selector: 'app-owner-deposit',
  templateUrl: './owner-deposit.component.html',
  styleUrls: ['./owner-deposit.component.scss']
})
export class OwnerDepositComponent implements OnInit {
  @Input() deposits: Deposit[]
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
    private depositService: DepositService,
  ) {
  }

  ngOnInit(): void {
    this.etat = this.deposits ? true : false;
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'DEPOSIT_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'DEPOSIT_UPDATED' || data.action === 'DEPOSIT_VALIDATE') {
        this.update(data.payload);
      }
    });
  }

  appendToList(item): void {
    this.deposits.unshift(...item);
  }
  update(item): void {
    const index = this.deposits.findIndex(x => x.uuid === item.uuid);
    if (index !== -1) {
      this.deposits[index] = item;
    }
  }
  edit(row) {
    this.depositService.setDeposit(row)
    this.depositService.edit = true
    this.modal(DepositAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  show(row) {
    this.depositService.setDeposit(row)
    this.modal(DepositShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  validate(row){
    console.log(row)
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
        let data = {
          uuid: row.uuid
        }
        console.log(data)
        this.depositService.validate(data).subscribe(res => {
          if (res?.status === 'success') {
            if (row) {
              this.emitter.emit({action: 'DEPOSIT_VALIDATE', payload: res?.data});
            }
          }
        });
      }
    });
  }
  printer(row): void {
    this.depositService.getItem('DEPOSIT', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
        this.depositService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.deposits.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.deposits.splice(index, 1);
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
