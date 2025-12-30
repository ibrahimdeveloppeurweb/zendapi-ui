import { Component, Input, OnInit } from '@angular/core';
import { Funding } from '@model/funding';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FundingService } from '@service/funding/funding.service';
import { FundingAddComponent } from '../funding-add/funding-add.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FundingShowComponent } from '../funding-show/funding-show.component';
import { Globals } from '@theme/utils/globals';
import { VALIDATION } from '@theme/utils/functions';
import { EmitterService } from '@service/emitter/emitter.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-funding-list',
  templateUrl: './funding-list.component.html',
  styleUrls: ['./funding-list.component.scss']
})
export class FundingListComponent implements OnInit {
  @Input() fundings: Funding[]
  @Input() construction: boolean = true
  type: string = 'FINANCEMENT'
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  validation = VALIDATION
  totalA = 0;
  totalP = 0;


  constructor(
    private modalService: NgbModal,
    private emitter: EmitterService,
    private fundingService: FundingService,
    private permissionsService: NgxPermissionsService
  ) {
    const permission = JSON.parse(localStorage.getItem('permission-zen')) ? JSON.parse(localStorage.getItem('permission-zen')) : [];
    this.permissionsService.loadPermissions(permission);
  }
  ngOnInit(): void {
    this.etat = this.fundings ? true : false;
    if(this.etat){ this.fundings.forEach(item => {
      this.totalP += item?.montantP
      this.totalA += item?.montantA
    }) }
    this.dtOptions = Globals.dataTable;
    this.emitter.event.subscribe((data) => {
      if (data.action === 'FUNDING_ADD') {
        this.appendToList(data.payload);
      }
      if (data.action === 'FUNDING_VALIDATE' || data.action === 'FUNDING_UPDATED') {
        this.update(data.payload);
      }
    });
  }

  appendToList(row): void {
    this.fundings.unshift(row);
  }
  update(row): void {
    const index = this.fundings.findIndex(x => x.uuid === row.uuid);
    if (index !== -1) {
      this.fundings[index] = row;
    }
  }
  editFunding(row) {
    this.fundingService.setFunding(row)
    this.fundingService.edit = true
    this.modal(FundingAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  showFunding(row) {
    this.fundingService.setFunding(row)
    this.fundingService.construction = null
    this.modal(FundingShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerFunding(row): void {
    this.fundingService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  validateFunding(row){
    Swal.fire({
      title: '',
      text: 'Voulez-vous vraiment valider cet devis ?',
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
      this.fundingService.validate(row).subscribe(res => {
        if (res?.status === 'success') {
          if (row) {
            this.emitter.emit({action: 'FUNDING_VALIDATE', payload: res?.data});
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
        this.fundingService.getDelete(item.uuid).subscribe((res: any) => {
          if (res?.code === 200) {
            const index = this.fundings.findIndex(x => x.uuid === item.uuid);
            if (index !== -1) {
              this.fundings.splice(index, 1);
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
