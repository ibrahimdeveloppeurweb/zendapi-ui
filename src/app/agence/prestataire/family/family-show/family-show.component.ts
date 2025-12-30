import { Component, OnInit } from '@angular/core';
import { Family } from '@model/Family';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FamilyService } from '@service/family/family.service';
import { Globals } from '@theme/utils/globals';
import { FamilyAddComponent } from '@agence/prestataire/family/family-add/family-add.component';


@Component({
  selector: 'app-family-show',
  templateUrl: './family-show.component.html',
  styleUrls: ['./family-show.component.scss']
})
export class FamilyShowComponent implements OnInit {
  title: string = ""
  family: Family
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private familyService: FamilyService
  ) {
    this.family = this.familyService.getFamily()
    this.title = "Détails sur la famille " + this.family.libelle
  }

  ngOnInit(): void {
  }

  edit(row) {
    this.modalService.dismissAll()
    this.familyService.setFamily(row)
    this.familyService.edit = true
    this.modal(FamilyAddComponent, 'modal-basic-title', 'md', true, 'static')
  }

  printer(row): void {
    this.familyService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
