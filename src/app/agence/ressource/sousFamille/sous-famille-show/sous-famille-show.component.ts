import { SousFamille } from '@model/sous-famille';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SousFamilleService } from '@service/sousFamille/sous-famille.service';
import { SousFamilleAddComponent } from '../sous-famille-add/sous-famille-add.component';

@Component({
  selector: 'app-sous-famille-show',
  templateUrl: './sous-famille-show.component.html',
  styleUrls: ['./sous-famille-show.component.scss']
})
export class SousFamilleShowComponent implements OnInit {

  title: string = ""
  sousFamille: SousFamille
  constructor(
    private modalService: NgbModal,
    public modale: NgbActiveModal,
    private sousFamilleService: SousFamilleService
  ) { 
    this.sousFamille = this.sousFamilleService.getSousFamille()
    this.title = "Détails categorie " + this.sousFamille.libelle
  }

  ngOnInit(): void {
  }

  edit(){
    this.sousFamilleService.setSousFamille(this.sousFamille)
    this.sousFamilleService.edit = true
    this.modal(SousFamilleAddComponent, 'modal-basic-title', 'lg', true, 'static')
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
