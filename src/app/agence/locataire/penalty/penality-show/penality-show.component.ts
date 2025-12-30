import { Component, OnInit } from '@angular/core';
import { Penality } from '@model/penality';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PAYMENT } from '@theme/utils/functions';
import { PenalityService } from '@service/penality/penality.service';
import { Globals } from '@theme/utils/globals';

@Component({
  selector: 'app-penality-show',
  templateUrl: './penality-show.component.html',
  styleUrls: ['./penality-show.component.scss']
})
export class PenalityShowComponent implements OnInit {
  title: string = ""
  penality: Penality
  global = { country: Globals.country, device: Globals.device }
  payment = PAYMENT
  userSession = Globals.user

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private penalityService: PenalityService
  ) {
    this.penality = this.penalityService.getPenality()
    this.title = "Détails de " + this.penality?.libelle
  }

  ngOnInit(): void {
  }
  printerPenality(row): void {
    this.penalityService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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

