import { Component, OnInit } from '@angular/core';
import { Spent } from '@model/spent';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SpentService } from '@service/spent/spent.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-spent-show',
  templateUrl: './spent-show.component.html',
  styleUrls: ['./spent-show.component.scss']
})
export class SpentShowComponent implements OnInit {
  title: string = "";
  spent: Spent;
  global = {country: Globals.country, device: Globals.device};
  userSession = Globals.user;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private spentService: SpentService
  ) {
    this.spent = this.spentService.getSpent();
    this.title = "Détails de la dépense N° " + this.spent?.code;
  }

  ngOnInit(): void {
  }
  printerSpent(row): void {
    this.spentService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid, null);
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
