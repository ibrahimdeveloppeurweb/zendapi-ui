import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FundsNoticeService } from '@service/syndic/funds-notice.service';

@Component({
  selector: 'app-funds-notice-show',
  templateUrl: './funds-notice-show.component.html',
  styleUrls: ['./funds-notice-show.component.scss']
})
export class FundsNoticeShowComponent implements OnInit {

  title: string = ''
  fundsNotice: any

  constructor(
    public modale: NgbActiveModal,
    private fundsNoticeService: FundsNoticeService
  ) { 
    this.fundsNotice = this.fundsNoticeService.getFundsNotice()
    this.title = "Détails sur l'avis d'échéeance " + this.fundsNotice.libelle
  }

  ngOnInit(): void {
  }

}
