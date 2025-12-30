import { Famille } from '@model/famille';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FamilleService } from '@service/famille/famille.service';
import { FamilleAddComponent } from '../famille-add/famille-add.component';

@Component({
  selector: 'app-famille-show',
  templateUrl: './famille-show.component.html',
  styleUrls: ['./famille-show.component.scss']
})
export class FamilleShowComponent implements OnInit {

  title: string = ""
  famille: Famille
  constructor(
    private modalService: NgbModal,
    public modale: NgbActiveModal,
    private familleService: FamilleService
  ) { 
    this.famille = this.familleService.getFamille()
    this.title = "Détails categorie " + this.famille.libelle
  }

  ngOnInit(): void {
  }

  edit(){
    this.familleService.setFamille(this.famille)
    this.familleService.edit = true
    this.modal(FamilleAddComponent, 'modal-basic-title', 'lg', true, 'static')
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
