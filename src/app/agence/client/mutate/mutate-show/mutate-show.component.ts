import { MutateAddComponent } from '@client/mutate/mutate-add/mutate-add.component';
import { Component, OnInit } from '@angular/core';
import { Mutate } from '@model/mutate';
import { Globals } from '@theme/utils/globals';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VALIDATION } from '@theme/utils/functions';
import { MutateService } from '@service/mutate/mutate.service';

@Component({
  selector: 'app-mutate-show',
  templateUrl: './mutate-show.component.html',
  styleUrls: ['./mutate-show.component.scss']
})
export class MutateShowComponent implements OnInit {
  title: string = ""
  mutate: Mutate
  global = {country: Globals.country, device: Globals.device}
  userSession = Globals.user;
  validation = VALIDATION

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private mutateService: MutateService
  ) {
    this.mutate = this.mutateService.getMutate()
    this.title = "Détails de la mutation du dossier de " + this.mutate?.folder?.customer?.nom
  }

  ngOnInit(): void {
  }

  editMutate(row) {
    this.modalService.dismissAll()
    this.mutateService.setMutate(row)
    this.mutateService.edit = true
    this.modal(MutateAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }

  printerMutate(row): void {
    this.mutateService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
