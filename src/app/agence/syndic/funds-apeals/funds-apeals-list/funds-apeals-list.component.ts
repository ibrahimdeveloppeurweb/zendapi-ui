import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FundsapealService } from '@service/syndic/fundsapeal.service';
import { Globals } from '@theme/utils/globals';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FundsApealsShowComponent } from '../funds-apeals-show/funds-apeals-show.component';
import { FundsPaymentAddComponent } from '@agence/syndic/funds-payment/funds-payment-add/funds-payment-add.component';
import { FundsPaymentService } from '@service/syndic/funds-payment.service';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-funds-apeals-list',
  templateUrl: './funds-apeals-list.component.html',
  styleUrls: ['./funds-apeals-list.component.scss']
})
export class FundsApealsListComponent implements OnInit {

  @Input() fundsapeals: any[] = []
  @Input() montant: number
  @Input() paye: number
  @Input() reste: number
  dtOptions = {}
  userSession = Globals.user;

  constructor(
    private modalService: NgbModal,
    private fundsApealsService: FundsapealService,
    private fundsPaymentService: FundsPaymentService,
    private permissionsService: NgxPermissionsService
   ) {
     const permission = JSON.parse(localStorage.getItem('permission-zen'))
       ? JSON.parse(localStorage.getItem('permission-zen'))
       : [];
     this.permissionsService.loadPermissions(permission);
 
   }

  ngOnInit(): void {
    console.log(this.fundsapeals);
    
    this.dtOptions = Globals.dataTable
  }

  show(row){
    this.fundsApealsService.setFundSapeal(row)
    this.modal(FundsApealsShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }

  addProvision(row){
    console.log(row);
    
    this.modalService.dismissAll();
    this.fundsPaymentService.edit = false;
    this.fundsPaymentService.type = 'SYNDIC';
    this.fundsPaymentService.uuidSyndic = row.trustee.uuid;
    this.fundsPaymentService.fundsApeal = row;
    this.modal(FundsPaymentAddComponent, 'modal-basic-title', 'xl', true, 'static')
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
        this.fundsApealsService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.fundsapeals.findIndex(x => x.id === item.id);
            if (index !== -1) { this.fundsapeals.splice(index, 1); }
            Swal.fire('', 'La suppression a été éffectuée avec succès !', 'success');
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
    }).result.then((result) => {
    }, (reason) => { });
  }

  printerFundsApeal(row): void {
    this.fundsApealsService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, null, row.uuid, row.trustee.uuid);
  }

}
