import { Globals } from '@theme/utils/globals';
import { IsletAddComponent } from '@lotissement/islet/islet-add/islet-add.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IsletService } from '@service/islet/islet.service';
import { Islet } from '@model/islet';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-islet-show',
  templateUrl: './islet-show.component.html',
  styleUrls: ['./islet-show.component.scss']
})
export class IsletShowComponent implements OnInit {
  title: string = ""
  islet: Islet
  global = { country: Globals.country, device: Globals.device }
  userSession = Globals.user;
  total: number = 0

  constructor(
    public modale: NgbActiveModal,
    private modalService: NgbModal,
    private isletService: IsletService
  ) {
    this.islet = this.isletService.getIslet()
    this.title = "Détails sur de l'ilot N°" + this.islet?.numero
  }

  ngOnInit(): void {
    this.islet?.lots?.forEach((item) => {
      this.total += item.montant
    })
  }
  visite3D(){
    var url = 'https://zen360.zenapi.immo/viewer/index.php?code=c9f0f895fb98ab9159f51fd0297e236d';
    window.open(url, '_blank');
  }
  editIslet(data) {
    this.isletService.setIslet(data)
    this.isletService.edit = true
    this.modal(IsletAddComponent, 'modal-basic-title', 'xl', true, 'static')
  }
  printerIslet(row): void {
    this.isletService.getPrinter('SHOW', this.userSession?.agencyKey, this.userSession?.uuid, row?.uuid);
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
