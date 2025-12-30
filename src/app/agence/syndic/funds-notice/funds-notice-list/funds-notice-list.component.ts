import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FundsNoticeService } from '@service/syndic/funds-notice.service';
import { Globals } from '@theme/utils/globals';
import { FundsNoticeShowComponent } from '../funds-notice-show/funds-notice-show.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-funds-notice-list',
  templateUrl: './funds-notice-list.component.html',
  styleUrls: ['./funds-notice-list.component.scss']
})
export class FundsNoticeListComponent implements OnInit {

  @Input() fundsNotices: any[] = [] 
  dtOptions = {}

  constructor(
    private modalService: NgbModal,
    private fundsNoticeService: FundsNoticeService
  ) { }

  ngOnInit(): void {
    this.dtOptions = Globals.dataTable
  }

  show(row){
    this.fundsNoticeService.setFundsNotice(row)
    this.modal(FundsNoticeShowComponent, 'modal-basic-title', 'lg', true, 'static')
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
        this.fundsNoticeService.getDelete(item?.uuid).subscribe((res: any) => {
          if (res?.status === 'success') {
            const index = this.fundsNotices.findIndex(x => x.id === item.id);
            if (index !== -1) { this.fundsNotices.splice(index, 1); }
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

}
