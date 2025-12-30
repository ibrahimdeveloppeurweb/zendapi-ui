import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '@theme/utils/globals';
import { FamilyAddComponent } from '@agence/prestataire/family/family-add/family-add.component';
import { SubFamily } from '@model/sub-family';
import { SubFamilyService } from '@service/subFamily/sub-family.service';

@Component({
  selector: 'app-sub-family-show',
  templateUrl: './sub-family-show.component.html',
  styleUrls: ['./sub-family-show.component.scss']
})
export class SubFamilyShowComponent implements OnInit {
  title: string = ""
  subFamily: SubFamily
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private subFamilyService: SubFamilyService
  ) {
    this.subFamily = this.subFamilyService.getSubFamily()
    this.title = "Détails sur la famille " + this.subFamily.libelle
  }

  ngOnInit(): void {
  }

  edit(row) {
    this.modalService.dismissAll()
    this.subFamilyService.setSubFamily(row)
    this.subFamilyService.edit = true
    this.modal(FamilyAddComponent, 'modal-basic-title', 'md', true, 'static')
  }

  printer(row): void {
    this.subFamilyService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
