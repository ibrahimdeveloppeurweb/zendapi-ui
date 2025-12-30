import { Component, OnInit } from '@angular/core';
import { Notice } from '@model/notice';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NoticeService } from '@service/notice/notice.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-notice-show',
  templateUrl: './notice-show.component.html',
  styleUrls: ['./notice-show.component.scss']
})
export class NoticeShowComponent implements OnInit {
  title: string = ""
  notice: Notice
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private noticeService: NoticeService
  ) {
    this.notice = this.noticeService.getNotice()
    this.title = "Détails sur l'avis d'echenace N° " + this.notice.code
  }

  ngOnInit(): void {
  }
  printerNotice(row): void {
    this.noticeService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
  }
  modal(component, type, size, center, backdrop) {
    this.modalService.open(component, {
      ariaLabelledBy: type,
      size: size,
      centered: center,
      backdrop: backdrop
    }).result.then((result) => {

    }, (reason) => {

    });
  }

}
