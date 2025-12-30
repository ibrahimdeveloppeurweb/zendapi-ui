import { Notice } from '@model/notice';
import { Globals } from '@theme/utils/globals';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit, Input } from '@angular/core';
import { NoticeService } from '@service/notice/notice.service';
import { NoticeShowComponent } from '../notice-show/notice-show.component';

@Component({
  selector: 'app-notice-list',
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.scss']
})
export class NoticeListComponent implements OnInit {
  @Input() notices: Notice[]
  @Input() locataire: boolean = true
  dtOptions: any = {};
  etat: boolean = false
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user
  totalP = 0;
  totalI = 0;
  total = 0;

  constructor(
    private modalService: NgbModal,
    private noticeService: NoticeService
  ) {
  }

  ngOnInit(): void {
    this.etat = this.notices ? true : false;
    if(this.etat){
      this.notices.forEach(item => {
        this.totalP += item?.paye
        this.totalI += item?.impaye
        this.total += item?.montant
      })
    }
    this.dtOptions = Globals.dataTable;
  }

  showNotice(row) {
    this.noticeService.setNotice(row)
    this.modal(NoticeShowComponent, 'modal-basic-title', 'lg', true, 'static')
  }
  printerNotice(row): void {
    this.noticeService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
          this.noticeService.getDelete(item.uuid).subscribe(res => {
        }, error => {
          Swal.fire('', error.message, 'error');
        })
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
